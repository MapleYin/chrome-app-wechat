import {CoreServer} from './coreServer'
import {ISyncKey,ISyncResponse,StatusNotifyCode,MessageType,IMessage} from '../models/wxInterface'
import {NotificationCenter} from '../utility/notificationCenter'

let SYNC_CHECK_URL = 'https://webpush.wx.qq.com/cgi-bin/mmwebwx-bin/synccheck';
let SYNC_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxsync';
let MESSAGE_SENDING_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxsendmsg';
let STATUS_NOTIFY_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxstatusnotify';


let MATCH_RETCODE_REG = /retcode\s*:\s*\"(.*?)\"/;
let MATCH_SELECTOR_REG = /selector\s*:\s*\"(.*?)\"/;



class MessageServer extends CoreServer{
	syncKey : ISyncKey;
	syncCheckKey : ISyncKey;
	private syncCheckStartTime;

	// SYNC
	private sync():Promise<ISyncResponse>{
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
			return response.json().then(function(result:ISyncResponse){
				if(result.BaseResponse.Ret == 0) {
					self.syncKey = result.SyncKey;
					self.syncCheckKey = result.SyncCheckKey;
					NotificationCenter.post<ISyncResponse>('sync.get.success',result);
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
			synckey : this.syncCheckKeyToString(),
			_ : self.syncCheckStartTime++
		}).then(function(response:Response){
			response.text().then(function(result){
				let retcode = result.match(MATCH_RETCODE_REG).pop();
				let selector = result.match(MATCH_SELECTOR_REG).pop();
				if(retcode == '0') {
					if(selector== '0'){
						self.syncCheck();
					}else{
						self.sync().then(function(){
							self.syncCheck();
						}).catch(reason=>{
							console.error(`[MessageServer sync] error:${reason}`);
							console.log(`Restart at 5 seconds`);
							setTimeout(()=>{
								self.syncCheck();
							},5000);
						});
					}
				}else{
					NotificationCenter.post('user.status.logout');
				}
			}).catch(reason=>{
				console.error(`[MessageServer syncCheck] error:${reason}`);
				console.log(`Restart at 10 seconds`);
				setTimeout(()=>{
					self.syncCheck();
				},10000);
			});
		}).catch(reason=>{
			console.error(`[MessageServer syncCheck] error:${reason}`);
			console.log(`Restart at 10 seconds`);
			setTimeout(()=>{
				self.syncCheck();
			},10000);
		});
	}


	sendMessage(message:IMessage):Promise<any>{
		let self = this;
		let postData = {
			BaseRequest : this.class.baseRequest(),
			Msg : {
				ClientMsgId : message.LocalID,
				LocalID : message.LocalID,
				Content : message.Content,
				FromUserName : message.FromUserName,
				ToUserName : message.ToUserName,
				Type : message.MsgType
			},
			Scene : 0
		};
		return self.commonJsonPost(MESSAGE_SENDING_URL,{
			lang : 'zh_CN',
			pass_ticket : this.class.passTicket
		},postData).then(response=>{
			return response.json();
		});
	}

	createSendingMessage(toUserName:string,content:string,msgType:MessageType):IMessage{
		let localID = this.createLocalID();
		let self = this;
		return {
			ClientMsgId : localID,
			LocalID : localID,
			Content : content,
			FromUserName : self.class.account.UserName,
			ToUserName : toUserName,
			MsgType : msgType,
			CreateTime : self.getTimeStamp()/1000
		}
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
	
	private syncCheckKeyToString(){
		let resultArray = [];
		if(!this.syncCheckKey) {
			this.syncCheckKey = this.syncKey;
		}
		this.syncCheckKey.List.forEach(function(value:any){
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