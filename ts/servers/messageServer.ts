import {CoreServer} from './coreServer'
import {ISyncKey,ISyncResponse,StatusNotifyCode} from '../models/wxInterface'

let SYNC_CHECK_URL = 'https://webpush.wx.qq.com/cgi-bin/mmwebwx-bin/synccheck';
let SYNC_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxsync';
let MESSAGE_SENDING_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxsendmsg';
let MESSAGE_IMAGE_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetmsgimg';
let STATUS_NOTIFY_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxstatusnotify';


let MATCH_RETCODE_REG = /retcode\s*:\s*\"(.*?)\"/;
let MATCH_SELECTOR_REG = /selector\s*:\s*\"(.*?)\"/;



class MessageServer extends CoreServer{
	syncKey : ISyncKey;
	private syncCheckStartTime;

	// SYNC
	private sync():Promise<Response>{
		let self = this;

		return this.commonJsonPost(SYNC_URL,{
			sid : this.class.Sid,
			skey : this.class.Skey,
			lang : 'zh_CN',
			pass_ticket : this.class.passTicket
		},{
			SyncKey : this.syncKey,
			rr : ~this.getTimeStamp()
		}).then(function(response:Response){
			response.json().then(function(result:ISyncResponse){
				if(result.BaseResponse.Ret == 0) {
					self.syncKey = result.SyncKey;
					// if(!self.didCheckSystemMessage) {
					// 	self.checkForSystemMessageOnceForLatestContact(result.AddMsgList);
					// }
					return result;
				}else{
					throw result.BaseResponse;
				}
			})
		})
	}

	// sync check
	syncCheck(){
		let self = this;
		if(!this.syncCheckStartTime) {
			this.syncCheckStartTime = this.getTimeStamp();
		}
		this.get(SYNC_CHECK_URL,{
			r : this.getTimeStamp(),
			skey : this.class.Skey,
			sid : this.class.Sid,
			uin : this.class.Uin,
			deviceid : this.class.getDeviceID(),
			synckey : this.syncKeyToString(),
			_ : self.syncCheckStartTime++
		}).then(function(response:Response){
			response.text().then(function(result){
				let retcode = result.match(MATCH_RETCODE_REG).pop();
				let selector = result.match(MATCH_SELECTOR_REG).pop();
				if(retcode == '0') {
					if(selector == '2') {
						self.sync().then(function(){
							self.syncCheck();
						});
					}else if(selector== '0'){
						self.syncCheck();
					}
				}else{
					console.log('logout!');
				}
			});
		});
	}


	sendMessage(toUserName:string,content:string):Promise<Response>{
		let self = this;
		let localID = this.createLocalID();
		let postData = {
			BaseRequest : this.class.baseRequest(),
			Msg : {
				ClientMsgId : localID,
				LocalID : localID,
				Content : content,
				FromUserName : self.class.account.UserName,
				ToUserName : toUserName,
				Type : 1
			},
			Scene : 0
		};
		return self.commonJsonPost(MESSAGE_SENDING_URL,{
			lang : 'zh_CN',
			pass_ticket : this.class.passTicket
		},postData);
	}

	// webwxstatusnotify
	setStatusNotify(ToUserName,notifyCode:StatusNotifyCode){
		let postData = {
			BaseRequest : this.class.baseRequest(),
		};
		this.commonJsonPost(STATUS_NOTIFY_URL,null,{
			ClientMsgId : this.getTimeStamp(),
			FromUserName : this.class.account.UserName,
			ToUserName : ToUserName,
			Code : notifyCode 
		}).then(function(respone:Response){
			console.log('Set Status Notify');
		});
	}
	
	private syncKeyToString(){
		let resultArray = [];
		this.syncKey.List.forEach(function(value:any){
			resultArray.push(value.Key+'_'+value.Val);
		});

		return resultArray.join('|');
	}

	private createLocalID(){
		let timeStamp = this.getTimeStamp();
		return (timeStamp*10000+this.randomNumber(9999)).toString();
	}

	private randomNumber(count):number{
		return Math.floor(Math.random() * count);
	}
}

export let messageServer = new MessageServer();