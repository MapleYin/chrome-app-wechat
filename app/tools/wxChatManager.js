define(["require", "exports", './wxChatServer', './eventable', '../tools/chromeTools'], function (require, exports, wxChatServer_1, eventable_1, chromeTools_1) {
    "use strict";
    class WxChatManager extends eventable_1.Eventable {
        constructor() {
            super();
            this.chatList = [];
            this.chatListInfo = {};
            let self = this;
            wxChatServer_1.wxChatServer.on('InitDone', function () {
                self.currentUser = this.currentUser;
                if (self.currentUser.HeadImgUrl.search(/chrome-extension/) == -1) {
                    chromeTools_1.fetchRemoteImage('https://wx.qq.com' + self.currentUser.HeadImgUrl, function (localUrl) {
                        self.currentUser.HeadImgUrl = localUrl;
                    });
                }
            });
            wxChatServer_1.wxChatServer.on('AddChatUsers', function (list) {
                list = self.preProcessingContactList(list);
                list = list.sort(function (value1, value2) {
                    return value2.ContactFlag - value1.ContactFlag;
                });
                list.filter(function (value) {
                    if ((value.VerifyFlag == 0 && value.UserName.slice(0, 1) == '@')
                        || value.UserName == 'filehelper') {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                list.forEach(function (value) {
                    if (!(value.UserName in self.chatListInfo)) {
                        self.chatList.push(value.UserName);
                    }
                    self.chatListInfo[value.UserName] = value;
                    if (value.HeadImgUrl.search(/chrome-extension/) == -1) {
                        chromeTools_1.fetchRemoteImage('https://wx.qq.com' + value.HeadImgUrl, function (localUrl) {
                            value.HeadImgUrl = localUrl;
                        });
                    }
                });
                self.dispatchEvent('AddChatUsers');
            });
            wxChatServer_1.wxChatServer.on('GetAllContactUsers', function (list) {
                self.allContact = list;
            });
            wxChatServer_1.wxChatServer.on('newMessage', function (list) {
                console.log('Here Come the New Messages');
                self.dispatchEvent('newMessage', list);
            });
        }
        init(loginInfo) {
            wxChatServer_1.wxChatServer.start(loginInfo);
        }
        sendMessage(toUserName, content, callback) {
            wxChatServer_1.wxChatServer.sendMessage(toUserName, content, callback);
        }
        preProcessingContactList(list) {
            return list;
        }
        processNewMessage() {
        }
    }
    exports.wxChatManager = new WxChatManager();
});
