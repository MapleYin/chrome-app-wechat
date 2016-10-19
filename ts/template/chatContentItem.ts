import {IUser,IMessage,MessageType} from '../models/wxInterface';
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

	constructor(message:MessageModel,sender:UserModel){
		super(templateString);
		this.avatar = sender.HeadImgUrl;
		this.nickName = sender.getDisplayName();
		this.processMessage(message);
		this.render({
			avatar : this.avatar,
			nickName : this.nickName,
			content : this.content,
			className : sender.isSelf ? 'self' : ''
		});
	}

	private processMessage(message:MessageModel){
		switch (message.MsgType) {
			case MessageType.TEXT:
				this.content = message.MMActualContent;
				break;
			case MessageType.IMAGE:
				this.content = `<img data-src="${message.ImageUrl}" class="msg-image" />`;
				break;
			default:
				this.content = '[未知消息]';
				break;
		}
		
	}
}