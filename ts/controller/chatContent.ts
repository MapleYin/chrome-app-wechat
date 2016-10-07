import {User,WxMessage} from '../models/wxModels'
import {ChatContentItem} from '../template/chatContentItem'
import {Eventable} from '../tools/eventable'
import {wxChatManager} from '../tools/wxChatManager'

export class ChatContent extends Eventable{
	private $chatContentHeader:JQuery = $('#chat-content-header');
	private $chatContentContainer:JQuery = $('#chat-content-container');
	private $inputTextarea:JQuery = $('#message-input');
	private messageList = {};
	currentChatUser:string;

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

	selectUser(username:string){
		let selectUserInfo:User = wxChatManager.chatListInfo[username];
		let name = selectUserInfo.RemarkName || selectUserInfo.NickName.replace(/<.+?>.*?<\/.+?>/g,'')
		this.$chatContentHeader.find('.username').text(name);
		this.currentChatUser = username;
		this.displayMessageContent(username);
		this.$inputTextarea.focus();
	}

	newMessage(messages:Array<WxMessage>){
		let self = this;
		let currentUserMessage:Array<WxMessage> = [];
		messages.forEach(function(value){
			var fromUserName:string = value.FromUserName;
			let toUserName:string = value.ToUserName;

			if(fromUserName == wxChatManager.currentUser.UserName) {
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

			wxChatManager.sendMessage(this.currentChatUser,message,function(result){
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
			FromUserName : wxChatManager.currentUser.UserName,
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
			if(value.FromUserName == wxChatManager.currentUser.UserName) {
				isSelf = true;
				fromUserInfo = wxChatManager.currentUser;
			}else{
				fromUserInfo = wxChatManager.chatListInfo[value.FromUserName];
			}
			let item = new ChatContentItem(value,fromUserInfo,isSelf);
			self.$chatContentContainer.append(item.$element);
		});

		self.$chatContentContainer.scrollTop(self.$chatContentContainer.height());
	}
}