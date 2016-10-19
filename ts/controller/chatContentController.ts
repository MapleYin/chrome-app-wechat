import {IUser,IMessage} from '../models/wxInterface'
import {UserModel} from '../models/userModel'
import {ChatContentItem} from '../template/chatContentItem'
import {BaseController} from './baseController'
import {chatManager} from '../manager/chatManager'
import {contactManager} from '../manager/contactManager'

import {NotificationCenter} from '../utility/notificationCenter'

class ChatContentController extends BaseController{
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
		let selectUserInfo = contactManager.getContact(username);
		if(selectUserInfo) {
			this.$chatContentHeader.find('.username').text(selectUserInfo.getDisplayName());
			this.currentChatUser = username;
			this.displayMessageContent(username);
			this.$inputTextarea.focus();
		}	
	}

	newMessage(message:IMessage){
		let self = this;
		console.log('Here Comes User Message');
		if(!(message.MMPeerUserName in self.messageList)) {
			self.messageList[message.MMPeerUserName] = [];
		}
		self.messageList[message.MMPeerUserName].push(message);
		if(message.MMPeerUserName == self.currentChatUser) {
			this.updateMessageContent([message]);
		}
	}

	private sendMessage(content:string){
		NotificationCenter.post<string>('message.send.text',content);
	}

	private displayMessageContent(userName){
		let self = this;
		let messages:IMessage[] = this.messageList[userName];
		self.$chatContentContainer.empty();
		this.updateMessageContent(messages);
	}

	private updateMessageContent(messages:IMessage[]){
		let self = this;
		if(!messages) {return;}
		messages.forEach(message=>{
			let sender = contactManager.getContact(message.MMActualSender);
			let item = new ChatContentItem(message.MMActualContent,sender);
			self.$chatContentContainer.append(item.$element);
		});
		
		self.$chatContentContainer.scrollTop(self.$chatContentContainer.height());
	}
}
export let chatContentController = new ChatContentController();