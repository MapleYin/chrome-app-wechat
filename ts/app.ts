import {
	loginServer,
	messageServer,
	contactServer
} from './servers/all'
import {IUser,IMessage,StatusNotifyCode} from './models/wxInterface'
import {contactManager} from './manager/contactManager'
import {ChatList} from './controller/chatList'
import {ChatContent} from './controller/chatContent'
import {test} from './test'
export class App {
	private chatList = new ChatList();
	private chatContent = new ChatContent();


	constructor(redirectUrl) {
		let self = this;

		loginServer.getBaseInfo(redirectUrl).then((result)=>{
			// 保存 SyncKey
			messageServer.syncKey = result.SyncKey;

			// 初始化完成状态
			messageServer.setStatusNotify(result.User.UserName,StatusNotifyCode.INITED);

			// 添加联系人信息
			contactManager.addContacts(result.ContactList);

			// 获取部分联群系人信息
			// let userNames = result.ChatSet.split(',');
			// contactManager.initChatList(userNames);

			// 开始信息同步检测
			console.log('Start Sync Check');
			messageServer.syncCheck();
		});

		// self.init();
		// chatManager.init(value.data);
	}


	init(){
		let self = this;

		chatManager.on('AddChatUsers',function(){
			console.log('AddChatUsers');
			
		});

		chatManager.on('newMessage',function(messages:IMessage[]){
			let userMessages:IMessage[] = messages.filter(function(value){
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