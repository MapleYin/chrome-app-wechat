import {BaseManager} from './baseManager'
import {IMessage,ISyncResponse,StatusNotifyCode,MessageType,ISyncKey} from '../models/wxInterface'
import {UserModel} from '../models/userModel'
import {contactManager} from './contactManager'
import {emoticonManager} from './emoticonManager'
import {chatManager} from './chatManager'
import {messageServer} from '../servers/messageServer'
import {NotificationCenter} from '../utility/notificationCenter'

class MessageManager extends BaseManager{
	private messages;

	constructor(){
		super();
		let self = this;
		NotificationCenter.on<ISyncResponse>('sync.get.success',event=>{
			if(event.userInfo.AddMsgCount) {
				console.log(`${event.userInfo.AddMsgCount} New Message`);
				event.userInfo.AddMsgList.forEach(message=>{
					self.messageProcess(message);
				});
			}
		});
	}

	setSyncKey(SyncKey:ISyncKey){
		messageServer.syncKey = SyncKey;
	}
	initDoneStatusNotify(){
		messageServer.setStatusNotify(contactManager.account.UserName,StatusNotifyCode.INITED);
	}
	startMessageCheck(){
		messageServer.syncCheck();
	}


	sendTextMessage(username:string,content:string):IMessage{
		let message:IMessage = messageServer.createSendingMessage(username,content,MessageType.TEXT);
		this.commonMsgProcess(message);
		//messageServer.sendMessage(message).then().catch();
		messageServer.sendMessage(message).then(result=>{
			message.MsgId = result.MsgId;
		}).catch(reason=>{

		});
		return message;
	}

	private messageProcess(message:IMessage){
		let self = this;
		let user = contactManager.getContact(message.FromUserName,'',true);

		message.MMPeerUserName = (message.FromUserName == contactManager.account.UserName || message.FromUserName == '') ? message.ToUserName : message.FromUserName;

		if(user && !user.isMuted && !user.isSelf && !user.isShieldUser && !user.isBrandContact) {
			// titleRemind.increaseUnreadMsgNum()
		}
		if(message.MsgType == MessageType.STATUSNOTIFY) {
			self.statusNotifyProcessor(message);
			return ;
		}

		if(message.MsgType == MessageType.SYSNOTICE) {
			console.log(message.Content);
			return ;
		}

		if(!(UserModel.isShieldUser(message.FromUserName) ||
			 UserModel.isShieldUser(message.ToUserName) || 
			 message.MsgType == MessageType.VERIFYMSG &&
			 message.RecommendInfo && 
			 message.RecommendInfo.UserName == contactManager.account.UserName)) {
			self.commonMsgProcess(message);
			switch (message.MsgType) {
				case MessageType.TEXT:
					self.textMsgProcess(message);
					break;
				
				default:
					// code...
					break;
			}

			//@TODO href encode
			// message.MMActualContent
			
			let user = contactManager.getContact(message.MMPeerUserName);
			if(!message.MMIsSend && (!user || (!user.isMuted && !user.isBrandContact)) && message.MsgType != MessageType.SYS) {
				// TODO notify
			}
			chatManager.addChatMessage(message);
			chatManager.addChatList([message.MMPeerUserName]);
		}
	}

	private commonMsgProcess(message:IMessage){
		var actualContent = '';
		var username = '';
		message.Content = message.Content || '';
		message.MMDigest = '';
		message.MMIsSend = message.FromUserName == contactManager.account.UserName || message.FromUserName == '';

		if(UserModel.isRoomContact(message.MMPeerUserName)) {
			message.MMIsChatRoom = true;

			actualContent = message.Content.replace(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/,(str,name)=>{
				username = name;
				return ''
			});
			if(username && username != contactManager.account.UserName) {
				let user = contactManager.getContact(username,message.MMPeerUserName);
				if(user) {
					let displayName = user.getDisplayName();
					if(displayName) {
						message.MMDigest = displayName + ':';
					}
				}
			}
		}else{
			message.MMIsChatRoom = false;
			actualContent = message.Content;
		}

		if(!message.MMIsSend && message.MMUnread == undefined && message.MsgType != MessageType.SYS) {
			message.MMUnread = true;
		}

		if(!message.LocalID) {
			message.ClientMsgId = message.LocalID = message.MsgId;
		}

		// emoji
		actualContent = emoticonManager.emoticonFormat(actualContent);

		message.MMActualContent = actualContent;
		message.MMActualSender = username || message.FromUserName;

		//@TODO
		//对消息显示时间的标志
	}

	private statusNotifyProcessor(message:IMessage){
		switch (message.StatusNotifyCode) {
			case StatusNotifyCode.SYNC_CONV:
				chatManager.initChatList(message.StatusNotifyUserName);
				break;
			case StatusNotifyCode.ENTER_SESSION:
				let username = message.FromUserName == contactManager.account.UserName ? message.ToUserName : message.FromUserName;
				chatManager.addChatList([username]);
				break;
			default:
				// code...
				break;
		}
	}

	private textMsgProcess(message:IMessage){
		this.dispatchEvent<IMessage>('userMessage',message);
	}

	private appMsgProcess(message:IMessage){

	}

}

export let messageManager = new MessageManager();