export enum StatusCode{
	success = 0,
	unauthorized = 100,
	accounterror = 101, // 账号或密码错误
	missparams = 200,
	universal = 500
}

export interface ResponseArrayInfo<T>{
	page:Number;
	count:Number;
	list:[T];
}

export interface ResponseObject<T>{
	code : Number;
	message:String;
	data?:T;
}

export interface ResponseArray<T>{
	code : Number;
	message:String;
	data:ResponseArrayInfo<T>;
}
export class BaseServer{
	baseUrl: String;

	constructor(){
	}

	protected post<T>(url:string,params:Object,options?:Object):Promise<T>{
		let body:string = JSON.stringify(params);
		let xhr = new XMLHttpRequest();
		for (var key in options) {
			xhr[key] = options[key];
		}
		xhr.open('POST',url);
		xhr.send(body);

		return this.eventHandler<T>(xhr);
	}
	protected get<T>(url:string,params?:Object,options?):Promise<T>{
		let xhr = new XMLHttpRequest();
		if(params) {
			url+= '?'+this.convertParamsToSearchString(params);
		}
		for (var key in options) {
			xhr[key] = options[key];
		}
		xhr.open('GET',url);
		xhr.send();

		return this.eventHandler<T>(xhr);
	}

	protected eventHandler<T>(xhr:XMLHttpRequest):Promise<T>{
		return new Promise(function(resolve,reject){
			xhr.addEventListener('readystatechange',function(){
				if (this.readyState === this.DONE) {
					if(this.status == 200) {
						resolve({
							code : 0,
							message:'ok',
							data:this.response
						});
					}else{
						resolve({
							code : this.status,
							message:this.response
						});
					}
				}
			});

			xhr.addEventListener('error',function(error){
				reject(error);
			});
		});
	}

	protected setHttpHeader(xhr,headers:Object){
		var key;
		for(key in headers){
			xhr.setRequestHeader(key,headers[key]);
		}
	}
	protected convertParamsToSearchString(params:any):string{
		if(typeof params == 'object') {
			var paramsArray = [];
			for (var key in params) {
				var value = params[key];
				paramsArray.push(key+"="+value);
			}
			return paramsArray.join('&');
		}else{
			return params;
		}
	}
}
