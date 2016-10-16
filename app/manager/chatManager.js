define(["require", "exports", '../servers/chatServer', '../baseClass/eventable', '../tools/chromeTools', '../models/userModel'], function (require, exports, chatServer_1, eventable_1, chromeTools_1, userModel_1) {
    "use strict";
    class ChatManager extends eventable_1.Eventable {
        constructor() {
            super();
            this.chatList = [];
            this.chatListInfo = {};
            let self = this;
            chatServer_1.chatServer.on('InitDone', function () {
                self.currentUser = this.currentUser;
                if (self.currentUser.HeadImgUrl.search(/chrome-extension/) == -1) {
                    chromeTools_1.fetchRemoteImage('https://wx.qq.com' + self.currentUser.HeadImgUrl, function (localUrl) {
                        self.currentUser.HeadImgUrl = localUrl;
                    });
                }
            });
            chatServer_1.chatServer.on('AddChatUsers', function (list) {
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
                        self.chatListInfo[value.UserName] = value;
                        if (value.HeadImgUrl.search(/chrome-extension/) == -1) {
                            chromeTools_1.fetchRemoteImage('https://wx.qq.com' + value.HeadImgUrl, function (localUrl) {
                                value.HeadImgUrl = localUrl;
                            });
                        }
                    }
                });
                self.dispatchEvent('AddChatUsers');
            });
            chatServer_1.chatServer.on('GetAllContactUsers', function (list) {
                self.allContact = list;
            });
            chatServer_1.chatServer.on('newMessage', function (list) {
                console.log('Here Come the New Messages');
                self.dispatchEvent('newMessage', list);
            });
        }
        init(loginInfo) {
            chatServer_1.chatServer.start(loginInfo);
        }
        initChatList(chatList) {
            let self = this;
            chatList.forEach(function (username) {
                if (!userModel_1.UserModel.isShieldUser(username) &&
                    !userModel_1.UserModel.isSpUser(username)) {
                    let index = self.chatList.indexOf(username);
                    if (index == -1) {
                        self.chatList.push(username);
                        if (userModel_1.UserModel.isRoomContact(username)) {
                        }
                    }
                }
            });
        }
        addChatList(userList) {
            let self = this;
            userList.forEach(function (username) {
                let index = self.chatList.indexOf(username);
                if (index == -1) {
                    self.chatList.unshift(username);
                    if (userModel_1.UserModel.isRoomContact(username)) {
                    }
                }
                else {
                    let _username = self.chatList.splice(index, 1)[0];
                    self.chatList.unshift(_username);
                }
            });
        }
        sendMessage(toUserName, content, callback) {
            chatServer_1.chatServer.sendMessage(toUserName, content, callback);
        }
        preProcessingContactList(list) {
            return list;
        }
        processNewMessage() {
        }
    }
    exports.chatManager = new ChatManager();
});
