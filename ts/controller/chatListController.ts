import {IUser,IMessage} from '../models/wxInterface'
import {UserModel} from '../models/userModel'
import {MessageModel} from '../models/messageModel'
import {ChatListItem} from '../template/chatListItem'
import {BaseController} from './baseController'
import {NotificationCenter} from '../utility/notificationCenter'

class ChatListController extends BaseController{
	private $chatListContainer:JQuery = $('#chat-list-container');
	private activeUser:string;
	private userListItemsInfo:{[key:string]:ChatListItem} = {};

	constructor(){
		super();
		this.bindEvent();
	}

	updateChatList(chatListInfo:UserModel[],changeList?:UserModel[]){
		let self = this;
		console.time('updateChatListElement');
		if(changeList && changeList.length > 0) {
			changeList.forEach(user=>{
				let item = self.getItemByUser(user);
				let index = chatListInfo.indexOf(user);
				if(index > -1) {
					self.insertItemIntoIndex(item,index);
				}
			});
		}else{
			chatListInfo.forEach(function(user,index){
				let item = self.getItemByUser(user);
				if(index != item.$element.index()) {
					self.insertItemIntoIndex(item,index);
				}
			});
		}
		console.timeEnd('updateChatListElement');
	}

	newMessage(message:MessageModel,userInfo:UserModel){
		let self = this;
		
		if(message.MMPeerUserName in self.userListItemsInfo) {
			let item = self.userListItemsInfo[message.MMPeerUserName];
			item.lastMessage = message.MMDigest;
			item.lastDate = new Date(message.CreateTime*1000);
		}else{
			let item = new ChatListItem(userInfo);
			item.lastMessage = message.MMDigest;
			item.lastDate = new Date(message.CreateTime*1000);
			self.userListItemsInfo[message.MMPeerUserName] = item;
		}
		// self.userListItems.forEach(function(value){
		// 	self.$chatListContainer.append(value.$element);
		// });
	}

	private selectedItem(username:string){
		if( this.activeUser && this.activeUser == username){
			return ;
		}
		let item = this.userListItemsInfo[username];
		item.active = true;
		let preItem = this.userListItemsInfo[this.activeUser];
		if(preItem) {
			preItem.active = false;
		}
		this.activeUser = username;
		NotificationCenter.post<string>('chatList.select.user',item.id);
	}

	private getItemByUser(user:UserModel):ChatListItem{
		var item:ChatListItem;
		if(user.UserName in this.userListItemsInfo) {
			item = this.userListItemsInfo[user.UserName];
			item.update(user);
		}else{
			item = new ChatListItem(user);
			this.userListItemsInfo[user.UserName] = item;
			item.$element.appendTo(this.$chatListContainer);
		}
		return item;
	}

	private insertItemIntoIndex(item:ChatListItem,index:number){
		let preItem = this.$chatListContainer.children().eq(index);
		if(preItem) {
			item.$element.insertBefore(preItem);
		}else{
			item.$element.appendTo(this.$chatListContainer);
		}
	}

	private bindEvent(){
		let self = this;
		this.$chatListContainer.on('click','.item',function(event){
			self.selectedItem($(this).data('id'));
		});
	}
}

export let chatListController = new ChatListController();