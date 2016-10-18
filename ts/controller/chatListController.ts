import {chatManager} from '../manager/chatManager'
import {IUser,IMessage} from '../models/wxInterface'
import {ChatListItem} from '../template/chatListItem'
import {BaseController} from './baseController'

export class ChatListController extends BaseController{
	private $chatListContainer:JQuery = $('#chat-list-container');
	private activeUserIndex:number;
	private userListItems:ChatListItem[] = [];
	private userListItemsInfo:{[key:string]:ChatListItem} = {};

	constructor(){
		super();
		this.bindEvent();
	}

	updateChatList(){
		let self = this;
		this.$chatListContainer.empty();
		this.userListItems = [];
		console.time('updateChatListElement');
		chatManager.chatListInfo.forEach(function(user,index){
			let item = new ChatListItem(user);
			self.userListItems.push(item);
			self.userListItemsInfo[user.UserName] = item;
			self.$chatListContainer.append(item.$element);
		});
		console.timeEnd('updateChatListElement');
	}

	newMessage(messages:IMessage[]){
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

		this.dispatchEvent<string>('SelectUser',item.id);
	}

	private bindEvent(){
		let self = this;
		this.$chatListContainer.on('click','.item',function(event){
			let index = $(this).index();
			self.selectedItem(index);
		});
	}
}