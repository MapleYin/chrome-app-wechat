import {Template} from './template';
import {UserModel} from '../models/userModel'
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
	_lastDate?:Date;
	_lastMessage?:string;
	_unreadMsgCount:number;

	private data:ChatListData;

	private _active:boolean;


	constructor(itemData:UserModel){
		super();
		let self = this;

		this.data = {
			id : itemData.UserName,
			avatar : itemData.HeadImgUrl,
			nickName : itemData.RemarkName || itemData.NickName
		};

		this.id = this.data.id;
		this.avatar = this.data.avatar;
		this.nickName = this.data.nickName;

		this.render(templateString,this.data);
	}

	update(itemData:UserModel){
		this.id = this.data.id;
		this.avatar = this.data.avatar;
		this.nickName = this.data.nickName;
		this.unreadMsgCount = itemData.MMUnreadMsgCount;
	}

	public set unreadMsgCount(value:number){
		this._unreadMsgCount == value;
	}

	public set active(v : boolean) {
		this._active = v;
		if(v) {
			this.$element.addClass('active');	
		}else{
			this.$element.removeClass('active');	
		}
	}

	public set lastDate(v : Date) {
		this._lastDate = v;
		this.$element.find('.message-date').text(v.toLocaleTimeString());
	}
	public set lastMessage(v : string) {
		this._lastMessage = v;
		this.$element.find('p.message').text(v);
	}
}