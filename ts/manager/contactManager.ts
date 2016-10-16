import {BaseManager} from './baseManager'
import {emoticonManager} from './emoticonManager'


import {contactServer} from '../servers/contactServer'
import {IUser,IMessage,TextInfoMap,IBatchgetContactParams,IGroupMember} from '../models/wxInterface'
import {fetchRemoteImage} from '../tools/chromeTools'

import {UserModel} from '../models/userModel'
import {ContactInListIndex} from '../utility/all'

// BatchgetContact 函数截流

let delayAddBatchgetContact = (function(delay:number){
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

class ContactManager extends BaseManager{
	contacts:{[key:string]:UserModel} = {};
	strangerContacts:{[key:string]:UserModel} = {};
	chatRoomMemberDisplayNames = {};

	private getContactToGetList:IBatchgetContactParams[] = [];

	constructor(){
		super();
		let self = this;
	}
	initContact(seq:number){
		let self = this;
		var seq = 1;
		contactServer.getAllContacts(0).then(result=>{
			self.addContacts(result.MemberList);
			if(seq <= 16 && result.Seq != 0) {
				seq++;
				self.initContact(result.Seq);
			}
		});
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

	addContacts(usersInfo:IUser[],isFromBatchGet?:boolean){
		let self = this;
		usersInfo.forEach(function(userInfo){
			self.addContact(userInfo,isFromBatchGet);
		});
	}

	addContact(userInfo:IUser,isFromBatchGet?:boolean){
		if(userInfo) {
			let user = new UserModel(userInfo);
			if(user.EncryChatRoomId && user.UserName || isFromBatchGet) {
				user.MMFromBatchget = true;
			}
			if(user.RemarkName) {
				user.RemarkName = emoticonManager.transformSpanToImg(user.RemarkName);
			}
			if(user.NickName) {
				user.NickName = emoticonManager.transformSpanToImg(user.NickName);
			}
			if(user.isShieldUser || !user.isContact && !user.isRoomContact) {
				this.addStrangerContact(user);
			}else{
				this.addFriendContact(user);
			}
		}
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
			delayAddBatchgetContact(function(){
				contactServer.batchGetContact(this.getContactToGetList).then(self.batchGetContactSuccess).catch(self.batchGetContactError);
			});
		}
	}

	getUserHeadImage(url:string):Promise<string>{
		if(url.search(/chrome-extension/) == -1) {
			url = contactServer.host + url;
			return contactServer.getImage(url);
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
				user.MemberList.forEach(member=>{
					self.getContact(member.UserName,"",true);
					let memberIndex = ContactInListIndex(self.getContactToGetList,member);
					if(memberIndex > -1) {
						self.getContactToGetList.splice(memberIndex,1);
					}
				});
			}
		});
		self.addContacts(contacts,true);
		if(self.getContactToGetList.length > 0) {
			contactServer.batchGetContact(self.getContactToGetList).then(self.batchGetContactSuccess).catch(self.batchGetContactError);
		}

		return contacts;
	}
	private batchGetContactError(error:any){
		let self = this;
		if(self.getContactToGetList.length) {
			contactServer.batchGetContact(self.getContactToGetList).then(self.batchGetContactSuccess).catch(self.batchGetContactError);
		}
		return error;
	}

	private specialContactHandler(user:UserModel){
		let specialContacts = {
			weixin: TextInfoMap["6c2fc35"],
			filehelper: TextInfoMap["eb7ec65"],
			newsapp: TextInfoMap["0469c27"],
			fmessage: TextInfoMap["a82c4c4"]
		};
		if(specialContacts[user.UserName]) {
			user.UserName = specialContacts[user.UserName];
		}
		if(user.UserName == 'fmessage') {
			user.contactFlag = 0;
		}
	}

	private addFriendContact(user:UserModel){
		this.specialContactHandler(user);
		this.contacts[user.UserName] = user;
		this.getUserHeadImage(user.HeadImgUrl).then(localUrl=>{
			user.HeadImgUrl = localUrl;
		});
	}

	private addStrangerContact(user:UserModel){
		this.strangerContacts[user.UserName] = user;
		this.getUserHeadImage(user.HeadImgUrl).then(localUrl=>{
			user.HeadImgUrl = localUrl;
		});
	}

}


export let contactManager = new ContactManager();