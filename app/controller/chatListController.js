define(["require", "exports", '../template/chatListItem', './baseController', '../utility/notificationCenter'], function (require, exports, chatListItem_1, baseController_1, notificationCenter_1) {
    "use strict";
    class ChatListController extends baseController_1.BaseController {
        constructor() {
            super();
            this.$chatListContainer = $('#chat-list-container');
            this.userListItemsInfo = {};
            this.bindEvent();
        }
        updateChatList(chatListInfo, changeList) {
            let self = this;
            console.time('updateChatListElement');
            if (changeList && changeList.length > 0) {
                changeList.forEach(user => {
                    let item = self.getItemByUser(user);
                    let index = chatListInfo.indexOf(user);
                    if (index > -1) {
                        self.insertItemIntoIndex(item, index);
                    }
                });
            }
            else {
                chatListInfo.forEach(function (user, index) {
                    let item = self.getItemByUser(user);
                    if (index != item.$element.index()) {
                        self.insertItemIntoIndex(item, index);
                    }
                });
            }
            console.timeEnd('updateChatListElement');
        }
        newMessage(message, userInfo) {
            let self = this;
            if (message.MMPeerUserName in self.userListItemsInfo) {
                let item = self.userListItemsInfo[message.MMPeerUserName];
                item.lastMessage = message.MMDigest;
                item.lastDate = new Date(message.CreateTime * 1000);
            }
            else {
                let item = new chatListItem_1.ChatListItem(userInfo);
                item.lastMessage = message.MMDigest;
                item.lastDate = new Date(message.CreateTime * 1000);
                self.userListItemsInfo[message.MMPeerUserName] = item;
            }
            // self.userListItems.forEach(function(value){
            // 	self.$chatListContainer.append(value.$element);
            // });
        }
        selectedItem(username) {
            if (this.activeUser && this.activeUser == username) {
                return;
            }
            let item = this.userListItemsInfo[username];
            item.active = true;
            let preItem = this.userListItemsInfo[this.activeUser];
            if (preItem) {
                preItem.active = false;
            }
            this.activeUser = username;
            notificationCenter_1.NotificationCenter.post('chatList.select.user', item.id);
        }
        getItemByUser(user) {
            var item;
            if (user.UserName in this.userListItemsInfo) {
                item = this.userListItemsInfo[user.UserName];
                item.update(user);
            }
            else {
                item = new chatListItem_1.ChatListItem(user);
                this.userListItemsInfo[user.UserName] = item;
                item.$element.appendTo(this.$chatListContainer);
            }
            return item;
        }
        insertItemIntoIndex(item, index) {
            let preItem = this.$chatListContainer.children().eq(index);
            if (preItem) {
                item.$element.insertBefore(preItem);
            }
            else {
                item.$element.appendTo(this.$chatListContainer);
            }
        }
        bindEvent() {
            let self = this;
            this.$chatListContainer.on('click', '.item', function (event) {
                self.selectedItem($(this).data('id'));
            });
        }
    }
    exports.chatListController = new ChatListController();
});
