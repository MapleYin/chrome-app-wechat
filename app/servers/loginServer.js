define(["require", "exports", './baseServer'], function (require, exports, baseServer_1) {
    "use strict";
    let GETUUID_URL = 'https://login.weixin.qq.com/jslogin';
    let GETQRCODE_URL = 'https://login.weixin.qq.com/qrcode/';
    let WAITLOGIN_URL = 'https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login';
    let LOGIN_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage';
    let LOGIN_ICON_URL = 'https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login';
    let MATCH_CODE_REG = /code\s*=\s*(.*?)\s*?;/;
    let MATCH_UUID_REG = /uuid\s*=\s*\"(.*?)\"\s*?;/;
    let MATCH_REDIRECT_URI_REG = /redirect_uri\s*=\s*\"(.*?)\"\s*?;/;
    class LoginServer extends baseServer_1.BaseServer {
        constructor() {
            super();
        }
        // 得到 二维码
        getQRImageUrl() {
            let self = this;
            return this.getUUID().then(function (UUID) {
                self.UUID = UUID;
                return self.post(GETQRCODE_URL + UUID, {
                    t: 'webwx',
                    _: self.getTimeStamp()
                }, {
                    responseType: 'blob'
                }).then(function (response) {
                    return response.blob().then(function (data) {
                        let objURL = URL.createObjectURL(data);
                        console.log('Get QRCode Image');
                        return objURL;
                    });
                });
            });
        }
        // 获取UUID
        getUUID() {
            let self = this;
            return this.get(GETUUID_URL, {
                appid: 'wx782c26e4c19acffb',
                fun: 'new',
                lang: 'zh_CN',
                _: this.getTimeStamp()
            }).then(function (value) {
                return value.text().then(function (result) {
                    let code = result.match(MATCH_CODE_REG).pop();
                    let UUID = result.match(MATCH_UUID_REG).pop();
                    if (code == '200') {
                        return UUID;
                    }
                    else {
                        throw 'Get UUID Error With Code :' + code;
                    }
                });
            });
        }
        // 等待扫描与确认登录
        waitForScan(didScan) {
            let self = this;
            console.log(didScan ? 'Waitting For Confirm' : 'Waitting For Scan');
            return this.get(WAITLOGIN_URL, {
                tip: didScan ? 0 : 1,
                uuid: self.UUID,
                _: this.getTimeStamp()
            }).then(function (response) {
                return response.text().then(function (result) {
                    let code = result.match(MATCH_CODE_REG).pop();
                    if (code == '201') {
                        return self.waitForScan(true);
                    }
                    else if (code == '200') {
                        console.log('Confirm Login');
                        let redirectUrl = result.match(MATCH_REDIRECT_URI_REG).pop();
                        return redirectUrl;
                    }
                    else if (code == '408') {
                        console.log('Waitting Times Out');
                        return self.waitForScan(didScan);
                    }
                    else {
                        throw "refreash";
                    }
                });
            });
        }
        appInit(redirectUrl) {
            let self = this;
            let url = new URL(redirectUrl);
            return this.getCookies(url);
        }
        // 初始化得到cookie
        getCookies(url) {
            let self = this;
            return this.get(LOGIN_URL, {
                ticket: url['searchParams'].get('ticket'),
                uuid: url['searchParams'].get('uuid'),
                lang: 'zh_CN',
                scan: url['searchParams'].get('scan'),
                fun: 'new',
                version: 'v2'
            }).then(function (response) {
                console.log('Here Comes the Cookie!');
                return response.text().then(function (result) {
                    let responseInfo = self.convertXMLToJSON(result);
                    if (responseInfo.ret === '0') {
                        return responseInfo;
                    }
                    else {
                        throw responseInfo;
                    }
                });
            });
        }
    }
    exports.loginServer = new LoginServer();
});
