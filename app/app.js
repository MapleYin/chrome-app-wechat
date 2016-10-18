define(["require", "exports", './servers/loginServer', './utility/notificationCenter', './manager/contactManager', './manager/chatManager', './manager/messageManager', './controller/chatListController', './controller/chatContent'], function (require, exports, loginServer_1, notificationCenter_1, contactManager_1, chatManager_1, messageManager_1, chatListController_1, chatContent_1) {
    "use strict";
    class App {
        constructor(redirectUrl) {
            this.chatListController = new chatListController_1.ChatListController();
            this.chatContent = new chatContent_1.ChatContent();
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
            self.init();
        }
        init() {
            let self = this;
            notificationCenter_1.NotificationCenter.on('chat.init.success,contact.init.success', (e) => {
                if (e.eventName == 'contact.init.success') {
                    chatManager_1.chatManager.updateChatList();
                }
                self.chatListController.updateChatList();
            });
        }
    }
    exports.App = App;
});
