import {BaseManager} from './baseManager'
import {contactManager} from './contactManager'
import {messageManager} from './messageManager'
import {messageServer} from '../servers/messageServer'
import {UserModel} from '../models/userModel'
import {IUser,IMessage} from '../models/wxInterface'
import {NotificationCenter} from '../utility/notificationCenter'

class ChatManager extends BaseManager{
	private chatList:string[] = [];
	chatListInfo:UserModel[] = [];

	initChatList(chatSetString:string){
		let self = this;
		chatSetString.split(',').forEach(username=>{
			if(username && !UserModel.isShieldUser(username) && !UserModel.isSpUser(username)) {
				if(self.chatList.indexOf(username) == -1) {
					self.chatList.push(username);
					if(UserModel.isRoomContact(username)) {
						contactManager.addBatchgetChatroomContact(username);
					}
				}
			}
		});
		this.updateChatList();
		NotificationCenter.post('chat.init.success');
	}

	addChatList(usernames:string[]){
		let self = this;
		usernames.forEach(username=>{
			let index = self.chatList.indexOf(username);
			if(index == -1){
				if(UserModel.isRoomContact(username)) {
					contactManager.addBatchgetChatroomContact(username);
				}
			}else{
				self.chatList.splice(index,1);
			}
			self.chatList.unshift(username);
		});
		this.updateChatList();
		NotificationCenter.post('chat.add.success');
	}

	updateChatList(){
		let self = this;
		let topList = [];
		let normalList = [];
		this.chatList.forEach(username=>{
			let user = contactManager.getContact(username);
			if(user && !user.isBrandContact && !user.isShieldUser) {
				user.isTop ? topList.push(user) : normalList.push(user);
			}
		});
		[].unshift.apply(normalList,topList);
		this.chatListInfo = normalList;
	}

	addChatMessage(message:IMessage){

	}

}



export let chatManager = new ChatManager();