import {Template} from './template';
import {User} from '../models/wxModels';
import {escape} from '../tools/chromeTools'


let templateString = 

`<li class="item" data-id="{{id}}">
	<header class="item-header">
		<img src="/images/wechat_avatar_default.png" data-src="{{avatar}}" alt="{{nickName}}" class="avatar">
	</header>
	<div class="item-body">
		<header class="info">
			<h1 class="username">{{nickName}}</h1>
			<time class="message-date">{{lastDate}}</time>
		</header>
		<p class="message">{{lastMessage}}</p>
	</div>
</li>`;

interface ChatListData{
	id:string;
	avatar:string;
	nickName:string;
	lastDate?:Date;
	lastMessage?:string;
}


export class ChatListItem extends Template implements ChatListData{

	id:string;
	avatar:string;
	nickName:string;
	lastDate?:Date;
	lastMessage?:string;

	private data:ChatListData;

	private _active:boolean;


	constructor(itemData:User){
		super(templateString);

		let self = this;

		this.data = {
			id : itemData.UserName,
			avatar : itemData.HeadImgUrl,
			nickName : itemData.RemarkName || itemData.NickName.replace(/<.+?>.*?<\/.+?>/g,'')
		};

		this.id = this.data.id;
		this.avatar = this.data.avatar;
		this.nickName = this.data.nickName;
		this.lastDate = this.data.lastDate;
		this.lastMessage = this.data.lastMessage;

		this.render(this.data);
	}

	public set active(v : boolean) {
		this._active = v;
		if(v) {
			this.$element.addClass('active');	
		}else{
			this.$element.removeClass('active');	
		}
	}
}