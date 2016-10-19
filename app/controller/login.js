System.register(['angular2/core', '../servers/loginServer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var core_1, loginServer_1;
    var Login;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (loginServer_1_1) {
                loginServer_1 = loginServer_1_1;
            }],
        execute: function() {
            Login = class Login {
                constructor() {
                    let self = this;
                    self.start();
                }
                start() {
                    let self = this;
                    loginServer_1.loginServer.getQRImageUrl().then(function (value) {
                        self.QRCodeUrl = value;
                        return loginServer_1.loginServer.waitForScan(false);
                    }).then(function (redirectUrl) {
                        self.jumpToMain(redirectUrl);
                    });
                }
                jumpToMain(info) {
                    chrome.runtime.sendMessage({
                        command: 'OPEN_MAIN',
                        data: info
                    });
                }
            };
            Login = __decorate([
                core_1.Component({
                    'selector': 'body',
                    'template': `<section class="login">
    	<figure class="login-area">
    		<img src="{{QRCodeUrl}}" id="QRCode">
    		<h1>扫码登录微信</h1>
    		<p>ChromeApp微信需要配合你的手机登录使用</p>
    	</figure>
    </section>`,
                    'directives': [],
                    'providers': []
                })
            ], Login);
            exports_1("Login", Login);
        }
    }
});
