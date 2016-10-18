define(["require", "exports", '../manager/chatManager', '../template/chatListItem', './baseController'], function (require, exports, chatManager_1, chatListItem_1, baseController_1) {
    "use strict";
    class ChatListController extends baseController_1.BaseController {
        constructor() {
            super();
            this.$chatListContainer = $('#chat-list-container');
            this.userListItems = [];
            this.userListItemsInfo = {};
            this.bindEvent();
        }
        updateChatList() {
            let self = this;
            this.$chatListContainer.empty();
            this.userListItems = [];
            console.time('updateChatListElement');
            chatManager_1.chatManager.chatListInfo.forEach(function (user, index) {
                let item = new chatListItem_1.ChatListItem(user);
                self.userListItems.push(item);
                self.userListItemsInfo[user.UserName] = item;
                self.$chatListContainer.append(item.$element);
            });
            console.timeEnd('updateChatListElement');
        }
        newMessage(messages) {
            let self = this;
            messages.forEach(function (value) {
                if (value.FromUserName in self.userListItemsInfo) {
                    let item = self.userListItemsInfo[value.FromUserName];
                    item.lastMessage = value.Content;
                    item.lastDate = new Date(value.CreateTime * 1000);
                    let index = self.userListItems.indexOf(item);
                    self.userListItems.splice(index, 1);
                    self.userListItems.unshift(item);
                }
            });
            self.$chatListContainer.empty();
            self.userListItems.forEach(function (value) {
                self.$chatListContainer.append(value.$element);
            });
        }
        selectedItem(index) {
            if (typeof this.activeUserIndex == 'number' && index == this.activeUserIndex) {
                return;
            }
            let item = this.userListItems[index];
            item.active = true;
            let preItem = this.userListItems[this.activeUserIndex];
            if (preItem) {
                preItem.active = false;
            }
            this.activeUserIndex = index;
            this.dispatchEvent('SelectUser', item.id);
        }
        bindEvent() {
            let self = this;
            this.$chatListContainer.on('click', '.item', function (event) {
                let index = $(this).index();
                self.selectedItem(index);
            });
        }
    }
    exports.ChatListController = ChatListController;
});
