import {IMessage,MessageType,IRecommendInfo,TextInfoMap,AppMsgType} from './wxInterface'
import {contactManager} from '../manager/contactManager'
import {emoticonManager} from '../manager/emoticonManager'
import {CoreServer} from '../servers/coreServer'
import {UserModel} from './userModel'
import {htmlDecode,htmlEncode} from '../utility/htmlHelper'

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
	AppMsgType:AppMsgType;
	StatusNotifyCode:number;
	StatusNotifyUserName:string;

	FileName:string;
	FileSize:string;
	Url:string;

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
		this.AppMsgType = message.AppMsgType;
		this.StatusNotifyCode = message.StatusNotifyCode;
		this.StatusNotifyUserName = message.StatusNotifyUserName;
		this.Content = message.Content || '';
		this.CreateTime = message.CreateTime;
		this.MsgId = message.MsgId;
		this.FileName = message.FileName || '';
		this.FileSize = message.FileSize || '';
		this.Url = message.Url || '';

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
			case MessageType.APP:
				this.appMsgProcess();
				break;
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

	private appMsgProcess(){
		switch (this.AppMsgType) {
			case AppMsgType.TEXT:
				
				break;
			case AppMsgType.IMG:
				
				break;
			case AppMsgType.AUDIO:
				
				break;
			case AppMsgType.VIDEO:
				
				break;
			case AppMsgType.EMOJI:
				
				break;
			case AppMsgType.URL:
				this.appUrlMsgProcess();
				break;
			case AppMsgType.ATTACH:
				
				break;
			case AppMsgType.TRANSFERS:
				
				break;
			case AppMsgType.RED_ENVELOPES:
				
				break;
			case AppMsgType.CARD_TICKET:
				
				break;
			case AppMsgType.OPEN:
				
				break;
			case AppMsgType.REALTIME_SHARE_LOCATION:
				
				break;
			case AppMsgType.SCAN_GOOD:
				
				break;
			case AppMsgType.EMOTION:
				
				break;
			default:
				// code...
				break;
		}
	}

	private appUrlMsgProcess(digest?:string){
		this.MsgType = MessageType.APP;
		this.AppMsgType = AppMsgType.URL;
		digest = digest || TextInfoMap['e5b228c']+this.FileName;
		this.MMDigest += digest;
		//var actualContent = htmlDecode(this.MMActualContent).replace(/<br\/>/g, '');
		
	}

	private getMsgImg(MsgId:number|string,quality?:string):string{
		var type = '';
		if(quality) {
			type = `&type=${quality}`
		}
		return `${GET_MSG_IMG_URL}?&MsgID=${MsgId}&skey=${encodeURIComponent(CoreServer.Skey)}${type}`;
	}
}