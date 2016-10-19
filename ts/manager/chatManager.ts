import {BaseManager} from './baseManager'
import {contactManager} from './contactManager'
import {messageManager} from './messageManager'
import {messageServer} from '../servers/messageServer'
import {UserModel} from '../models/userModel'
import {MessageModel} from '../models/messageModel'
import {IUser,IMessage} from '../models/wxInterface'
import {NotificationCenter} from '../utility/notificationCenter'
import {chatListController} from '../controller/chatListController'
import {chatContentController} from '../controller/chatContentController'

class ChatManager extends BaseManager{
	private currentChatUser:string;
	private chatList:string[] = [];
	chatListInfo:UserModel[] = [];
	private chatListInfoMap:{[key:string]:UserModel} = {};

	constructor(){
		super();
		let self = this;
		NotificationCenter.on('contact.init.success',()=>{
			self.updateChatList();
		});
		NotificationCenter.on<string>('chatList.select.user',event=>{
			self.currentChatUser = event.userInfo;
			chatContentController.selectUser(event.userInfo);
		});
		NotificationCenter.on<MessageModel>('message.receive',event=>{
			self.addChatMessage(event.userInfo);
			//self.addChatList([event.userInfo.MMPeerUserName]);
		});

		NotificationCenter.on<string>('message.send',event=>{
			self.sendMessage(event.userInfo);
		});
	}

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
	}

	private updateChatList(){
		let self = this;
		let topList = [];
		let normalList = [];
		this.chatList.forEach(username=>{
			let user = contactManager.getContact(username);
			if(user && !user.isBrandContact && !user.isShieldUser) {
				user.isTop ? topList.push(user) : normalList.push(user);
				self.chatListInfoMap[user.UserName] = user;
			}
		});
		[].unshift.apply(normalList,topList);
		this.chatListInfo = normalList;

		// 更新列表
		chatListController.updateChatList(normalList);
	}

	addChatMessage(message:MessageModel){
		let user = contactManager.getContact(message.MMPeerUserName)
		chatListController.newMessage(message,user);
		chatContentController.newMessage(message);	
	}

	sendMessage(content:string){
		messageManager.sendTextMessage(this.currentChatUser,content);
	}

}



export let chatManager = new ChatManager();