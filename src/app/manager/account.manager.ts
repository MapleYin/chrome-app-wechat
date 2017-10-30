import {Injectable} from '@angular/core';
import {EmoticonManager} from './emoticon.manager'

import {AccountService} from '../service/account.service'
import {CoreService} from '../service/core.service'

import {UserModel} from '../models/user.model'

import {
	IUser,
	IContactHeadImgParams,
	IGroupMember,
	IBatchgetContactParams,
	MText
} from '../defined'


const GET_HEAD_IMG = '/cgi-bin/mmwebwx-bin/webwxgetheadimg';
const GET_ICON = '/cgi-bin/mmwebwx-bin/webwxgeticon';

const DelayAddBatchgetContact = (function(delay:number){
	var timer:number;
	var processFn:Function;
	return function(fn:Function){
		if(!processFn) {
			processFn = fn;	
		}else{
			clearTimeout(timer);
			timer = setTimeout(processFn,delay);
		}
	}
})(200);


const ContactInListIndex = (list:IBatchgetContactParams[],params:IBatchgetContactParams)=>{
	return list.findIndex(value=>{
		return value.UserName == params.UserName;
	});
};


@Injectable()
export class AccountManager {
	isLogin:boolean = false;
	userInfo:UserModel;
	contacts:{[key:string]:UserModel} = {};
	strangerContacts:{[key:string]:UserModel} = {};

	private getContactToGetList:IBatchgetContactParams[] = [];

	constructor(
		private emoticonManager:EmoticonManager,
		private accountService:AccountService,
		private coreService:CoreService) {

	}

	initContact(seq:number){
		let self = this;
		// var count = 1;
		this.accountService.getAllContacts(seq).then(result=>{
			self.addContacts(result.MemberList);
			if(result.Seq && result.Seq != 0) {
				// count++;
				self.initContact(result.Seq);
				NotificationCenter.post('contact.init.fetching');
			}else{
				NotificationCenter.post('contact.init.success');
			}
		}).catch(reason=>{
			console.error(`[ContactManager] error:${reason}`);
			console.log(`Retry at 5 seconds`);
			setTimeout(()=>{
				self.initContact(0);
			});
		});
	}


	updateAccount(userInfo:IUser) {
		this.userInfo = new UserModel(userInfo,true);
		this.isLogin = true;
		this.addContact(userInfo);
	}

	getContact(username:string,chatRoomId?:string,isSingleUser?:boolean):UserModel{
		let self = this;
		var user = this.contacts[username] || this.strangerContacts[username];
		if(isSingleUser) {
			return user;
		}else{
			if(user && UserModel.isRoomContact(username) && user.MemberCount == 0) {
				self.addBatchgetContact({
					UserName : username,
					EncryChatRoomId : chatRoomId || ''
				})
			}
		}
		return user;
	}


	addContact(userInfo:IUser|IGroupMember,isFromBatchGet?:boolean){
		if(userInfo) {
			let user = new UserModel(userInfo);
			if(user.EncryChatRoomId && user.UserName || isFromBatchGet) {
				user.MMFromBatchget = true;
			}
			if(user.RemarkName) {
				user.RemarkName = this.emoticonManager.transformSpanToImg(user.RemarkName);
			}
			if(user.NickName) {
				user.NickName = this.emoticonManager.transformSpanToImg(user.NickName);
			}
			if(user.isShieldUser || !user.isContact && !user.isRoomContact) {
				this.addStrangerContact(user);
			}else{
				this.addFriendContact(user);
			}
		}
	}

	addContacts(usersInfos:IUser[],isFromBatchGet?:boolean){
		let self = this;
		usersInfos.forEach(function(userInfo){
			self.addContact(userInfo,isFromBatchGet);
		});
	}


	addBatchgetChatroomContact(username:string){
		if(UserModel.isRoomContact(username)) {
			let user = this.getContact(username);
			if(!user || !user.MMFromBatchget) {
				this.addBatchgetContact({
					UserName : username
				});
			}
		}
	}
	addBatchgetChatroomMembersContact(username:string){
		let self = this;
		let user = this.getContact(username);
		if(user && user.isRoomContact && !user.MMBatchgetMember && user.MemberCount > 0) {
			console.log(`Get Room Members Info`);
			user.MMBatchgetMember = true;
			user.MemberList.forEach(member=>{
				let memberUser = self.getContact(member.UserName);
				if(memberUser && !memberUser.isContact && !memberUser.MMFromBatchget) {
					self.addBatchgetContact({
						UserName : memberUser.UserName,
						EncryChatRoomId : user.UserName
					});
				}
			})
		}
	}

	addBatchgetContact(contactInfo:IBatchgetContactParams,toTop?:boolean){
		let self = this;
		if(contactInfo && contactInfo.UserName) {
			if(ContactInListIndex(this.getContactToGetList,contactInfo) > -1) {
				return ;
			}
			if(UserModel.isRoomContact(contactInfo.UserName) || toTop) {
				this.getContactToGetList.unshift(contactInfo);
			}else{
				this.getContactToGetList.push(contactInfo);
			}

			// 需要做一个函数截流～
			DelayAddBatchgetContact(function(){
				self.accountService.batchGetContact(self.getContactToGetList).then(result=>{
					return self.batchGetContactSuccess(result);
				}).catch(reason=>{
					return self.batchGetContactError(reason);
				});
			});
		}
	}

	private batchGetContactSuccess(contacts:IUser[]){
		let self = this;
		contacts.forEach(user=>{
			let index = ContactInListIndex(this.getContactToGetList,user);
			if(index > -1) {
				this.getContactToGetList.splice(index,1);
			}
			if(UserModel.isRoomContact(user.UserName) && user.MemberList) {
				user.MemberList.forEach(memberInfo=>{
					let member = self.getContact(memberInfo.UserName,"",true);
					if(!member || !member.isContact) {
						memberInfo.HeadImgUrl = self.getContactHeadImgUrl({
							EncryChatRoomId: user.EncryChatRoomId,
							UserName: memberInfo.UserName
						});
						self.addContact(memberInfo);
						let memberIndex = ContactInListIndex(self.getContactToGetList,member);
						if(memberIndex > -1) {
							self.getContactToGetList.splice(memberIndex,1);
						}
					}
				});
			}
		});
		self.addContacts(contacts,true);
		if(self.getContactToGetList.length > 0) {
			self.accountService.batchGetContact(self.getContactToGetList).then(result=>{
				return self.batchGetContactSuccess(result);
			}).catch(reason=>{
				return self.batchGetContactError(reason);
			});
		}

		return contacts;
	}
	private batchGetContactError(error:any) {
		let self = this;
		if(self.getContactToGetList.length) {
			self.accountService.batchGetContact(self.getContactToGetList).then(result=>{
					return self.batchGetContactSuccess(result);
				}).catch(reason=>{
					return self.batchGetContactError(reason);
				});
		}
		return error;
	}

	private specialContactHandler(user:UserModel) {
		let specialContacts = {
			weixin: MText["6c2fc35"],
			filehelper: MText["eb7ec65"],
			newsapp: MText["0469c27"],
			fmessage: MText["a82c4c4"]
		};
		if(specialContacts[user.UserName]) {
			user.NickName = specialContacts[user.UserName];
		}
		if(user.UserName == 'fmessage') {
			user.contactFlag = 0;
		}
	}

	private addFriendContact(user:UserModel) {
		this.specialContactHandler(user);
		this.contacts[user.UserName] = user;
	}

	private addStrangerContact(user:UserModel) {
		this.strangerContacts[user.UserName] = user;
	}

	private getContactHeadImgUrl(params:IContactHeadImgParams) {
		let url = UserModel.isRoomContact(params.UserName) ? GET_HEAD_IMG : GET_ICON;
		let msgIdQuery = params.MsgId ? `&msgid=${params.MsgId}` : '';
		let chatroomIdQuery = params.EncryChatRoomId ? `&chatroomid=${params.EncryChatRoomId}`:'';
		return `${url}?seq=0&username=${params.UserName}&skey=${this.coreService.Skey}${msgIdQuery}${chatroomIdQuery}`;
	}

}