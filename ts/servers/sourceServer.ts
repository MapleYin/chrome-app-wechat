import {CoreServer} from './coreServer'

let sourceCache:{[key:string]:string} = {};

class SourceServer extends CoreServer{
	fetchSource(url:string):Promise<string>{
		if(url in sourceCache) {
			return new Promise((resolve,reject)=>{
				console.log('Get Source From Cache!');
				resolve(sourceCache[url]);
			});
		}else{
			return this.get(url,null,{
				responseType : 'blob'
			}).then(response=>{
				return response.blob().then(function(data){ 
					let objURL = URL.createObjectURL(data);
					console.log('Get Source Done');
					sourceCache[url] = objURL;
					return objURL;
				});
			});
		}
	}
}

export let sourceServer = new SourceServer();