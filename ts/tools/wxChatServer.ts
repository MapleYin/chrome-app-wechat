import {User,WxMessage} from '../models/wxModels'
import {Eventable} from './eventable'


let INIT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxinit';
let STATUS_NOTIFY_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxstatusnotify';
let GET_CONTACT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxbatchgetcontact';
let GET_ALL_CONTACT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetcontact';
let SYNC_CHECK_URL = 'https://webpush.wx.qq.com/cgi-bin/mmwebwx-bin/synccheck';
let SYNC_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxsync';
let MESSAGE_SENDING_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxsendmsg';


let MATCH_RETCODE_REG = /retcode\s*:\s*\"(.*?)\"/;
let MATCH_SELECTOR_REG = /selector\s*:\s*\"(.*?)\"/;

interface WxBaseRequest{
	Uin:string;
	Sid:string;
	Skey:string;
	DeviceID:string;
}

interface WxBaseResponse{
	ErrMsg : string;
	Ret : 0;
}

interface WxSyncKey{
	Count:number;
	List:Array<Object>;
}

interface WxSyncResponse{
	BaseResponse : WxBaseResponse;
	AddMsgCount : number;
	AddMsgList : Array<any>;
	SyncKey : WxSyncKey;
}

interface WxBatchContactResponse{
	BaseResponse : WxBaseResponse;
	ContactList : Array<any>;
	Count : number;
}

interface WxContactResponse{
	BaseResponse : WxBaseResponse;
	MemberCount : number;
	MemberList : Array<any>	;
}

export class WxChatServer extends Eventable{

	private didCheckSystemMessage:boolean = false;

	private passTicket;
	private baseRequest:WxBaseRequest;
	private syncKey:WxSyncKey;

	private syncCheckStartTime;

	currentUser:User;
	
	constructor(loginInfo){
		super();
		this.passTicket = loginInfo.pass_ticket;
		this.baseRequest = {
			Uin : loginInfo.wxuin,
			Sid : loginInfo.wxsid,
			Skey : loginInfo.skey,
			DeviceID : this.getDeviceID()
		};
	}

	start(){
		this.getBaseInfo(); // 初始化

		this.getAllContacts(); // 所有联系人信息

	}

	sendMessage(toUserName:string,content:string,callback){
		let self = this;
		let localID = this.createLocalID();
		let postData = {
			BaseRequest : this.baseRequest,
			Msg : {
				ClientMsgId : localID,
				LocalID : localID,
				Content : content,
				FromUserName : self.currentUser.UserName,
				ToUserName : toUserName,
				Type : 1
			},
			Scene : 0
		};

		let urlParams = {
			lang : 'zh_CN',
			pass_ticket : this.passTicket
		};
		let url = new URL(MESSAGE_SENDING_URL);
		for (var key in urlParams) {
			url['searchParams'].append(key,urlParams[key]);
		}
		self.commonJsonPost(url,postData,function(data){
			if(callback) {
				callback(data);
			}
		});
	}

	// 拿到初始化信息
	// step 1
	private getBaseInfo(){
		let self = this;
		let postData = {
			BaseRequest : this.baseRequest
		};

		let urlParams = {
			r : this.timeStamp(),
			lang : 'zh_CN',
			pass_ticket : this.passTicket
		};
		let url = new URL(INIT_URL);
		for (var key in urlParams) {
			url['searchParams'].append(key,urlParams[key]);
		}

		this.commonJsonPost(url.toString(),postData,function(data){
			console.log('WX Init Done');
			self.syncKey = data.SyncKey;
			self.currentUser = data.User;

			self.dispatchEvent('InitDone');

			self.setStatusNotify(data.User.UserName,data.User.UserName);

			// add latest contact list
			self.dispatchEvent('AddChatUsers',data.ContactList);


			// fetch rest group
			let groupIds:Array<string> = self.convertCharSet(data.ChatSet);
			self.getContacts(groupIds);

			console.log('Start Sync Check');
			self.syncCheckStartTime = self.timeStamp();
			self.syncCheck();// 开始信息同步检测
		});
	}

	// webwxstatusnotify
	// step 2
	private setStatusNotify(FromUserName,ToUserName){
		let postData = {
			BaseRequest : this.baseRequest,
			ClientMsgId : this.timeStamp(),
			FromUserName : FromUserName,
			ToUserName : ToUserName,
			Code : 3
		};
		this.commonJsonPost(STATUS_NOTIFY_URL,postData,function(data){
			console.log('Set Status Notify');
		});
	}

	// 
	// sync check
	private syncCheck(){
		let self = this;
		$.ajax({
			url : SYNC_CHECK_URL,
			data : {
				r : this.timeStamp(),
				skey : this.baseRequest.Skey,
				sid : this.baseRequest.Sid,
				uin : this.baseRequest.Uin,
				deviceid : this.baseRequest.DeviceID,
				synckey : this.syncKeyToString(),
				_ : self.syncCheckStartTime++
			},
			success : function(data){
				let retcode = data.match(MATCH_RETCODE_REG).pop();
				let selector = data.match(MATCH_SELECTOR_REG).pop();
				if(retcode == '0') {
					if(selector == '2') {
						self.sync(function(){
							self.syncCheck();
						});
					}else if(selector== '0'){
						self.syncCheck();
					}
					
				}else{
					console.log('logout!');
				}
			}
		})
	}

	// SYNC
	// SYNC_URL
	private sync(callback){
		let self = this;
		let postData = {
			BaseRequest : this.baseRequest,
			SyncKey : this.syncKey,
			rr : ~this.timeStamp()
		};

		let urlParams = {
			sid : this.baseRequest.Sid,
			skey : this.baseRequest.Skey,
			lang : 'zh_CN',
			pass_ticket : this.passTicket
		};

		let url = new URL(SYNC_URL);

		for (var key in urlParams) {
			url['searchParams'].append(key,urlParams[key]);
		}
		this.commonJsonPost(url.toString(),postData,function(data:WxSyncResponse){
			if(data.BaseResponse.Ret == 0) {
				self.syncKey = data.SyncKey;
				if(!self.didCheckSystemMessage) {
					self.checkForSystemMessageOnceForLatestContact(data.AddMsgList);
				}
				self.dispatchEvent('newMessage',data.AddMsgList);
			}else{
				console.error(data);
			}

			if(callback) {
				callback();
			}
		});
	}

	// 
	private checkForSystemMessageOnceForLatestContact(messages:Array<WxMessage>){
		let sysMessage:WxMessage = messages.find(function(value){
			return value.MsgType == 51;
		});

		if(sysMessage) {
			this.getContacts(sysMessage.StatusNotifyUserName.split(','));
			this.didCheckSystemMessage = true;
		}
	}


	private getContacts(contactsList:Array<string>){
		let self = this;

		let contactsListObject = contactsList.map(function(value){
			return {
				UserName : value,
				EncryChatRoomId : ''
			}
		});

		let postData = {
			BaseRequest : this.baseRequest,
			Count : contactsListObject.length,
			List : contactsListObject
		};

		let urlParams = {
			type : 'ex',
			r : this.timeStamp(),
			lang : 'zh_CN',
			pass_ticket : this.passTicket
		};
		let url = new URL(GET_CONTACT_URL);
		for (var key in urlParams) {
			url['searchParams'].append(key,urlParams[key]);
		}

		this.commonJsonPost(url.toString(),postData,function(data){
			self.dispatchEvent('AddChatUsers',data.ContactList);
		});
	}

	private getAllContacts(){
		let self = this;
		$.ajax({
			url : GET_ALL_CONTACT_URL,
			data : {
				lang : 'zh_CN',
				pass_ticket : this.passTicket,
				r : this.timeStamp(),
				seq : 0,
				skey : this.baseRequest.Skey
			},
			dataType:'json',
			xhrFields: {
				withCredentials: true
			},
			success : function(data){
				if(data.BaseResponse.Ret == 0) {
					console.log('Get All Contact');
					self.dispatchEvent('GetAllContactUsers',data.MemberList);
				}
			}

		});
	}


	




	private convertCharSet(charSet:string):Array<string>{
		let users:Array<string> = charSet.split(',');

		return users.filter(function(value:string){
			return value.slice(0,2) == '@@';
		});
	}


	private commonJsonPost(URL,postData,callback){
		$.ajax({
			url : URL,
			method : 'POST',
			contentType : 'application/json; charset=UTF-8',
			dataType : 'json',
			data : JSON.stringify(postData),
			xhrFields: {
				withCredentials: true
			},
			success : function(data){
				callback(data);
			}
		})
	}

	private syncKeyToString(){
		let resultArray = [];
		this.syncKey.List.forEach(function(value:any){
			resultArray.push(value.Key+'_'+value.Val);
		});

		return resultArray.join('|');
	}

	private createLocalID(){
		let timeStamp = this.timeStamp();
		return (timeStamp*10000+this.randomNumber(9999)).toString();

	}

	private getDeviceID() {
    	return "e" + ("" + Math.random().toFixed(15)).substring(2, 17)
	}

	private timeStamp(){
		let currentTime = new Date();
		return currentTime.getTime();
	}

	private randomNumber(count):number{
		return Math.floor(Math.random() * count);
	}
}