System.register(['./coreServer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var coreServer_1;
    var GETUUID_URL, GETQRCODE_URL, WAITLOGIN_URL, LOGIN_URL, LOGIN_ICON_URL, INIT_URL, MATCH_CODE_REG, MATCH_UUID_REG, MATCH_REDIRECT_URI_REG, LoginServer, loginServer;
    return {
        setters:[
            function (coreServer_1_1) {
                coreServer_1 = coreServer_1_1;
            }],
        execute: function() {
            GETUUID_URL = 'https://login.weixin.qq.com/jslogin';
            GETQRCODE_URL = 'https://login.weixin.qq.com/qrcode/';
            WAITLOGIN_URL = 'https://login.weixin.qq.com/cgi-bin/mmwebwx-bin/login';
            LOGIN_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage';
            LOGIN_ICON_URL = 'https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login';
            INIT_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxinit';
            MATCH_CODE_REG = /code\s*=\s*(.*?)\s*?;/;
            MATCH_UUID_REG = /uuid\s*=\s*\"(.*?)\"\s*?;/;
            MATCH_REDIRECT_URI_REG = /redirect_uri\s*=\s*\"(.*?)\"\s*?;/;
            LoginServer = class LoginServer extends coreServer_1.CoreServer {
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
                        }, null, {
                            responseType: 'blob'
                        }).then((result) => {
                            console.log(result);
                            console.log('Get QRCode Image');
                            return result;
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
                // 拿到初始化信息
                getBaseInfo(urlString) {
                    let self = this;
                    return this.getCookies(urlString).then(() => {
                        return this.commonJsonPost(INIT_URL, {
                            r: this.getTimeStamp(),
                            lang: 'zh_CN',
                            pass_ticket: this.class.passTicket
                        }).then((result) => {
                            console.log('WX Init Done');
                            console.log('Get User Info');
                            self.class.account = result.User;
                            return result;
                        });
                    });
                    // self.setStatusNotify(data.User.UserName,data.User.UserName);
                    // // add latest contact list
                    // self.dispatchEvent('AddChatUsers',data.ContactList);
                    // // fetch rest group
                    // let groupIds:Array<string> = self.convertCharSet(data.ChatSet);
                    // self.getContacts(groupIds);
                }
                // 初始化得到cookie
                getCookies(urlString) {
                    let self = this;
                    let url = new URL(urlString);
                    return this.get(LOGIN_URL, {
                        ticket: url['searchParams'].get('ticket'),
                        uuid: url['searchParams'].get('uuid'),
                        lang: 'zh_CN',
                        scan: url['searchParams'].get('scan'),
                        fun: 'new',
                        version: 'v2'
                    }).then(function (result) {
                        console.log('Here Comes the Cookie!');
                        let responseInfo = self.convertXMLToJSON(result);
                        if (responseInfo.ret === '0') {
                            self.class.passTicket = responseInfo.pass_ticket;
                            self.class.Uin = responseInfo.wxuin;
                            self.class.Sid = responseInfo.wxsid;
                            self.class.Skey = responseInfo.skey;
                        }
                        else {
                            throw responseInfo;
                        }
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
                    }, {
                        responseType: 'text'
                    }).then(function (result) {
                        console.log(result);
                        let code = result.match(MATCH_CODE_REG).pop();
                        let UUID = result.match(MATCH_UUID_REG).pop();
                        if (code == '200') {
                            return UUID;
                        }
                        else {
                            throw 'Get UUID Error With Code :' + code;
                        }
                    });
                }
            };
            exports_1("loginServer", loginServer = new LoginServer());
        }
    }
});
