import {BaseManager} from './baseManager'
import {messageServer} from '../servers/messageServer'
import {UserModel} from '../models/userModel'

class ChatManager extends BaseManager{

	chatList:string[] = [];

	initChatList(chatSetString:string){
		let self = this;
		chatSetString.split(',').forEach(username=>{
			if(!UserModel.isShieldUser(username) && !UserModel.isSpUser(username)) {
				if(self.chatList.indexOf(username) == -1) {
					self.chatList.push(username);
					if(UserModel.isRoomContact(username)) {
						
					}
				}
			}
		});
	}

}



export let chatManager = new ChatManager();