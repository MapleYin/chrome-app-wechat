define(["require", "exports", './baseManager', '../models/wxInterface', '../models/userModel', '../models/messageModel', './contactManager', './chatManager', '../servers/messageServer', '../utility/notificationCenter'], function (require, exports, baseManager_1, wxInterface_1, userModel_1, messageModel_1, contactManager_1, chatManager_1, messageServer_1, notificationCenter_1) {
    "use strict";
    class MessageManager extends baseManager_1.BaseManager {
        constructor() {
            super();
            let self = this;
            notificationCenter_1.NotificationCenter.on('sync.get.success', event => {
                if (event.userInfo.AddMsgCount) {
                    console.log(`${event.userInfo.AddMsgCount} New Message`);
                    event.userInfo.AddMsgList.forEach(message => {
                        self.messageProcess(message);
                    });
                }
            });
            notificationCenter_1.NotificationCenter.on('user.status.logout', () => {
                chrome.runtime.sendMessage({
                    command: 'OPEN_LOGIN'
                });
            });
        }
        setSyncKey(SyncKey) {
            messageServer_1.messageServer.syncKey = SyncKey;
        }
        initDoneStatusNotify() {
            messageServer_1.messageServer.setStatusNotify(contactManager_1.contactManager.account.UserName, wxInterface_1.StatusNotifyCode.INITED);
        }
        startMessageCheck() {
            messageServer_1.messageServer.syncCheck();
        }
        sendTextMessage(username, content) {
            let message = messageServer_1.messageServer.createSendingMessage(username, content, wxInterface_1.MessageType.TEXT);
            this.messageProcess(message);
            messageServer_1.messageServer.sendMessage(message).then(result => {
                message.MsgId = result.MsgId;
            }).catch(reason => {
            });
            return message;
        }
        // 
        statusNotifyMarkRead(toUserName) {
            messageServer_1.messageServer.setStatusNotify(toUserName, wxInterface_1.StatusNotifyCode.READED);
        }
        messageProcess(messageInfo) {
            let self = this;
            let user = contactManager_1.contactManager.getContact(messageInfo.FromUserName, '', true);
            let message = new messageModel_1.MessageModel(messageInfo);
            if (user && !user.isMuted && !user.isSelf && !user.isShieldUser && !user.isBrandContact) {
                user.increaseUnreadMsgNum();
            }
            if (message.MsgType == wxInterface_1.MessageType.STATUSNOTIFY) {
                self.statusNotifyProcessor(message);
                return;
            }
            if (message.MsgType == wxInterface_1.MessageType.SYSNOTICE) {
                console.log(message.Content);
                return;
            }
            if (!(userModel_1.UserModel.isShieldUser(message.FromUserName) ||
                userModel_1.UserModel.isShieldUser(message.ToUserName) ||
                message.MsgType == wxInterface_1.MessageType.VERIFYMSG &&
                    message.RecommendInfo &&
                    message.RecommendInfo.UserName == contactManager_1.contactManager.account.UserName)) {
                //@TODO href encode
                // message.MMActualContent
                let user = contactManager_1.contactManager.getContact(message.MMPeerUserName);
                if (!message.MMIsSend && (!user || (!user.isMuted && !user.isBrandContact)) && message.MsgType != wxInterface_1.MessageType.SYS) {
                }
                notificationCenter_1.NotificationCenter.post('message.receive', message);
            }
        }
        statusNotifyProcessor(message) {
            switch (message.StatusNotifyCode) {
                case wxInterface_1.StatusNotifyCode.SYNC_CONV:
                    chatManager_1.chatManager.initChatList(message.StatusNotifyUserName);
                    break;
                case wxInterface_1.StatusNotifyCode.ENTER_SESSION:
                    let username = message.FromUserName == contactManager_1.contactManager.account.UserName ? message.ToUserName : message.FromUserName;
                    chatManager_1.chatManager.addChatList([username]);
                    break;
                default:
                    // code...
                    break;
            }
        }
    }
    exports.messageManager = new MessageManager();
});
