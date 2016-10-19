import {IUser,IMessage} from '../models/wxInterface'
import {UserModel} from '../models/userModel'
import {ChatListItem} from '../template/chatListItem'
import {BaseController} from './baseController'
import {NotificationCenter} from '../utility/notificationCenter'

class ChatListController extends BaseController{
	private $chatListContainer:JQuery = $('#chat-list-container');
	private activeUserIndex:number;
	private userListItems:ChatListItem[] = [];
	private userListItemsInfo:{[key:string]:ChatListItem} = {};

	constructor(){
		super();
		this.bindEvent();
	}

	updateChatList(chatListInfo:UserModel[]){
		let self = this;
		this.$chatListContainer.empty();
		this.userListItems = [];
		console.time('updateChatListElement');
		chatListInfo.forEach(function(user,index){
			let item = new ChatListItem(user);
			self.userListItems.push(item);
			self.userListItemsInfo[user.UserName] = item;
			self.$chatListContainer.append(item.$element);
		});
		console.timeEnd('updateChatListElement');
	}

	newMessage(message:IMessage,userInfo:UserModel){
		let self = this;
		
		if(message.MMPeerUserName in self.userListItemsInfo) {
			let item = self.userListItemsInfo[message.MMPeerUserName];
			item.lastMessage = message.MMDigest;
			item.lastDate = new Date(message.CreateTime*1000);

			let index = self.userListItems.indexOf(item);
			self.userListItems.splice(index,1);
			self.userListItems.unshift(item);
		}else{
			let item = new ChatListItem(userInfo);
			item.lastMessage = message.MMDigest;
			item.lastDate = new Date(message.CreateTime*1000);
			self.userListItemsInfo[message.MMPeerUserName] = item;
			self.userListItems.push(item);
		}

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

		NotificationCenter.post<string>('chatList.select.user',item.id);
	}

	private bindEvent(){
		let self = this;
		this.$chatListContainer.on('click','.item',function(event){
			let index = $(this).index();
			self.selectedItem(index);
		});
	}
}

export let chatListController = new ChatListController();