import {User,WxMessage} from '../models/wxModels'
import {ChatContentItem} from '../template/chatContentItem'
import {Eventable} from '../tools/eventable'

export class ChatContent extends Eventable{
	private $chatContentHeader:JQuery = $('#chat-content-header');
	private $chatContentContainer:JQuery = $('#chat-content-container');
	private $inputTextarea:JQuery = $('#message-input');
	private messageList = {};
	private chatListInfo;
	currentChatUser:string;
	private selfUser:User;

	constructor(){
		super();
		let self = this;
		this.$inputTextarea.on('keydown',function(e){
			let message:string = $(this).val();
			if(e.keyCode == 13 && !e.metaKey && message.length > 0) {
				$(this).val('');
				self.sendMessage(message);
				e.preventDefault();
			}else if(e.keyCode == 13){
				$(this).val(function(index,value){
					return value+'\n';
				});
			}
		});
	}


	selectUser(username:string,currentUser:User){
		let name = currentUser.RemarkName || currentUser.NickName.replace(/<.+?>.*?<\/.+?>/g,'')
		this.$chatContentHeader.find('.username').text(name);
		this.currentChatUser = currentUser.UserName;
		this.displayMessageContent(username);
		this.$inputTextarea.focus();
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

	sendMessage(message:string){
		if(message.length > 0) {
			let fakeMessage:WxMessage = this.createFakeMessage(message);
			if(!(this.currentChatUser in this.messageList)) {
				this.messageList[this.currentChatUser] = [];
			}
			this.messageList[this.currentChatUser].push(fakeMessage);
			this.dispatchEvent('SendingMessage',message,function(result){
				if(result.BaseResponse.Ret == 0) {
					fakeMessage.MsgId = result.MsgId;
				}
			});
			this.updateMessageContent([fakeMessage]);
		}
	}

	private createFakeMessage(message:string):WxMessage{
		let time = new Date();
		return {
			MsgId : 0,
			MsgType : 1,
			Content : message,
			FromUserName : this.selfUser.UserName,
			ToUserName : this.currentChatUser,
			CreateTime : time.getTime(),
			StatusNotifyUserName : ''
		};
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

		self.$chatContentContainer.scrollTop(self.$chatContentContainer.height());
	}
}