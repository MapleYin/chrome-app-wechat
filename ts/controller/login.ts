import {Component} from 'angular2/core';
import {loginServer} from '../servers/loginServer'


@Component({
	'selector': 'body',
    'template': 
    `<section class="login">
    	<figure class="login-area">
    		<img src="{{QRCodeUrl}}" id="QRCode">
    		<h1>扫码登录微信</h1>
    		<p>ChromeApp微信需要配合你的手机登录使用</p>
    	</figure>
    </section>`,
    'directives': [],
    'providers': []
})

export class Login{
	private QRCodeUrl:string;

	constructor(){
		let self = this;
		self.start();	
	}

	start(){
		let self = this;
		loginServer.getQRImageUrl().then(function(value){
			self.QRCodeUrl = value;
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