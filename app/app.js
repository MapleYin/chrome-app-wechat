define(["require", "exports", './tools/wxLogin', './tools/wxChatManager', './controller/chatList', './controller/chatContent'], function (require, exports, wxLogin_1, wxChatManager_1, chatList_1, chatContent_1) {
    "use strict";
    class App {
        constructor(redirectUrl) {
            this.wxLogin = new wxLogin_1.WxLogin();
            this.chatList = new chatList_1.ChatList();
            this.chatContent = new chatContent_1.ChatContent();
            let self = this;
            this.wxLogin.init(redirectUrl).then(function (value) {
                self.init();
                wxChatManager_1.wxChatManager.init(value.data);
            });
        }
        init() {
            let self = this;
            wxChatManager_1.wxChatManager.on('AddChatUsers', function () {
                console.log('AddChatUsers');
                self.chatList.updateChatList();
            });
            wxChatManager_1.wxChatManager.on('newMessage', function (messages) {
                let userMessages = messages.filter(function (value) {
                    return value.MsgType == 1 || value.MsgType == 3;
                });
                self.chatContent.newMessage(userMessages);
                self.chatList.newMessage(userMessages);
            });
            self.chatList.on('SelectUser', function (userName) {
                self.chatContent.selectUser(userName);
            });
        }
    }
    exports.App = App;
});
