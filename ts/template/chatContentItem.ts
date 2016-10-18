import {IUser,IMessage} from '../models/wxInterface';
import {UserModel} from '../models/userModel';
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

	constructor(content:string,sender:UserModel){
		super(templateString);
		this.avatar = sender.HeadImgUrl;
		this.nickName = sender.getDisplayName();
		this.content = content;

		this.render({
			avatar : this.avatar,
			nickName : this.nickName,
			content : this.content,
			className : sender.isSelf ? 'self' : ''
		});
	}
}