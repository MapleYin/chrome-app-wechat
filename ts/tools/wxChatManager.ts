import {wxChatServer} from './wxChatServer'
import {User,WxMessage} from '../models/wxModels'
import {Eventable} from './eventable'
import {fetchRemoteImage} from '../tools/chromeTools'


class WxChatManager extends Eventable{
	chatList:Array<string> = [];
	chatListInfo = {};
	allContact:Array<User>;
	currentUser:User;

	constructor(){
		super();
		let self = this;

		wxChatServer.on('InitDone',function(){
			self.currentUser = this.currentUser;
			if(self.currentUser.HeadImgUrl.search(/chrome-extension/) == -1) {
				fetchRemoteImage('https://wx.qq.com'+self.currentUser.HeadImgUrl,function(localUrl){
					self.currentUser.HeadImgUrl = localUrl;
				});
			}
		});

		wxChatServer.on('AddChatUsers',function(list:Array<User>){
			list = self.preProcessingContactList(list);
			list = list.sort(function(value1,value2){
				return value2.ContactFlag - value1.ContactFlag;
			});
			list.filter(function(value){
				if( (value.VerifyFlag == 0 && value.UserName.slice(0,1) == '@')
				 || value.UserName == 'filehelper') {
					return true;
				}else{
					return false;
				}
			});
			list.forEach(function(value){
				if(!(value.UserName in self.chatListInfo)) {
					self.chatList.push(value.UserName);
					self.chatListInfo[value.UserName] = value;
					if(value.HeadImgUrl.search(/chrome-extension/) == -1) {
						fetchRemoteImage('https://wx.qq.com'+value.HeadImgUrl,function(localUrl){
							value.HeadImgUrl = localUrl;
						});
					}
				}
			});

			self.dispatchEvent('AddChatUsers');
		});

		wxChatServer.on('GetAllContactUsers',function(list:Array<User>){
			self.allContact = list;
		});

		wxChatServer.on('newMessage',function(list:Array<WxMessage>){
			console.log('Here Come the New Messages');
			self.dispatchEvent('newMessage',list);
		});		
	}

	init(loginInfo){
		wxChatServer.start(loginInfo);
	}

	sendMessage(toUserName:string,content:string,callback){
		wxChatServer.sendMessage(toUserName,content,callback);
	}

	private preProcessingContactList(list:Array<User>):Array<User>{
		return list;
	}

	private processNewMessage(){

	}
}


export let wxChatManager = new WxChatManager();