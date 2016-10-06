import {WxChatServer} from './wxChatServer'
import {User,WxMessage} from '../models/wxModels'
import {Eventable} from './eventable'
import {fetchRemoteImage} from '../tools/chromeTools'


export class WxChatManager extends Eventable{
	private wxChatServer:WxChatServer;

	chatList:Array<string> = [];
	chatListInfo = {};
	allContact:Array<User>;
	currentUser:User;

	constructor(loginInfo){
		super();
		let self = this;

		this.wxChatServer = new WxChatServer(loginInfo);

		this.wxChatServer.on('InitDone',function(){
			self.currentUser = this.currentUser;
			if(self.currentUser.HeadImgUrl.search(/chrome-extension/) == -1) {
				fetchRemoteImage('https://wx.qq.com'+self.currentUser.HeadImgUrl,function(localUrl){
					self.currentUser.HeadImgUrl = localUrl;
				});
			}
		});

		this.wxChatServer.on('AddChatUsers',function(list:Array<User>){
			list = self.preProcessingContactList(list);
			list = list.sort(function(value1,value2){
				return value2.ContactFlag - value1.ContactFlag;
			});
			list.forEach(function(value){
				if(!(value.UserName in self.chatListInfo)) {
					self.chatList.push(value.UserName);
				}
				self.chatListInfo[value.UserName] = value;
				if(value.HeadImgUrl.search(/chrome-extension/) == -1) {
					fetchRemoteImage('https://wx.qq.com'+value.HeadImgUrl,function(localUrl){
						value.HeadImgUrl = localUrl;
					});
				}
					
			});

			self.dispatchEvent('AddChatUsers');
		});

		this.wxChatServer.on('GetAllContactUsers',function(list:Array<User>){
			self.allContact = list;
		});



		this.wxChatServer.on('newMessage',function(list:Array<WxMessage>){
			console.log('Here Come the New Messages');
			self.dispatchEvent('newMessage',list);
		});		
	}

	init(){
		this.wxChatServer.start();
	}

	sendMessage(toUserName:string,content:string,callback){
		this.wxChatServer.sendMessage(toUserName,content,callback);
	}

	private preProcessingContactList(list:Array<User>):Array<User>{
		return list;
	}

	private processNewMessage(){

	}
}