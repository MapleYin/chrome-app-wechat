import {chatManager} from '../manager/chatManager'
import {User,Message} from '../models/wxInterface'
import {ChatListItem} from '../template/chatListItem'
import {BaseController} from './baseController'

export class ChatList extends BaseController{
	private $chatListContainer:JQuery = $('#chat-list-container');
	private activeUserIndex:number;
	private userListItems:Array<ChatListItem> = [];
	private userListItemsInfo:{[key:string]:ChatListItem} = {};

	constructor(){
		super();
		this.bindEvent();
	}

	updateChatList(){
		let self = this;
		let list:JQuery;
		this.$chatListContainer.empty();
		this.userListItems = [];

		chatManager.chatList.forEach(function(value){
			let data:User = chatManager.chatListInfo[value];
			let item = new ChatListItem(data);
			self.userListItems.push(item);
			self.userListItemsInfo[data.UserName] = item;
			self.$chatListContainer.append(item.$element);
			self.$chatListContainer.addBack()
		});
	}

	newMessage(messages:Array<Message>){
		let self = this;
		messages.forEach(function(value){
			if(value.FromUserName in self.userListItemsInfo) {
				let item:ChatListItem = self.userListItemsInfo[value.FromUserName];
				item.lastMessage = value.Content;
				item.lastDate = new Date(value.CreateTime*1000);

				let index = self.userListItems.indexOf(item);
				self.userListItems.splice(index,1);
				self.userListItems.unshift(item);
			}
		});
		self.$chatListContainer.empty();
		self.userListItems.forEach(function(value){
			self.$chatListContainer.append(value.$element);
		});
	}

	private selectedItem(index:number){
		if( typeof this.activeUserIndex == 'number' && index == this.activeUserIndex ) {
			return ;
		}
		let item = this.userListItems[index];
		item.active = true;
		let preItem = this.userListItems[this.activeUserIndex];
		if(preItem) {
			preItem.active = false;
		}
		this.activeUserIndex = index;

		this.dispatchEvent('SelectUser',item.id);
	}

	private bindEvent(){
		let self = this;
		this.$chatListContainer.on('click','.item',function(event){
			let index = $(this).index();
			self.selectedItem(index);
		});
	}
}