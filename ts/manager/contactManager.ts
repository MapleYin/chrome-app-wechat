import {BaseManager} from './baseManager'
import {emoticonManager} from './emoticonManager'
import {chatManager} from './chatManager'

import {contactServer} from '../servers/contactServer'
import {IUser,IMessage,TextInfoMap,IBatchgetContactParams,IGroupMember} from '../models/wxInterface'
import {fetchRemoteImage} from '../tools/chromeTools'

import {UserModel} from '../models/userModel'
import {ContactInListIndex} from '../utility/contactListHelper'

import {NotificationCenter} from '../utility/notificationCenter'

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
	account:UserModel;
	contacts:{[key:string]:UserModel} = {};
	strangerContacts:{[key:string]:UserModel} = {};
	// chatRoomMemberDisplayNames = {};

	private getContactToGetList:IBatchgetContactParams[] = [];

	constructor(){
		super();
		let self = this;
	}
	setAccount(userInfo:IUser){
		this.account = new UserModel(userInfo,true);
		this.addContact(userInfo);
	}

	getContact(username:string,chatRoomId?:string,isSingleUser?:boolean):UserModel{
		let self = this;
		var user = this.contacts[username] || this.strangerContacts[username];
		if(!user) {
			// debugger
		}
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

	addContacts(usersInfos:IUser[],isFromBatchGet?:boolean){
		let self = this;
		usersInfos.forEach(function(userInfo){
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
				contactServer.batchGetContact(self.getContactToGetList).then(result=>{
					return self.batchGetContactSuccess(result);
				}).catch(reason=>{
					return self.batchGetContactError(reason);
				});
			});
		}
	}

	getUserHeadImage(url:string):Promise<string>{
		if(url && url.search(/chrome-extension/) == -1) {
			url = contactServer.host + url;
			return contactServer.getImage(url);
		}else{
			return new Promise((resolve,reject)=>{reject();});
		}
	}

	initContact(seq:number){
		let self = this;
		// var count = 1;
		contactServer.getAllContacts(seq).then(result=>{
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
			contactServer.batchGetContact(self.getContactToGetList).then(result=>{
					return self.batchGetContactSuccess(result);
				}).catch(reason=>{
					return self.batchGetContactError(reason);
				});
		}

		return contacts;
	}
	private batchGetContactError(error:any){
		let self = this;
		if(self.getContactToGetList.length) {
			contactServer.batchGetContact(self.getContactToGetList).then(result=>{
					return self.batchGetContactSuccess(result);
				}).catch(reason=>{
					return self.batchGetContactError(reason);
				});
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
			user.NickName = specialContacts[user.UserName];
		}
		if(user.UserName == 'fmessage') {
			user.contactFlag = 0;
		}
	}

	private addFriendContact(user:UserModel){
		this.specialContactHandler(user);
		this.contacts[user.UserName] = user;
	}

	private addStrangerContact(user:UserModel){
		this.strangerContacts[user.UserName] = user;
	}

}


export let contactManager = new ContactManager();