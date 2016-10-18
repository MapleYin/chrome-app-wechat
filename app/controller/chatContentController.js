define(["require", "exports", '../template/chatContentItem', './baseController', '../manager/contactManager', '../manager/messageManager'], function (require, exports, chatContentItem_1, baseController_1, contactManager_1, messageManager_1) {
    "use strict";
    class ChatContentController extends baseController_1.BaseController {
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
            messageManager_1.messageManager.on('userMessage', (message) => {
                self.newMessage(message);
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
            let currentUserMessage = [];
            console.log('Here Comes User Message');
            if (!(message.MMPeerUserName in self.messageList)) {
                self.messageList[message.MMPeerUserName] = [];
            }
            self.messageList[message.MMPeerUserName].push(message);
            this.updateMessageContent([message]);
        }
        sendMessage(content) {
            let message = messageManager_1.messageManager.sendTextMessage(this.currentChatUser, content);
            if (!(this.currentChatUser in this.messageList)) {
                this.messageList[this.currentChatUser] = [];
            }
            this.messageList[this.currentChatUser].push(message);
            this.updateMessageContent([message]);
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
    }
    exports.ChatContentController = ChatContentController;
});
