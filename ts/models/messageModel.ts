import {IMessage,MessageType,IRecommendInfo,TextInfoMap} from './wxInterface'
import {contactManager} from '../manager/contactManager'
import {emoticonManager} from '../manager/emoticonManager'
import {CoreServer} from '../servers/coreServer'
import {UserModel} from './userModel'

let GET_MSG_IMG_URL = '/cgi-bin/mmwebwx-bin/webwxgetmsgimg';

export class MessageModel{

	LocalID:number;
	ClientMsgId:number;
	MsgId:number;
	CreateTime:number;

	FromUserName:string
	ToUserName:string;

	Content:string;

	RecommendInfo:IRecommendInfo;

	MsgType:MessageType;
	StatusNotifyCode:number;
	StatusNotifyUserName:string;

	MMDigest?: string;
	MMIsSend?: boolean;
	MMPeerUserName?: string;
	MMIsChatRoom?: boolean;
	MMUnread?: boolean;
	MMActualContent?: string;
	MMActualSender?: string;

	ImageUrl?:string;
	OriginImageUrl?:string;

	constructor(message:IMessage){
		this.commonMsgProcess(message);
	}

	private commonMsgProcess(message:IMessage){
		this.FromUserName = message.FromUserName;
		this.ToUserName = message.ToUserName;
		this.MsgType = message.MsgType;
		this.StatusNotifyCode = message.StatusNotifyCode;
		this.StatusNotifyUserName = message.StatusNotifyUserName;
		this.Content = message.Content || '';
		this.CreateTime = message.CreateTime;
		this.MsgId = message.MsgId;

		var actualContent = '';
		var username = '';
		this.MMPeerUserName = (message.FromUserName == contactManager.account.UserName || message.FromUserName == '') ? message.ToUserName : message.FromUserName;
		this.MMDigest = '';
		this.MMIsSend = message.FromUserName == contactManager.account.UserName || message.FromUserName == '';

		if(UserModel.isRoomContact(this.MMPeerUserName)) {
			this.MMIsChatRoom = true;

			actualContent = this.Content.replace(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/,(str,name)=>{
				username = name;
				return ''
			});
			if(username && username != contactManager.account.UserName) {
				let user = contactManager.getContact(username,this.MMPeerUserName);
				if(user) {
					let displayName = user.getDisplayName();
					if(displayName) {
						this.MMDigest = displayName + ':';
					}
				}
			}
		}else{
			this.MMIsChatRoom = false;
			actualContent = this.Content;
		}

		if(!this.MMIsSend && this.MMUnread == undefined && this.MsgType != MessageType.SYS) {
			this.MMUnread = true;
		}

		if(!this.LocalID) {
			this.ClientMsgId = this.LocalID = this.MsgId;
		}

		// emoji
		actualContent = emoticonManager.emoticonFormat(actualContent);

		this.MMActualContent = actualContent;
		this.MMActualSender = username || message.FromUserName;

		switch (message.MsgType) {
			case MessageType.TEXT:
				this.MMDigest += this.MMActualContent.replace(/<br ?[^><]*\/?>/g, "");
				break;
			case MessageType.IMAGE:
				this.MMDigest += TextInfoMap["a5627e8"];
				this.ImageUrl = this.getMsgImg(this.MsgId,'slave');
				this.OriginImageUrl = this.getMsgImg(this.MsgId);
				break;
			default:
				// code...
				break;
		}

		//@TODO
		//对消息显示时间的标志
	}

	private getMsgImg(MsgId:number|string,quality?:string):string{
		var type = '';
		if(quality) {
			type = `&type=${quality}`
		}
		return `${GET_MSG_IMG_URL}?&MsgID=${MsgId}&skey=${encodeURIComponent(CoreServer.Skey)}${type}`;
	}
}