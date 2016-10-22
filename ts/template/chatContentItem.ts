import {IUser,IMessage,MessageType,AppMsgType} from '../models/wxInterface';
import {UserModel} from '../models/userModel';
import {MessageModel} from '../models/messageModel';

import {Template} from './template'
import {chatContentTemplateCreater,
	commonRenderData,
	textMsgRenderData,
	imageMsgRenderData,
	emoticonMsgRenderData,
	appMsgRenderData,
	voiceMsgRenderData
	} from './templateCreater'

export class ChatContentItem extends Template{
	messageId:number;
	avatar : string;
	nickName : string;
	content : string;
	date? : Date;
	renderData:any;

	itemClassName:string[] = [];

	constructor(message:MessageModel,sender:UserModel){
		super();

		if(sender.isSelf) {
			this.itemClassName.push('self');	
		}
		this.messageId = message.MsgId;
		this.avatar = sender.HeadImgUrl;
		this.nickName = sender.getDisplayName();

		let templateString = chatContentTemplateCreater.create(message.MsgType);
		this.processMessage(message);

		this.render(templateString,this.renderData);
	}

	private processMessage(message:MessageModel){
		this.renderData = {
			msgId : this.messageId,
			avatar : this.avatar,
			nickName : this.nickName,
			className : this.itemClassName.join('')
		};
		switch (message.MsgType) {
			case MessageType.TEXT:
				this.fillInData<textMsgRenderData>({
					content : message.MMActualContent
				});
				break;
			case MessageType.IMAGE:
				this.fillInData<imageMsgRenderData>({
					originImage : message.OriginImageUrl,
					image : message.ImageUrl
				});
				break;
			case MessageType.EMOTICON:
				this.fillInData<emoticonMsgRenderData>({
					image : message.ImageUrl
				});
				break;
			case MessageType.VOICE:
				this.fillInData<voiceMsgRenderData>({
					time : message.VoiceLength/1e3
				});
				break;
			case MessageType.APP:
				switch (message.AppMsgType) {
					case AppMsgType.URL:
						this.fillInData<appMsgRenderData>({
							title : message.FileName,
							desc : message.MMAppMsgDesc,
							image : message.ImageUrl,
							source : message.MMAppName
						});
						break;
					default:
						this.fillInData<textMsgRenderData>({
							content : `[未知APP消息]:${message.AppMsgType}`
						});
						break;
				}
				break;
			default:
				this.fillInData<textMsgRenderData>({
					content : `[未知消息]:${message.MsgType}`
				});
				break;
		}
	}

	private fillInData<T>(data:T){
		for (var key in data) {
			this.renderData[key] = data[key];
		}
	}
}