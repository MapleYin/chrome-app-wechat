define(["require", "exports", '../template/chatContentItem'], function (require, exports, chatContentItem_1) {
    "use strict";
    class ChatContent {
        constructor() {
            this.$chatContentHeader = $('#chat-content-header');
            this.$chatContentContainer = $('#chat-content-container');
            this.messageList = {};
        }
        selectUser(username, currentUser) {
            let name = currentUser.RemarkName || currentUser.NickName.replace(/<.+?>.*?<\/.+?>/g, '');
            this.$chatContentHeader.find('.username').text(name);
            this.currentChatUser = currentUser.UserName;
            this.displayMessageContent(username);
        }
        setChatListData(chatListInfo, selfUser) {
            this.chatListInfo = chatListInfo;
            this.selfUser = selfUser;
        }
        newMessage(messages) {
            let self = this;
            let currentUserMessage = [];
            messages.forEach(function (value) {
                var fromUserName = value.FromUserName;
                let toUserName = value.ToUserName;
                if (fromUserName == self.selfUser.UserName) {
                    fromUserName = toUserName;
                }
                if (!(fromUserName in self.messageList)) {
                    self.messageList[fromUserName] = [];
                }
                if (fromUserName == self.currentChatUser) {
                    currentUserMessage.push(value);
                }
                self.messageList[fromUserName].push(value);
            });
            this.updateMessageContent(currentUserMessage);
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
            messages.forEach(function (value) {
                var fromUserInfo;
                var isSelf = false;
                if (value.FromUserName == self.selfUser.UserName) {
                    isSelf = true;
                    fromUserInfo = self.selfUser;
                }
                else {
                    fromUserInfo = self.chatListInfo[value.FromUserName];
                }
                let item = new chatContentItem_1.ChatContentItem(value, fromUserInfo, isSelf);
                self.$chatContentContainer.append(item.$element);
            });
        }
    }
    exports.ChatContent = ChatContent;
});
