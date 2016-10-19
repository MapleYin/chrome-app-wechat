import {BaseServer} from './baseServer'
import {IUser,IBaseRequest} from '../models/wxInterface'

export class CoreServer extends BaseServer{

	static passTicket:string;
	static Uin:string;
	static Sid:string;
	static Skey:string;

	static account:IUser;

	protected class = CoreServer;

	static baseRequest():IBaseRequest{
		return {
			Uin : this.Uin,
			Sid : this.Sid,
			Skey : this.Skey,
			DeviceID : this.getDeviceID()
		}
	}

	static getDeviceID() {
    	return "e" + ("" + Math.random().toFixed(15)).substring(2, 17)
	}

	protected commonJsonPost<T>(urlString:string,urlParams?:{[key:string]:string|number},postData?:{[key:string]:any}):Promise<T>{
		let url = new URL(urlString);
		for (var key in urlParams) {
			url['searchParams'].append(key,urlParams[key]);
		}

		if(postData) {
			postData['BaseRequest'] = CoreServer.baseRequest();
		}else{
			postData = {
				BaseRequest : CoreServer.baseRequest()
			};
		}

		return this.post<T>(url.toString(),postData);
	}

}