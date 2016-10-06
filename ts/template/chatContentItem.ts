import {User,WxMessage} from '../models/wxModels';
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
	className? :string;
}

export class ChatContentItem extends Template implements ChatContentData{
	avatar : string;
	nickName : string;
	content : string;
	date? : Date;

	private data:ChatContentData;

	constructor(itemData:WxMessage,fromUser:User,isSelf:boolean){
		super(templateString);

		this.data = {
			avatar : fromUser.HeadImgUrl,
			nickName : fromUser.NickName,
			content : itemData.Content,
			className : isSelf ? 'self' : ''
		};

		this.render(this.data);
	}


}