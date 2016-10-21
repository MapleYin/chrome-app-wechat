import {loginServer} from './servers/loginServer'
import {NotificationCenter} from './utility/notificationCenter'
import {IUser,IMessage,StatusNotifyCode} from './models/wxInterface'
import {contactManager} from './manager/contactManager'
import {chatManager} from './manager/chatManager'
import {messageManager} from './manager/messageManager'

import {chatListController} from './controller/chatListController'
import {chatContentController} from './controller/chatContentController'
export class App {
	constructor(redirectUrl) {
		let self = this;

		loginServer.getBaseInfo(redirectUrl).then((result)=>{
			// 保存 SyncKey
			messageManager.setSyncKey(result.SyncKey);

			// 添加联系人信息
			contactManager.setAccount(result.User);
			contactManager.addContacts(result.ContactList);

			// 聊天列表初始化
			chatManager.initChatList(result.ChatSet);

			// 初始化完成状态
			messageManager.initDoneStatusNotify();

			// 开始信息同步检测
			console.log('Start Message Check');
			messageManager.startMessageCheck();

			// 获取全部联系人列表
			contactManager.initContact(0);
		}).catch(reason=>{
			console.log(reason);
		});
		document.addEventListener('keydown',event=>{
			if(event.metaKey && event.keyCode == 87) {
				event.preventDefault();
				chrome.app.window.current().hide();	
			}
		});
	}
}