import {BaseManager} from './baseManager'
import {IMessage,ISyncResponse,StatusNotifyCode,MessageType,ISyncKey,TextInfoMap} from '../models/wxInterface'
import {UserModel} from '../models/userModel'
import {MessageModel} from '../models/messageModel'
import {contactManager} from './contactManager'
import {emoticonManager} from './emoticonManager'
import {chatManager} from './chatManager'
import {messageServer} from '../servers/messageServer'
import {NotificationCenter} from '../utility/notificationCenter'

class MessageManager extends BaseManager{
	private messages:{[key:number]:MessageModel} = {};

	constructor(){
		super();
		let self = this;
		NotificationCenter.on<ISyncResponse>('sync.get.success',event=>{
			if(event.userInfo.AddMsgCount) {
				event.userInfo.AddMsgList.forEach(message=>{
					self.messageProcess(message);
				});
			}
		});

		NotificationCenter.on('user.status.logout',()=>{
			chrome.runtime.sendMessage({
				command:'OPEN_LOGIN'
			});
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

	getMessage(msgID:number){
		return this.messages[msgID];
	}

	sendTextMessage(username:string,content:string):IMessage{
		let message:IMessage = messageServer.createSendingMessage(username,content,MessageType.TEXT);
		this.messageProcess(message);
		messageServer.sendMessage(message).then(result=>{
			message.MsgId = result.MsgId;
		}).catch(reason=>{

		});
		return message;
	}

	statusNotifyMarkRead(toUserName:string){
		messageServer.setStatusNotify(toUserName,StatusNotifyCode.READED);
	}

	private messageProcess(messageInfo:IMessage){
		let self = this;
		let user = contactManager.getContact(messageInfo.FromUserName,'',true);

		let message = new MessageModel(messageInfo);

		this.messages[message.MsgId] = message;

		if(user && !user.isMuted && !user.isSelf && !user.isShieldUser && !user.isBrandContact) {
			user.increaseUnreadMsgNum();
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

			//@TODO href encode
			// message.MMActualContent
			
			let user = contactManager.getContact(message.MMPeerUserName);
			if(!message.MMIsSend && (!user || (!user.isMuted && !user.isBrandContact)) && message.MsgType != MessageType.SYS) {
				// TODO notify
			}

			NotificationCenter.post<MessageModel>('message.receive',message);
		}
	}

	

	private statusNotifyProcessor(message:MessageModel){
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
}

export let messageManager = new MessageManager();