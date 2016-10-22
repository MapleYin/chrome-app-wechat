define(["require", "exports", '../servers/loginServer'], function (require, exports, loginServer_1) {
    "use strict";
    class Login {
        constructor() {
            this.$QRCode = $('#QRCode');
            let self = this;
            self.start();
        }
        start() {
            let self = this;
            loginServer_1.loginServer.getQRImageUrl().then(function (value) {
                self.$QRCode.attr('src', value);
                return loginServer_1.loginServer.waitForScan(false);
            }).then(function (redirectUrl) {
                self.jumpToMain(redirectUrl);
            }).catch(reason => {
                console.error(reason);
                console.log(`refreash in 5 seconds`);
                setTimeout(() => {
                    self.start();
                }, 5);
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
