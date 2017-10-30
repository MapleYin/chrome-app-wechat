import {Injectable} from '@angular/core';


import {IBaseRequest} from '../defined'



const EXEC_COOKIE_REG = /<(\w+)>(?!<)(.+?)</g


@Injectable()
export class CoreService {
	passTicket:string;
	Uin:string;
	Sid:string;
	Skey:string;


	get(originUrl:string,params?,headers?,options?):Promise<Response>{
		let url = new URL(originUrl);
		for (var key in params) {
			url['searchParams'].append(key,params[key]);
		}

		return fetch(url.toString(),{
			credentials : 'include',
			headers : headers
		});
	}

	post(originUrl:string,params?,headers?,options?):Promise<Response>{
		return fetch(originUrl.toString(),{
			method: "POST",
			credentials : 'include',
			body : JSON.stringify(params),
			headers : headers
		});
	}



	baseRequest():IBaseRequest{
		return {
			Uin : this.Uin,
			Sid : this.Sid,
			Skey : this.Skey,
			DeviceID : this.getDeviceID()
		}
	}

	getDeviceID() {
    	return "e" + ("" + Math.random().toFixed(15)).substring(2, 17)
	}

	commonJsonPost(urlString:string,urlParams?:{[key:string]:string|number},postData?:{[key:string]:any}):Promise<Response> {
		let url = new URL(urlString);
		for (var key in urlParams) {
			url['searchParams'].append(key,urlParams[key].toString());
		}

		if(postData) {
			postData['BaseRequest'] = this.baseRequest();
		}else{
			postData = {
				BaseRequest : this.baseRequest()
			};
		}

		return this.post(url.toString(),postData);
	}
	

	convertXMLToJSON(XMLString):any {
		var json = {},
			result;
		while(result = EXEC_COOKIE_REG.exec(XMLString)){
			if(result.length == 3) {
				json[result[1]] = result[2];
			}
		}
		return json;
	}

	getTimeStamp(){
		return + new Date()
	}
}