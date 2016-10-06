import {WxLogin} from './tools/wxLogin'
import {WxChatManager} from './tools/wxChatManager'
import {WxMessage} from './models/wxModels'
import {ChatList} from './controller/chatList'
import {ChatContent} from './controller/chatContent'
import {test} from './test'
export class App {
	private wxLogin = new WxLogin();
	private chatList = new ChatList();
	private chatContent = new ChatContent();
	private wxChatManager:WxChatManager;
	constructor(redirectUrl) {
		let self = this;
		this.wxLogin.init(redirectUrl).then(function(value){
			self.wxChatManager = new WxChatManager(value.data);

			self.init();
		});
	}


	init(){
		let self = this;

		self.wxChatManager.on('AddChatUsers',function(){
			console.log('AddChatUsers');
			self.chatList.setChatListData(this.chatList,this.chatListInfo);
			self.chatContent.setChatListData(this.chatListInfo,this.currentUser);
		});

		self.wxChatManager.on('newMessage',function(messages:Array<WxMessage>){
			let userMessages:Array<WxMessage> = messages.filter(function(value){
				return value.MsgType == 1 || value.MsgType == 3;
			});
			self.chatContent.newMessage(userMessages);
			self.chatList.newMessage(userMessages);
		});

		self.chatList.on('SelectUser',function(userName:string){
			self.chatContent.selectUser(userName,self.wxChatManager.chatListInfo[userName]);
		});

		self.chatContent.on('SendingMessage',function(content,callback){
			self.wxChatManager.sendMessage(this.currentChatUser,content,function(result){
				if(callback) {
					callback(result);
				}
			});
		});

		self.wxChatManager.init();
	}
}