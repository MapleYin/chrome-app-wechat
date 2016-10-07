import {WxLogin} from './tools/wxLogin'
import {wxChatManager} from './tools/wxChatManager'
import {WxMessage} from './models/wxModels'
import {ChatList} from './controller/chatList'
import {ChatContent} from './controller/chatContent'
import {test} from './test'
export class App {
	private wxLogin = new WxLogin();
	private chatList = new ChatList();
	private chatContent = new ChatContent();


	constructor(redirectUrl) {
		let self = this;
		this.wxLogin.init(redirectUrl).then(function(value){
			self.init();
			wxChatManager.init(value.data);
		});
	}


	init(){
		let self = this;

		wxChatManager.on('AddChatUsers',function(){
			console.log('AddChatUsers');
			self.chatList.updateChatList();
		});

		wxChatManager.on('newMessage',function(messages:Array<WxMessage>){
			let userMessages:Array<WxMessage> = messages.filter(function(value){
				return value.MsgType == 1 || value.MsgType == 3;
			});
			self.chatContent.newMessage(userMessages);
			self.chatList.newMessage(userMessages);
		});

		self.chatList.on('SelectUser',function(userName:string){
			self.chatContent.selectUser(userName);
		});
	}
}