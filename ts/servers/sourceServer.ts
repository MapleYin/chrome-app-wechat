import {CoreServer} from './coreServer'

let UserHeadImageCache:{[key:string]:string} = {};

class SourceServer extends CoreServer{
	fetchUserHeadImage(url:string):Promise<string>{
		if(url in UserHeadImageCache) {
			return new Promise((resolve,reject)=>{
				console.log('Get UserHead Image From Cache!');
				resolve(UserHeadImageCache[url]);
			});
		}else{
			return this.get<Blob>(url,null,{
				responseType : 'blob'
			}).then(result=>{
				let objURL = URL.createObjectURL(result);
				console.log('Get UserHead Image');
				UserHeadImageCache[url] = objURL;
				return objURL;
			});
		}
	}
}

export let sourceServer = new SourceServer();