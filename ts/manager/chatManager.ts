import {BaseManager} from './baseManager'
import {contactManager} from './contactManager'
import {messageManager} from './messageManager'
import {UserModel} from '../models/userModel'
import {MessageModel} from '../models/messageModel'
import {IUser,IMessage} from '../models/wxInterface'
import {NotificationCenter} from '../utility/notificationCenter'
import {chatListController} from '../controller/chatListController'
import {chatContentController} from '../controller/chatContentController'
import {notificationManager} from '../manager/notificationManager'

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
			this.onSelectUser(event.userInfo);
		});
		NotificationCenter.on<MessageModel>('message.receive',event=>{
			self.addChatMessage(event.userInfo);
			self.addChatList([event.userInfo.MMPeerUserName]);
			if(document['webkitHidden']) {
				notificationManager.post(event.userInfo);
			}
		});
		NotificationCenter.on<number>('notification.click',event=>{
			let message = messageManager.getMessage(event.userInfo);
			let currentWindow = chrome.app.window.get('MainWindow');
			if(currentWindow) {
				currentWindow.show();
				chatListController.select(message.MMPeerUserName);
			}
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
		this.updateChatList(usernames);
	}

	private onSelectUser(username:string){
		this.currentChatUser = username;
		chatContentController.selectUser(username);
		let user = contactManager.getContact(username);
		if(user && user.MMUnreadMsgCount > 0) {
			user.MMUnreadMsgCount = 0;
			messageManager.statusNotifyMarkRead(user.UserName);
		}
	}

	private updateChatList(usernames?:string[]){
		let self = this;
		let topList = [];
		let normalList = [];
		let changeList = [];

		if(usernames) {
			usernames.forEach(username=>{
				let user = contactManager.getContact(username);
				if(user && !user.isBrandContact && !user.isShieldUser) {
					changeList.push(user);
				}
			});
		}

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
		chatListController.updateChatList(normalList,changeList);
	}
	private addChatMessage(message:MessageModel){
		let user = contactManager.getContact(message.MMPeerUserName);
		if(user.UserName == this.currentChatUser) {
			user.MMUnreadMsgCount = 0;
		}
		chatListController.newMessage(message,user);
		chatContentController.newMessage(message);	
	}
	private sendMessage(content:string){
		if(this.currentChatUser) {
			messageManager.sendTextMessage(this.currentChatUser,content);
		}else{
			console.error(`[ChatManager sendMessage] error currentChatUser:${this.currentChatUser}`);
		}
	}
}



export let chatManager = new ChatManager();