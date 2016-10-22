define(["require", "exports", './baseManager', './contactManager', './messageManager', '../models/userModel', '../utility/notificationCenter', '../controller/chatListController', '../controller/chatContentController'], function (require, exports, baseManager_1, contactManager_1, messageManager_1, userModel_1, notificationCenter_1, chatListController_1, chatContentController_1) {
    "use strict";
    class ChatManager extends baseManager_1.BaseManager {
        constructor() {
            super();
            this.chatList = [];
            this.chatListInfo = [];
            this.chatListInfoMap = {};
            let self = this;
            notificationCenter_1.NotificationCenter.on('contact.init.success', () => {
                self.updateChatList();
            });
            notificationCenter_1.NotificationCenter.on('chatList.select.user', event => {
                this.onSelectUser(event.userInfo);
            });
            notificationCenter_1.NotificationCenter.on('message.receive', event => {
                self.addChatMessage(event.userInfo);
                self.addChatList([event.userInfo.MMPeerUserName]);
            });
            notificationCenter_1.NotificationCenter.on('message.send', event => {
                self.sendMessage(event.userInfo);
            });
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
            this.updateChatList(usernames);
        }
        onSelectUser(username) {
            this.currentChatUser = username;
            chatContentController_1.chatContentController.selectUser(username);
            let user = contactManager_1.contactManager.getContact(username);
            if (user && user.MMUnreadMsgCount > 0) {
                user.MMUnreadMsgCount = 0;
                messageManager_1.messageManager.statusNotifyMarkRead(user.UserName);
            }
        }
        updateChatList(usernames) {
            let self = this;
            let topList = [];
            let normalList = [];
            let changeList = [];
            if (usernames) {
                usernames.forEach(username => {
                    let user = contactManager_1.contactManager.getContact(username);
                    if (user && !user.isBrandContact && !user.isShieldUser) {
                        changeList.push(user);
                    }
                });
            }
            this.chatList.forEach(username => {
                let user = contactManager_1.contactManager.getContact(username);
                if (user && !user.isBrandContact && !user.isShieldUser) {
                    user.isTop ? topList.push(user) : normalList.push(user);
                    self.chatListInfoMap[user.UserName] = user;
                }
            });
            [].unshift.apply(normalList, topList);
            this.chatListInfo = normalList;
            // 更新列表
            chatListController_1.chatListController.updateChatList(normalList, changeList);
        }
        addChatMessage(message) {
            let user = contactManager_1.contactManager.getContact(message.MMPeerUserName);
            chatListController_1.chatListController.newMessage(message, user);
            chatContentController_1.chatContentController.newMessage(message);
        }
        sendMessage(content) {
            if (this.currentChatUser) {
                messageManager_1.messageManager.sendTextMessage(this.currentChatUser, content);
            }
            else {
                console.error(`[ChatManager sendMessage] error currentChatUser:${this.currentChatUser}`);
            }
        }
    }
    exports.chatManager = new ChatManager();
});
