define(["require", "exports", './servers/loginServer', './manager/chatManager', './controller/chatList', './controller/chatContent'], function (require, exports, loginServer_1, chatManager_1, chatList_1, chatContent_1) {
    "use strict";
    class App {
        constructor(redirectUrl) {
            this.chatList = new chatList_1.ChatList();
            this.chatContent = new chatContent_1.ChatContent();
            let self = this;
            loginServer_1.loginServer.appInit(redirectUrl).then(function (value) {
                self.init();
                chatManager_1.chatManager.init(value.data);
            });
        }
        init() {
            let self = this;
            chatManager_1.chatManager.on('AddChatUsers', function () {
                console.log('AddChatUsers');
                self.chatList.updateChatList();
            });
            chatManager_1.chatManager.on('newMessage', function (messages) {
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
