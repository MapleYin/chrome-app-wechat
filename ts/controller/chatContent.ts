import {User,WxMessage} from '../models/wxModels'
import {ChatContentItem} from '../template/chatContentItem'

export class ChatContent{
	private $chatContentHeader:JQuery = $('#chat-content-header');
	private $chatContentContainer:JQuery = $('#chat-content-container');
	private messageList = {};
	private chatListInfo;
	private currentChatUser:string;
	private selfUser:User;


	selectUser(username:string,currentUser:User){
		let name = currentUser.RemarkName || currentUser.NickName.replace(/<.+?>.*?<\/.+?>/g,'')
		this.$chatContentHeader.find('.username').text(name);
		this.currentChatUser = currentUser.UserName;
		this.displayMessageContent(username);
	}

	setChatListData(chatListInfo,selfUser:User){
		this.chatListInfo = chatListInfo;
		this.selfUser = selfUser;
	}


	newMessage(messages:Array<WxMessage>){
		let self = this;
		let currentUserMessage:Array<WxMessage> = [];
		messages.forEach(function(value){
			var fromUserName:string = value.FromUserName;
			let toUserName:string = value.ToUserName;

			if(fromUserName == self.selfUser.UserName) {
				fromUserName = toUserName;
			}
			if(!(fromUserName in self.messageList)) {
				self.messageList[fromUserName] = [];
			}
			if(fromUserName == self.currentChatUser) {
				currentUserMessage.push(value);
			}
			self.messageList[fromUserName].push(value);
		});

		this.updateMessageContent(currentUserMessage);
	}

	private displayMessageContent(userName){
		let self = this;
		let messages:Array<WxMessage> = this.messageList[userName];
		self.$chatContentContainer.empty();
		this.updateMessageContent(messages);
	}

	private updateMessageContent(messages:Array<WxMessage>){
		let self = this;
		if(!messages) {
			return;
		}
		messages.forEach(function(value){
			var fromUserInfo:User;
			var isSelf = false;
			if(value.FromUserName == self.selfUser.UserName) {
				isSelf = true;
				fromUserInfo = self.selfUser;
			}else{
				fromUserInfo = self.chatListInfo[value.FromUserName];
			}
			let item = new ChatContentItem(value,fromUserInfo,isSelf);
			self.$chatContentContainer.append(item.$element);
		});
	}
}