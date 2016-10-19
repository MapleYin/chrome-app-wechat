System.register(['../template/chatContentItem', './baseController', '../manager/contactManager', '../utility/notificationCenter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var chatContentItem_1, baseController_1, contactManager_1, notificationCenter_1;
    var ChatContentController, chatContentController;
    return {
        setters:[
            function (chatContentItem_1_1) {
                chatContentItem_1 = chatContentItem_1_1;
            },
            function (baseController_1_1) {
                baseController_1 = baseController_1_1;
            },
            function (contactManager_1_1) {
                contactManager_1 = contactManager_1_1;
            },
            function (notificationCenter_1_1) {
                notificationCenter_1 = notificationCenter_1_1;
            }],
        execute: function() {
            ChatContentController = class ChatContentController extends baseController_1.BaseController {
                constructor() {
                    super();
                    this.$chatContentHeader = $('#chat-content-header');
                    this.$chatContentContainer = $('#chat-content-container');
                    this.$inputTextarea = $('#message-input');
                    this.messageList = {};
                    let self = this;
                    this.$inputTextarea.on('keydown', function (e) {
                        let message = $(this).val();
                        if (e.keyCode == 13 && !e.metaKey && message.length > 0) {
                            $(this).val('');
                            self.sendMessage(message);
                            e.preventDefault();
                        }
                        else if (e.keyCode == 13) {
                            $(this).val(function (index, value) {
                                return value + '\n';
                            });
                        }
                    });
                }
                selectUser(username) {
                    let selectUserInfo = contactManager_1.contactManager.getContact(username);
                    if (selectUserInfo) {
                        this.$chatContentHeader.find('.username').text(selectUserInfo.getDisplayName());
                        this.currentChatUser = username;
                        this.displayMessageContent(username);
                        this.$inputTextarea.focus();
                    }
                }
                newMessage(message) {
                    let self = this;
                    console.log('Here Comes User Message');
                    if (!(message.MMPeerUserName in self.messageList)) {
                        self.messageList[message.MMPeerUserName] = [];
                    }
                    self.messageList[message.MMPeerUserName].push(message);
                    if (message.MMPeerUserName == self.currentChatUser) {
                        this.updateMessageContent([message]);
                    }
                }
                sendMessage(content) {
                    notificationCenter_1.NotificationCenter.post('message.send.text', content);
                }
                displayMessageContent(userName) {
                    let self = this;
                    let messages = this.messageList[userName];
                    self.$chatContentContainer.empty();
                    this.updateMessageContent(messages);
                }
                updateMessageContent(messages) {
                    let self = this;
                    if (!messages) {
                        return;
                    }
                    messages.forEach(message => {
                        let sender = contactManager_1.contactManager.getContact(message.MMActualSender);
                        let item = new chatContentItem_1.ChatContentItem(message.MMActualContent, sender);
                        self.$chatContentContainer.append(item.$element);
                    });
                    self.$chatContentContainer.scrollTop(self.$chatContentContainer.height());
                }
            };
            exports_1("chatContentController", chatContentController = new ChatContentController());
        }
    }
});
