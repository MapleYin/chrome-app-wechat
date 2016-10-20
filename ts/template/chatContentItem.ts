import {IUser,IMessage,MessageType,AppMsgType} from '../models/wxInterface';
import {UserModel} from '../models/userModel';
import {MessageModel} from '../models/messageModel';

import {Template} from './template'


let templateString = 
`
<div class="item {{className}}">
	<figure class="avatar">
		<img src="/images/wechat_avatar_default.png" data-src="{{avatar}}" alt="{{nickName}}">
	</figure>
	<section class="content">
		<p>{{content}}</p>
	</section>
</div>
`;

let appMsgString = `

`;

interface ChatContentData{
	avatar:string;
	content : string;
	nickName:string;
	date?:Date;
}

export class ChatContentItem extends Template implements ChatContentData{
	avatar : string;
	nickName : string;
	content : string;
	date? : Date;

	itemClassName:string[] = [];

	constructor(message:MessageModel,sender:UserModel){
		super(templateString);
		
		this.avatar = sender.HeadImgUrl;
		this.nickName = sender.getDisplayName();
		this.processMessage(message);
		if(sender.isSelf) {
			this.itemClassName.push('self');	
		}
		this.render({
			avatar : this.avatar,
			nickName : this.nickName,
			content : this.content,
			className : this.itemClassName.join(' ')
		});
	}

	private processMessage(message:MessageModel){
		switch (message.MsgType) {
			case MessageType.TEXT:
				this.content = message.MMActualContent;
				break;
			case MessageType.IMAGE:
				this.itemClassName.push('image')
				this.content = `<img data-src="${message.ImageUrl}" class="msg-image" />`;
				break;
			case MessageType.APP:
				if(message.AppMsgType == AppMsgType.URL) {
					this.content = `<a href="${message.Url}">[链接消息]${message.FileName}</a>`;
				}else{
					this.content = '[未知APP消息]';
				}
				break;
			default:
				this.content = '[未知消息]';
				break;
		}
		
	}
}