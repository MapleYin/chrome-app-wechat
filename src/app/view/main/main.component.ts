import {Component} from '@angular/core';

import {AccountManager} from '../../manager/account.manager'

@Component({
	selector: 'app-root',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})
export class MainComponent {

	isLogin:boolean;

	constructor(private accountManager:AccountManager) {
		this.isLogin = this.accountManager.isLogin;
	}



}