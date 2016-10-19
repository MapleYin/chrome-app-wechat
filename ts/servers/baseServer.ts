import {fetchParams,fetchResult} from '../background/interface'
let EXEC_COOKIE_REG = /<(\w+)>(?!<)(.+?)</g

export class BaseServer{

	get<T>(originUrl:string,params?,headers?,options?):Promise<T>{
		let message:fetchParams = {
			url : originUrl,
			method : 'GET',
			headers : headers || {
				'responseType' : 'json'
			},
			query : params
		}

		return new Promise((resolve,reject)=>{
			chrome.runtime.sendMessage(message,(response:fetchResult)=>{
				if(response.status == 0) {
					resolve(response.data);
				}else{
					reject(response.message);
				}
			});
		});
	}

	post<T>(originUrl:string,params?,postData?,headers?,options?):Promise<T>{
		let message:fetchParams = {
			url : originUrl,
			method : 'POST',
			headers : headers || {
				'responseType' : 'json'
			},
			body : postData && JSON.stringify(postData),
			query : params
		}
		return new Promise((resolve,reject)=>{
			chrome.runtime.sendMessage(message,(response:fetchResult)=>{
				if(response.status == 0) {
					resolve(response.data);
				}else{
					reject(response.message);
				}
			});
		});
	}
	

	protected convertXMLToJSON(XMLString):any{
		var json = {},
			result;
		while(result = EXEC_COOKIE_REG.exec(XMLString)){
			if(result.length == 3) {
				json[result[1]] = result[2];
			}
		}
		return json;
	}

	protected getTimeStamp(){
		return + new Date()
	}
}