import {IMessage,MessageType,IRecommendInfo,TextInfoMap,AppMsgType} from './wxInterface'
import {contactManager} from '../manager/contactManager'
import {emoticonManager} from '../manager/emoticonManager'
import {CoreServer} from '../servers/coreServer'
import {UserModel} from './userModel'
import {htmlDecode,htmlEncode,xml2Json,encodeEmoji,decodeEmoji,formatNum} from '../utility/stringHelper'

let GET_MSG_IMG_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetmsgimg';
let GET_MSG_VOICE_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetvoice';
let GET_MSG_VIDEO_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetvideo';

export class MessageModel{

	LocalID:string;
	ClientMsgId:string;
	MsgId:string;
	CreateTime:number;
	HasProductId:number;

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
	VoiceLength:number;

	MMDigest?: string;
	MMIsSend?: boolean;
	MMPeerUserName?: string;
	MMIsChatRoom?: boolean;
	MMUnread?: boolean;
	MMActualContent?: string;
	MMActualSender?: string;
	MMAppMsgDesc?:string;
	MMCategory?:any[];
	MMAppName?:string;
	MMVoiceUnRead?:boolean;
	MMAlert?:string;
	md5?:string;

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
		this.Url = htmlDecode(message.Url) || '';
		this.HasProductId = message.HasProductId || 0;
		this.VoiceLength = message.VoiceLength || 0;

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
			case MessageType.EMOTICON:
				this.emojiMsgProcess();
				break;
			case MessageType.IMAGE:
				this.imageMsgProcess();
				break;
			case MessageType.VOICE:
				this.voiceMsgProcess();
				break;
			case MessageType.VIDEO:
				this.videoMsgProcess();
				break;
			case MessageType.MICROVIDEO:
				this.mircoVideoMsgProcess();
				break;
			case MessageType.TEXT:
				this.textMsgProcess();
				break;
			case MessageType.RECALLED:
				this.recalledMsgProcess();
				break;
			default:
				// code...
				break;
		}

		//@TODO
		//对消息显示时间的标志
	}

	private textMsgProcess(){
		this.MsgType = MessageType.TEXT;
		this.MMDigest += this.MMActualContent.replace(/<br ?[^><]*\/?>/g, "");
	}
	private imageMsgProcess(){
		this.MsgType = MessageType.IMAGE;
		this.MMDigest += TextInfoMap["a5627e8"];
		this.ImageUrl = this.getMsgImg(this.MsgId,'slave');
		this.OriginImageUrl = this.getMsgImg(this.MsgId);
	}
	private mircoVideoMsgProcess(){
		this.MsgType = MessageType.MICROVIDEO;
		this.ImageUrl = this.getMsgImg(this.MsgId,'slave');
		this.Url = this.getMsgVideo(this.MsgId);
		this.MMDigest += TextInfoMap['1f94b1b'];
	}
	private videoMsgProcess(){
		this.MsgType = MessageType.VIDEO;
		this.MMDigest += TextInfoMap['4078104'];
	}
	private emojiMsgProcess(){
		if(this.HasProductId) {
			this.MMActualContent = this.MMIsSend ? TextInfoMap['80f56fb'] : TextInfoMap['2242ac7'];
			this.textMsgProcess();
		}else{
			this.MsgType = MessageType.EMOTICON;
			this.MMDigest += TextInfoMap['e230fc1'];
			this.ImageUrl = this.getMsgImg(this.MsgId,'big');
			var actualContent = xml2Json(htmlDecode(this.MMActualContent));
			if(actualContent && actualContent.emoji && actualContent.emoji.md5) {
				this.md5 = actualContent.emoji.md5;
			}
		}
	}

	private voiceMsgProcess(){
		this.MsgType = MessageType.VOICE;
		this.MMDigest += TextInfoMap['b28dac0'];
		this.MMVoiceUnRead = !this.MMIsSend && this.MMUnread;
		this.Url = this.getMsgVoice(this.MsgId);
	}
	private recalledMsgProcess(){
		var actualContent = htmlDecode(this.MMActualContent);
		let digest = TextInfoMap['ded861c'];
		// TODO
	}

	private appMsgProcess(){
		switch (this.AppMsgType) {
			case AppMsgType.TEXT:
				this.appTextMsgProcess();
				break;
			case AppMsgType.IMG:
				this.imageMsgProcess();
				break;
			case AppMsgType.AUDIO:
				this.appAudioMsgProcess();
				break;
			case AppMsgType.VIDEO:
				this.appVideoMsgProcess();
				break;
			case AppMsgType.EMOJI:
				this.emojiMsgProcess();
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
		this.ImageUrl = this.getMsgImg(this.MsgId,'slave');

		var actualContent:any = htmlDecode(this.MMActualContent);
		actualContent = encodeEmoji(actualContent);
		actualContent = xml2Json(actualContent).msg;

		this.MMAppMsgDesc = decodeEmoji(actualContent.appmsg.des);
		this.MMAppName = actualContent.appinfo.appname || actualContent.appmsg.sourcedisplayname || '';
		if(actualContent.appmsg.mmreader) {
			this.appReaderMsgProcess(actualContent.appmsg.mmreader);	
		}
	}

	private appTextMsgProcess(){
		let actualContent:any = htmlDecode(this.MMActualContent).replace(/<br\/>/g, '');
		actualContent = encodeEmoji(actualContent);
		actualContent = xml2Json(actualContent).msg;
		this.appAsTextMsgProcess(decodeEmoji(htmlEncode(actualContent.appmsg.title)));
	}

	private appAudioMsgProcess(){
		let digest = TextInfoMap['0e23719'] + this.FileName;
		this.appUrlMsgProcess(digest);
	}

	private appVideoMsgProcess(){
		let digest = TextInfoMap['4078104'] + this.FileName;
		this.appUrlMsgProcess(digest);
	}

	private appOpenMsgProcess(){
		let digest = TextInfoMap['4f20785'] + this.FileName;
		this.appUrlMsgProcess(digest);
		this.MMAlert = TextInfoMap['c4e04ee'];
	}

	private appReaderMsgProcess(mmreader:any){
		this.MsgType = MessageType.APP;
		this.AppMsgType = AppMsgType.READER_TYPE;
		if(mmreader.category.count == 1) {
			this.MMCategory = [mmreader.category.item];
		}else{
			this.MMCategory = mmreader.category.item;
		}
		this.MMCategory.forEach(item=>{
			let pub_time = new Date(1e3 * item.pub_time);
			item.pub_time = formatNum(pub_time.getMonth() + 1 , 2) + '-' + formatNum(pub_time.getDate(),2);
			let coverArray:any[] = item.cover.split('|');
			if(coverArray.length == 3) {
				item.cover = coverArray[0];
				item.width = coverArray[1];
				item.height = coverArray[2];
			}

		});
		this.MMDigest += this.MMCategory.length && this.MMCategory[0].title;
	}

	private appAsTextMsgProcess(actualContent:string){
		this.MMActualContent = actualContent;
		this.textMsgProcess();
	}

	private getMsgVideo(MsgId:number|string):string{
		return `${GET_MSG_VIDEO_URL}?MsgID=${MsgId}&skey=${encodeURIComponent(CoreServer.Skey)}`
	}

	private getMsgImg(MsgId:number|string,quality?:string):string{
		var type = '';
		if(quality) {
			type = `&type=${quality}`
		}
		return `${GET_MSG_IMG_URL}?MsgID=${MsgId}&skey=${encodeURIComponent(CoreServer.Skey)}${type}`;
	}

	private getMsgVoice(MsgId:number|string):string{
		return `${GET_MSG_VOICE_URL}?MsgID=${MsgId}&skey=${encodeURIComponent(CoreServer.Skey)}`;
	}
}