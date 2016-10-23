define(["require", "exports", '../models/wxInterface', '../template/chatContentItem', './baseController', '../manager/messageManager', '../manager/contactManager', '../servers/sourceServer', '../utility/notificationCenter'], function (require, exports, wxInterface_1, chatContentItem_1, baseController_1, messageManager_1, contactManager_1, sourceServer_1, notificationCenter_1) {
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
            this.$chatContentContainer.on('click', '.item', (event) => {
                let msgId = $(event.currentTarget).data('id');
                let message = messageManager_1.messageManager.getMessage(msgId);
                this.onMessageClick(message);
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
        onMessageClick(message) {
            switch (message.MsgType) {
                case wxInterface_1.MessageType.APP:
                    switch (message.AppMsgType) {
                        case wxInterface_1.AppMsgType.URL:
                            window.open(message.Url);
                            break;
                        default:
                            // code...
                            break;
                    }
                    break;
                case wxInterface_1.MessageType.MICROVIDEO:
                    this.playVideoMessage(message);
                    break;
                case wxInterface_1.MessageType.VOICE:
                    this.playVoiceMessage(message);
                    break;
                default:
                    // code...
                    break;
            }
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
                if (sender) {
                    let item = new chatContentItem_1.ChatContentItem(message, sender);
                    self.$chatContentContainer.append(item.$element);
                }
                else {
                    console.error(`Miss Sender:${message.MMActualSender}`);
                }
            });
            self.$chatContentContainer.scrollTop(999999);
        }
        playVoiceMessage(message) {
            let audio = document.createElement('audio');
            sourceServer_1.sourceServer.fetchSource(message.Url).then(localUrl => {
                audio.src = localUrl;
                audio.autoplay = true;
            });
        }
        playVideoMessage(message) {
        }
    }
    exports.chatContentController = new ChatContentController();
});
