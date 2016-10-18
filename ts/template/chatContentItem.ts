import {IUser,IMessage} from '../models/wxInterface';
import {Template} from './template'


let templateString = 
`
<div class="item {{className}}">
	<figure class="avatar">
		<img src="{{avatar}}" alt="">
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

	constructor(itemData:IMessage,fromUser:IUser,isSelf:boolean){
		super(templateString);

		this.avatar = fromUser.HeadImgUrl;
		this.nickName = fromUser.NickName;
		this.content = itemData.Content;

		this.render({
			avatar : this.avatar,
			nickName : this.nickName,
			content : this.content,
			className : isSelf ? 'self' : ''
		});
	}

	private convertContentToFit(itemData:IMessage):string{
		var content:string = '';
		switch (itemData.MsgType) {
			case 1:
				content = itemData.Content;
				break;
			case 2: 
				
				break; 
			default:
				// code...
				break;
		}
		return '';
	}


}