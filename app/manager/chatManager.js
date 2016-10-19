define(["require", "exports", './baseManager', './contactManager', '../models/userModel', '../utility/notificationCenter'], function (require, exports, baseManager_1, contactManager_1, userModel_1, notificationCenter_1) {
    "use strict";
    class ChatManager extends baseManager_1.BaseManager {
        constructor() {
            super(...arguments);
            this.chatList = [];
            this.chatListInfo = [];
        }
        initChatList(chatSetString) {
            let self = this;
            chatSetString.split(',').forEach(username => {
                if (username && !userModel_1.UserModel.isShieldUser(username) && !userModel_1.UserModel.isSpUser(username)) {
                    if (self.chatList.indexOf(username) == -1) {
                        self.chatList.push(username);
                        if (userModel_1.UserModel.isRoomContact(username)) {
                            contactManager_1.contactManager.addBatchgetChatroomContact(username);
                        }
                    }
                }
            });
            this.updateChatList();
            notificationCenter_1.NotificationCenter.post('chat.init.success');
        }
        addChatList(usernames) {
            let self = this;
            usernames.forEach(username => {
                let index = self.chatList.indexOf(username);
                if (index == -1) {
                    if (userModel_1.UserModel.isRoomContact(username)) {
                        contactManager_1.contactManager.addBatchgetChatroomContact(username);
                    }
                }
                else {
                    self.chatList.splice(index, 1);
                }
                self.chatList.unshift(username);
            });
            this.updateChatList();
            notificationCenter_1.NotificationCenter.post('chat.add.success');
        }
        updateChatList() {
            let self = this;
            let topList = [];
            let normalList = [];
            this.chatList.forEach(username => {
                let user = contactManager_1.contactManager.getContact(username);
                if (user && !user.isBrandContact && !user.isShieldUser) {
                    user.isTop ? topList.push(user) : normalList.push(user);
                }
            });
            console.log(`chatList count : ${this.chatList.length}`);
            [].unshift.apply(normalList, topList);
            this.chatListInfo = normalList;
            console.log(`normalList count : ${normalList.length}`);
        }
        addChatMessage(message) {
        }
    }
    exports.chatManager = new ChatManager();
});
