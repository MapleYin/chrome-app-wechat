import {User,WxMessage} from '../models/wxModels'
import {ChatListItem} from '../template/chatListItem'
import {Eventable} from '../tools/eventable'

export class ChatList extends Eventable{
	private $chatListContainer:JQuery = $('#chat-list-container');
	private activeUserIndex:number;
	private userListItems:Array<ChatListItem> = [];
	private chatListInfo;

	constructor(){
		super();
		this.bindEvent();
	}

	setChatListData(chatList:Array<string>,chatListInfo){
		let self = this;
		let list:JQuery;
		this.$chatListContainer.empty();
		this.userListItems = [];
		this.chatListInfo = chatListInfo;
		chatList.forEach(function(value){
			let data:User = chatListInfo[value];
			if( (data.VerifyFlag == 0 && data.UserName.slice(0,1) == '@')
			 || data.UserName == 'filehelper') {
				let item = new ChatListItem(data);
				self.userListItems.push(item);
				self.$chatListContainer.append(item.$element);
			}
		});
	}

	newMessage(message:Array<WxMessage>){

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