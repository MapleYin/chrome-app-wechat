import {Injectable} from '@angular/core';

import {CoreService} from './core.service'


import {
	IUser,
	IBaseResponse,
	IInitInfoResResponse
} from '../defined'

const GETUUID_URL = 'https://login.weixin.qq.com/jslogin';
const GETQRCODE_URL = 'https://login.weixin.qq.com/qrcode/';
const WAITLOGIN_URL = 'https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login';
const LOGIN_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage'
const LOGIN_ICON_URL = 'https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login';

const INIT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxinit';

const MATCH_CODE_REG = /code\s*=\s*(.*?)\s*?;/;
const MATCH_UUID_REG = /uuid\s*=\s*\"(.*?)\"\s*?;/;
const MATCH_REDIRECT_URI_REG = /redirect_uri\s*=\s*\"(.*?)\"\s*?;/;


@Injectable()
export class LoginServer {

	private UUID:string;

	constructor(private coreService:CoreService ){
	}

	// 得到 二维码
	getQRImageUrl():Promise<string>{
		let self = this;

		return this.getUUID().then(function(UUID){
			self.UUID = UUID;
			return self.coreService.post(GETQRCODE_URL+UUID,{
				t : 'webwx',
				_ : self.coreService.getTimeStamp()
			},{
				responseType : 'blob'
			}).then(function(response:Response){
				return response.blob().then(function(data){
					let objURL = URL.createObjectURL(data);
					console.log('Get QRCode Image');
					return objURL;
				});
			});
		});
	}

	// 等待扫描与确认登录
	waitForScan(didScan:boolean):Promise<string>{
		let self = this;

		console.log( didScan ? 'Waitting For Confirm' : 'Waitting For Scan');
		return this.coreService.get(WAITLOGIN_URL,{
			tip : didScan ? 0 : 1,
			uuid : self.UUID,
			_ : this.coreService.getTimeStamp()
		}).then(function(response:Response){
			return response.text().then(function(result){
				let code = result.match(MATCH_CODE_REG).pop();
				if(code == '201') {
					return self.waitForScan(true);
				}else if(code == '200'){
					console.log('Confirm Login');
					let redirectUrl = result.match(MATCH_REDIRECT_URI_REG).pop();
					return redirectUrl;
				}else if(code == '408'){ // 等待超时
					console.log('Waitting Times Out');
					return self.waitForScan(didScan);
				}else{
					throw result;
				}
			});
		});
	}

	// 拿到初始化信息
	getBaseInfo(urlString:string):Promise<IInitInfoResResponse>{
		let self = this;
		return this.getCookies(urlString).then(()=>{
			return this.coreService.commonJsonPost(INIT_URL,{
				r : this.coreService.getTimeStamp(),
				lang : 'zh_CN',
				pass_ticket : this.coreService.passTicket
			}).then(function(response:Response){
				console.log('WX Init Done');
				return response.json().then((result:IInitInfoResResponse)=>{
					return result;
				});
			});
		});

			// self.setStatusNotify(data.User.UserName,data.User.UserName);

			// // add latest contact list
			// self.dispatchEvent('AddChatUsers',data.ContactList);


			// // fetch rest group
			// let groupIds:Array<string> = self.convertCharSet(data.ChatSet);
			// self.getContacts(groupIds);
		
	}
	// 初始化得到cookie
	private getCookies(urlString:string):Promise<any>{
		let self = this;
		let url = new URL(urlString);
		return this.coreService.get(LOGIN_URL,{
			ticket : url['searchParams'].get('ticket'),
			uuid : url['searchParams'].get('uuid'),
			lang : 'zh_CN',
			scan : url['searchParams'].get('scan'),
			fun : 'new',
			version : 'v2'
		}).then(function(response:Response){
			console.log('Here Comes the Cookie!');
			return response.text().then(function(result){
				let responseInfo = self.coreService.convertXMLToJSON(result);
				if(responseInfo.ret === '0') {
					self.coreService.passTicket = responseInfo.pass_ticket;
					self.coreService.Uin = responseInfo.wxuin;
					self.coreService.Sid = responseInfo.wxsid;
					self.coreService.Skey = responseInfo.skey;
				}else{
					throw responseInfo;
				}
			})
		})
	}

	// 获取UUID
	private getUUID():Promise<string>{
		let self = this;

		return this.coreService.get(GETUUID_URL,{
			appid : 'wx782c26e4c19acffb',
			fun : 'new',
			lang : 'zh_CN',
			_ : this.coreService.getTimeStamp()
		}).then(function(value){
			return value.text().then(function(result){
				let code = result.match(MATCH_CODE_REG).pop();
				let UUID = result.match(MATCH_UUID_REG).pop();
				if(code == '200') {
					return UUID;
				}else{
					throw 'Get UUID Error With Code :'+code;
				}
			});
		});
	}
}