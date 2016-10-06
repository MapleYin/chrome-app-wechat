define(["require", "exports", './tools/wxLogin', './tools/wxChatManager', './controller/chatList', './controller/chatContent'], function (require, exports, wxLogin_1, wxChatManager_1, chatList_1, chatContent_1) {
    "use strict";
    class App {
        constructor(redirectUrl) {
            this.wxLogin = new wxLogin_1.WxLogin();
            this.chatList = new chatList_1.ChatList();
            this.chatContent = new chatContent_1.ChatContent();
            let self = this;
            this.wxLogin.init(redirectUrl).then(function (value) {
                self.wxChatManager = new wxChatManager_1.WxChatManager(value.data);
                self.init();
            });
        }
        init() {
            let self = this;
            self.wxChatManager.on('AddChatUsers', function () {
                console.log('AddChatUsers');
                self.chatList.setChatListData(this.chatList, this.chatListInfo);
                self.chatContent.setChatListData(this.chatListInfo, this.currentUser);
            });
            self.wxChatManager.on('newMessage', function (messages) {
                let userMessages = messages.filter(function (value) {
                    return value.MsgType == 1 || value.MsgType == 3;
                });
                self.chatContent.newMessage(userMessages);
            });
            self.chatList.on('SelectUser', function (userName) {
                self.chatContent.selectUser(userName, self.wxChatManager.chatListInfo[userName]);
            });
            self.wxChatManager.init();
        }
    }
    exports.App = App;
});
