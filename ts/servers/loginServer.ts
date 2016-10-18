import {CoreServer} from './coreServer'
import {IUser,IBaseResponse,IInitInfoResResponse} from '../models/wxInterface'

let GETUUID_URL = 'https://login.weixin.qq.com/jslogin';
let GETQRCODE_URL = 'https://login.weixin.qq.com/qrcode/';
let WAITLOGIN_URL = 'https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login';
let LOGIN_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage'
let LOGIN_ICON_URL = 'https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login';

let INIT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxinit';

let MATCH_CODE_REG = /code\s*=\s*(.*?)\s*?;/;
let MATCH_UUID_REG = /uuid\s*=\s*\"(.*?)\"\s*?;/;
let MATCH_REDIRECT_URI_REG = /redirect_uri\s*=\s*\"(.*?)\"\s*?;/;



class LoginServer extends CoreServer{

	private UUID:string;

	constructor(){
		super();
	}

	// 得到 二维码
	getQRImageUrl():Promise<string>{
		let self = this;

		return this.getUUID().then(function(UUID){
			self.UUID = UUID;
			return self.post(GETQRCODE_URL+UUID,{
				t : 'webwx',
				_ : self.getTimeStamp()
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
		return this.get(WAITLOGIN_URL,{
			tip : didScan ? 0 : 1,
			uuid : self.UUID,
			_ : this.getTimeStamp()
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
					throw "refreash";
				}
			});
		});
	}

	// 拿到初始化信息
	getBaseInfo(urlString:string):Promise<IInitInfoResResponse>{
		let self = this;
		return this.getCookies(urlString).then(()=>{
			return this.commonJsonPost(INIT_URL,{
				r : this.getTimeStamp(),
				lang : 'zh_CN',
				pass_ticket : this.class.passTicket
			}).then(function(response:Response){
				console.log('WX Init Done');
				return response.json().then((result:IInitInfoResResponse)=>{
					console.log('Get User Info');
					self.class.account = result.User;
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
	private getCookies(urlString:string):Promise<null>{
		let self = this;
		let url = new URL(urlString);
		return this.get(LOGIN_URL,{
			ticket : url['searchParams'].get('ticket'),
			uuid : url['searchParams'].get('uuid'),
			lang : 'zh_CN',
			scan : url['searchParams'].get('scan'),
			fun : 'new',
			version : 'v2'
		}).then(function(response:Response){
			console.log('Here Comes the Cookie!');
			return response.text().then(function(result){
				let responseInfo = self.convertXMLToJSON(result);
				if(responseInfo.ret === '0') {
					self.class.passTicket = responseInfo.pass_ticket;
					self.class.Uin = responseInfo.wxuin;
					self.class.Sid = responseInfo.wxsid;
					self.class.Skey = responseInfo.skey;
				}else{
					throw responseInfo;
				}
			})
		})
	}

	// 获取UUID
	private getUUID():Promise<string>{
		let self = this;

		return this.get(GETUUID_URL,{
			appid : 'wx782c26e4c19acffb',
			fun : 'new',
			lang : 'zh_CN',
			_ : this.getTimeStamp()
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


export let loginServer = new LoginServer();