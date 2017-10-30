const EXEC_COOKIE_REG = /<(\w+)>(?!<)(.+?)</g

export class BaseServer{

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