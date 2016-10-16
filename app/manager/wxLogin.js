define(["require", "exports"], function (require, exports) {
    "use strict";
    let GETUUID_URL = 'https://login.weixin.qq.com/jslogin';
    let GETQRCODE_URL = 'https://login.weixin.qq.com/qrcode/';
    let WAITLOGIN_URL = 'https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login';
    let LOGIN_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage';
    let LOGIN_ICON_URL = 'https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login';
    let MATCH_CODE_REG = /code\s*=\s*(.*?)\s*?;/;
    let MATCH_UUID_REG = /uuid\s*=\s*\"(.*?)\"\s*?;/;
    let MATCH_REDIRECT_URI_REG = /redirect_uri\s*=\s*\"(.*?)\"\s*?;/;
    let EXEC_COOKIE_REG = /<(\w+)>(?!<)(.+?)</g;
    class WxLogin {
        constructor() {
        }
        start() {
            let self = this;
            return new Promise(function (resolve, reject) {
                self.getUUID(resolve, reject);
            });
        }
        // 获取UUID
        getUUID(resolve, reject) {
            let self = this;
            let timestamp = new Date();
            $.ajax({
                url: GETUUID_URL,
                method: 'GET',
                data: {
                    appid: 'wx782c26e4c19acffb',
                    fun: 'new',
                    lang: 'zh_CN',
                    _: timestamp.getTime()
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    let code = data.match(MATCH_CODE_REG).pop();
                    let UUID = data.match(MATCH_UUID_REG).pop();
                    if (code == '200') {
                        self.getQRImage(UUID, resolve, reject);
                    }
                    else {
                        reject(data);
                    }
                },
                error: reject
            });
        }
        // 得到 二维码
        getQRImage(UUID, resolve, reject) {
            let self = this;
            let timestamp = new Date();
            $.ajax({
                url: GETQRCODE_URL + UUID,
                method: 'POST',
                data: {
                    t: 'webwx',
                    _: timestamp.getTime()
                },
                xhrFields: {
                    withCredentials: true,
                    responseType: 'blob'
                },
                success: function (data) {
                    let objURL = URL.createObjectURL(data);
                    console.log('Get QRCode Image');
                    resolve({
                        data: objURL,
                        next: new Promise(function (resolveNext, rejectNext) {
                            self.waitForScan(UUID, false, resolveNext, rejectNext);
                        })
                    });
                },
                error: reject
            });
        }
        // 等待扫描与确认登录
        waitForScan(UUID, didScan, resolve, reject) {
            let self = this;
            let timestamp = new Date();
            $.ajax({
                url: WAITLOGIN_URL,
                data: {
                    tip: didScan ? 0 : 1,
                    uuid: UUID,
                    _: timestamp.getTime()
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    let code = data.match(MATCH_CODE_REG).pop();
                    if (code == '201') {
                        console.log('Waitting For Scan');
                        resolve({
                            next: new Promise(function (resolveNext, rejectNext) {
                                self.waitForScan(UUID, true, resolveNext, rejectNext);
                            })
                        });
                    }
                    else if (code == '200') {
                        let redirectUrl = data.match(MATCH_REDIRECT_URI_REG).pop();
                        console.log('Confirm Login');
                        resolve({
                            data: redirectUrl
                        });
                    }
                    else if (code == '408') {
                        self.waitForScan(UUID, didScan, resolve, reject);
                    }
                    else if (code == '400') {
                        reject('refreash');
                    }
                },
                error: reject
            });
        }
        init(redirectUrl) {
            let self = this;
            return new Promise(function (resolve, reject) {
                let url = new URL(redirectUrl);
                self.getCookies(url, resolve, reject);
            });
        }
        // 初始化得到cookie
        getCookies(url, resolve, reject) {
            let self = this;
            let timestamp = new Date();
            $.ajax({
                url: LOGIN_URL,
                data: {
                    ticket: url['searchParams'].get('ticket'),
                    uuid: url['searchParams'].get('uuid'),
                    lang: 'zh_CN',
                    scan: url['searchParams'].get('scan'),
                    fun: 'new',
                    version: 'v2'
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (data, textStatus, jqXHR) {
                    console.log('Here Comes the Cookie!');
                    let responseInfo = self.convertXMLToJSON(data);
                    if (responseInfo.ret === '0') {
                        resolve({
                            data: responseInfo
                        });
                    }
                    else {
                        reject(responseInfo);
                    }
                },
                error: reject
            });
        }
        convertXMLToJSON(XMLString) {
            var json = {}, result;
            while (result = EXEC_COOKIE_REG.exec(XMLString)) {
                if (result.length == 3) {
                    json[result[1]] = result[2];
                }
            }
            return json;
        }
    }
    exports.WxLogin = WxLogin;
});
