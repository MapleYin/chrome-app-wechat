import {loginServer} from '../servers/loginServer'



export class Login{
	constructor(){
		let self = this;

		let $QRCode = $('#QRCode');

		self.start($QRCode);
		
	}

	start($QRCode){
		let self = this;
		loginServer.getQRImageUrl().then(function(value){
			$QRCode.attr('src',value);
			return loginServer.waitForScan(false);
		}).then(function(redirectUrl){
			self.jumpToMain(redirectUrl);
		});
	}

	jumpToMain(info){
		chrome.runtime.sendMessage({
			command:'OPEN_MAIN',
			data: info
		});
	}
}