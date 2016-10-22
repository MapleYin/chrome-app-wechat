import {loginServer} from '../servers/loginServer'



export class Login{

	private $QRCode = $('#QRCode');

	constructor(){
		let self = this;

		self.start();
		
	}

	start(){
		let self = this;
		loginServer.getQRImageUrl().then(function(value){
			self.$QRCode.attr('src',value);
			return loginServer.waitForScan(false);
		}).then(function(redirectUrl){
			self.jumpToMain(redirectUrl);
		}).catch(reason=>{
			console.error(reason);
			console.log(`refreash in 5 seconds`);
			setTimeout(()=>{
				self.start();
			},5);
		});
	}

	jumpToMain(info){
		chrome.runtime.sendMessage({
			command:'OPEN_MAIN',
			data: info
		});
	}
}