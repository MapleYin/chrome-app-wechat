define(["require", "exports", '../servers/loginServer'], function (require, exports, loginServer_1) {
    "use strict";
    class Login {
        constructor() {
            let self = this;
            let $QRCode = $('#QRCode');
            self.start($QRCode);
        }
        start($QRCode) {
            let self = this;
            loginServer_1.loginServer.getQRImageUrl().then(function (value) {
                $QRCode.attr('src', value);
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
    }
    exports.Login = Login;
});
