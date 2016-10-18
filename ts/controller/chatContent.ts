import {IUser,IMessage} from '../models/wxInterface'
import {ChatContentItem} from '../template/chatContentItem'
import {BaseController} from './baseController'
import {chatManager} from '../manager/chatManager'

export class ChatContent extends BaseController{
	// private $chatContentHeader:JQuery = $('#chat-content-header');
	// private $chatContentContainer:JQuery = $('#chat-content-container');
	// private $inputTextarea:JQuery = $('#message-input');
	// private messageList = {};
	// currentChatUser:string;

	// constructor(){
	// 	super();
	// 	let self = this;
	// 	this.$inputTextarea.on('keydown',function(e){
	// 		let message:string = $(this).val();
	// 		if(e.keyCode == 13 && !e.metaKey && message.length > 0) {
	// 			$(this).val('');
	// 			self.sendMessage(message);
	// 			e.preventDefault();
	// 		}else if(e.keyCode == 13){
	// 			$(this).val(function(index,value){
	// 				return value+'\n';
	// 			});
	// 		}
	// 	});
	// }

	// selectUser(username:string){
	// 	let selectUserInfo:IUser = chatManager.chatListInfo[username];
	// 	let name = selectUserInfo.RemarkName || selectUserInfo.NickName.replace(/<.+?>.*?<\/.+?>/g,'')
	// 	this.$chatContentHeader.find('.username').text(name);
	// 	this.currentChatUser = username;
	// 	this.displayMessageContent(username);
	// 	this.$inputTextarea.focus();
	// }

	// newMessage(messages:Array<IMessage>){
	// 	// let self = this;
	// 	// let currentUserMessage:Array<Message> = [];
	// 	// messages.forEach(function(value){
	// 	// 	var fromUserName:string = value.FromUserName;
	// 	// 	let toUserName:string = value.ToUserName;

	// 	// 	if(fromUserName == chatManager.currentUser.UserName) {
	// 	// 		fromUserName = toUserName;
	// 	// 	}
	// 	// 	if(!(fromUserName in self.messageList)) {
	// 	// 		self.messageList[fromUserName] = [];
	// 	// 	}
	// 	// 	if(fromUserName == self.currentChatUser) {
	// 	// 		currentUserMessage.push(value);
	// 	// 	}
	// 	// 	self.messageList[fromUserName].push(value);
	// 	// });

	// 	// this.updateMessageContent(currentUserMessage);
	// }

	// sendMessage(message:string){
	// 	// if(message.length > 0) {
	// 	// 	let fakeMessage:Message = this.createFakeMessage(message);
	// 	// 	if(!(this.currentChatUser in this.messageList)) {
	// 	// 		this.messageList[this.currentChatUser] = [];
	// 	// 	}
	// 	// 	this.messageList[this.currentChatUser].push(fakeMessage);

	// 	// 	chatManager.sendMessage(this.currentChatUser,message,function(result){
	// 	// 		if(result.BaseResponse.Ret == 0) {
	// 	// 			fakeMessage.MsgId = result.MsgId;
	// 	// 		}
	// 	// 	});

	// 	// 	this.updateMessageContent([fakeMessage]);
	// 	// }
	// }

	// // private createFakeMessage(message:string):IMessage{
	// // 	let time = new Date();
	// // 	return {
	// // 		MsgId : 0,
	// // 		MsgType : 1,
	// // 		Content : message,
	// // 		FromUserName : chatManager.currentUser.UserName,
	// // 		ToUserName : this.currentChatUser,
	// // 		CreateTime : time.getTime(),
	// // 		StatusNotifyUserName : ''
	// // 	};
	// // }

	// private displayMessageContent(userName){
	// 	let self = this;
	// 	let messages:Array<IMessage> = this.messageList[userName];
	// 	self.$chatContentContainer.empty();
	// 	this.updateMessageContent(messages);
	// }

	// private updateMessageContent(messages:Array<IMessage>){
	// 	let self = this;
	// 	if(!messages) {
	// 		return;
	// 	}
	// 	// messages.forEach(function(value){
	// 	// 	var fromUserInfo:User;
	// 	// 	var isSelf = false;
	// 	// 	if(value.FromUserName == chatManager.currentUser.UserName) {
	// 	// 		isSelf = true;
	// 	// 		fromUserInfo = chatManager.currentUser;
	// 	// 	}else{
	// 	// 		fromUserInfo = chatManager.chatListInfo[value.FromUserName];
	// 	// 	}
	// 	// 	let item = new ChatContentItem(value,fromUserInfo,isSelf);
	// 	// 	self.$chatContentContainer.append(item.$element);
	// 	// });

	// 	self.$chatContentContainer.scrollTop(self.$chatContentContainer.height());
	// }
}