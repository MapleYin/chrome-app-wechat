System.register(['./baseManager', './contactManager', './messageManager', '../models/userModel', '../utility/notificationCenter', '../controller/chatListController', '../controller/chatContentController'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var baseManager_1, contactManager_1, messageManager_1, userModel_1, notificationCenter_1, chatListController_1, chatContentController_1;
    var ChatManager, chatManager;
    return {
        setters:[
            function (baseManager_1_1) {
                baseManager_1 = baseManager_1_1;
            },
            function (contactManager_1_1) {
                contactManager_1 = contactManager_1_1;
            },
            function (messageManager_1_1) {
                messageManager_1 = messageManager_1_1;
            },
            function (userModel_1_1) {
                userModel_1 = userModel_1_1;
            },
            function (notificationCenter_1_1) {
                notificationCenter_1 = notificationCenter_1_1;
            },
            function (chatListController_1_1) {
                chatListController_1 = chatListController_1_1;
            },
            function (chatContentController_1_1) {
                chatContentController_1 = chatContentController_1_1;
            }],
        execute: function() {
            ChatManager = class ChatManager extends baseManager_1.BaseManager {
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
                        self.currentChatUser = event.userInfo;
                        chatContentController_1.chatContentController.selectUser(event.userInfo);
                    });
                    notificationCenter_1.NotificationCenter.on('message.receive', event => {
                        self.addChatMessage(event.userInfo);
                        //self.addChatList([event.userInfo.MMPeerUserName]);
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
                    this.updateChatList();
                }
                updateChatList() {
                    let self = this;
                    let topList = [];
                    let normalList = [];
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
                    chatListController_1.chatListController.updateChatList(normalList);
                }
                addChatMessage(message) {
                    let user = contactManager_1.contactManager.getContact(message.MMPeerUserName);
                    chatListController_1.chatListController.newMessage(message, user);
                    chatContentController_1.chatContentController.newMessage(message);
                }
                sendMessage(content) {
                    messageManager_1.messageManager.sendTextMessage(this.currentChatUser, content);
                }
            };
            exports_1("chatManager", chatManager = new ChatManager());
        }
    }
});
