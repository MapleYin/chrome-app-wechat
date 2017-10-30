import {Injectable} from '@angular/core';


import {LoginServer} from '../service/login.service'


export class LoginManager {

	constructor(private loginServer:LoginServer) {

	}

	async fetchQRCodeUrl() {

		let url = await this.loginServer.getQRImageUrl();

		return  url;
	}
}