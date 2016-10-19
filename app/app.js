System.register(['./servers/loginServer', './manager/contactManager', './manager/chatManager', './manager/messageManager'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var loginServer_1, contactManager_1, chatManager_1, messageManager_1;
    var App;
    return {
        setters:[
            function (loginServer_1_1) {
                loginServer_1 = loginServer_1_1;
            },
            function (contactManager_1_1) {
                contactManager_1 = contactManager_1_1;
            },
            function (chatManager_1_1) {
                chatManager_1 = chatManager_1_1;
            },
            function (messageManager_1_1) {
                messageManager_1 = messageManager_1_1;
            }],
        execute: function() {
            App = class App {
                constructor(redirectUrl) {
                    let self = this;
                    loginServer_1.loginServer.getBaseInfo(redirectUrl).then((result) => {
                        // 保存 SyncKey
                        messageManager_1.messageManager.setSyncKey(result.SyncKey);
                        // 添加联系人信息
                        contactManager_1.contactManager.setAccount(result.User);
                        contactManager_1.contactManager.addContacts(result.ContactList);
                        // 聊天列表初始化
                        chatManager_1.chatManager.initChatList(result.ChatSet);
                        // 初始化完成状态
                        messageManager_1.messageManager.initDoneStatusNotify();
                        // 开始信息同步检测
                        console.log('Start Message Check');
                        messageManager_1.messageManager.startMessageCheck();
                        // 获取全部联系人列表
                        contactManager_1.contactManager.initContact(0);
                    }).catch(reason => {
                        console.log(reason);
                    });
                }
            };
            exports_1("App", App);
        }
    }
});
