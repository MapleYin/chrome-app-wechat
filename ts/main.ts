import {App} from './app'


chrome.storage.sync.get('redirectUrl',function(item:any){
	new App(item.redirectUrl);
});