System.register(['./baseManager', '../models/wxInterface', '../models/userModel', './contactManager', './emoticonManager', './chatManager', '../servers/messageServer', '../utility/notificationCenter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var baseManager_1, wxInterface_1, userModel_1, contactManager_1, emoticonManager_1, chatManager_1, messageServer_1, notificationCenter_1;
    var MessageManager, messageManager;
    return {
        setters:[
            function (baseManager_1_1) {
                baseManager_1 = baseManager_1_1;
            },
            function (wxInterface_1_1) {
                wxInterface_1 = wxInterface_1_1;
            },
            function (userModel_1_1) {
                userModel_1 = userModel_1_1;
            },
            function (contactManager_1_1) {
                contactManager_1 = contactManager_1_1;
            },
            function (emoticonManager_1_1) {
                emoticonManager_1 = emoticonManager_1_1;
            },
            function (chatManager_1_1) {
                chatManager_1 = chatManager_1_1;
            },
            function (messageServer_1_1) {
                messageServer_1 = messageServer_1_1;
            },
            function (notificationCenter_1_1) {
                notificationCenter_1 = notificationCenter_1_1;
            }],
        execute: function() {
            MessageManager = class MessageManager extends baseManager_1.BaseManager {
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
                    //messageServer.sendMessage(message).then().catch();
                    messageServer_1.messageServer.sendMessage(message).then(result => {
                        message.MsgId = result.MsgId;
                    }).catch(reason => {
                    });
                    return message;
                }
                messageProcess(message) {
                    let self = this;
                    let user = contactManager_1.contactManager.getContact(message.FromUserName, '', true);
                    message.MMPeerUserName = (message.FromUserName == contactManager_1.contactManager.account.UserName || message.FromUserName == '') ? message.ToUserName : message.FromUserName;
                    if (user && !user.isMuted && !user.isSelf && !user.isShieldUser && !user.isBrandContact) {
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
                        self.commonMsgProcess(message);
                        switch (message.MsgType) {
                            case wxInterface_1.MessageType.TEXT:
                                self.textMsgProcess(message);
                                break;
                            case wxInterface_1.MessageType.IMAGE:
                                break;
                            default:
                                // code...
                                break;
                        }
                        //@TODO href encode
                        // message.MMActualContent
                        let user = contactManager_1.contactManager.getContact(message.MMPeerUserName);
                        if (!message.MMIsSend && (!user || (!user.isMuted && !user.isBrandContact)) && message.MsgType != wxInterface_1.MessageType.SYS) {
                        }
                    }
                }
                commonMsgProcess(message) {
                    var actualContent = '';
                    var username = '';
                    message.Content = message.Content || '';
                    message.MMDigest = '';
                    message.MMIsSend = message.FromUserName == contactManager_1.contactManager.account.UserName || message.FromUserName == '';
                    if (userModel_1.UserModel.isRoomContact(message.MMPeerUserName)) {
                        message.MMIsChatRoom = true;
                        actualContent = message.Content.replace(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/, (str, name) => {
                            username = name;
                            return '';
                        });
                        if (username && username != contactManager_1.contactManager.account.UserName) {
                            let user = contactManager_1.contactManager.getContact(username, message.MMPeerUserName);
                            if (user) {
                                let displayName = user.getDisplayName();
                                if (displayName) {
                                    message.MMDigest = displayName + ':';
                                }
                            }
                        }
                    }
                    else {
                        message.MMIsChatRoom = false;
                        actualContent = message.Content;
                    }
                    if (!message.MMIsSend && message.MMUnread == undefined && message.MsgType != wxInterface_1.MessageType.SYS) {
                        message.MMUnread = true;
                    }
                    if (!message.LocalID) {
                        message.ClientMsgId = message.LocalID = message.MsgId;
                    }
                    // emoji
                    actualContent = emoticonManager_1.emoticonManager.emoticonFormat(actualContent);
                    message.MMActualContent = actualContent;
                    message.MMActualSender = username || message.FromUserName;
                    //@TODO
                    //对消息显示时间的标志
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
                textMsgProcess(message) {
                    message.MMDigest += message.MMActualContent.replace(/<br ?[^><]*\/?>/g, "");
                    notificationCenter_1.NotificationCenter.post('message.receive.text', message);
                }
                imageMsgProcess(message) {
                    message.MMDigest += wxInterface_1.TextInfoMap["a5627e8"];
                    notificationCenter_1.NotificationCenter.post('message.receive.image', message);
                }
                appMsgProcess(message) {
                }
            };
            exports_1("messageManager", messageManager = new MessageManager());
        }
    }
});
