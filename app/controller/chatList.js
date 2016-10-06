define(["require", "exports", '../template/chatListItem', '../tools/eventable'], function (require, exports, chatListItem_1, eventable_1) {
    "use strict";
    class ChatList extends eventable_1.Eventable {
        constructor() {
            super();
            this.$chatListContainer = $('#chat-list-container');
            this.userListItems = [];
            this.bindEvent();
        }
        setChatListData(chatList, chatListInfo) {
            let self = this;
            let list;
            this.$chatListContainer.empty();
            this.userListItems = [];
            this.chatListInfo = chatListInfo;
            chatList.forEach(function (value) {
                let data = chatListInfo[value];
                if ((data.VerifyFlag == 0 && data.UserName.slice(0, 1) == '@')
                    || data.UserName == 'filehelper') {
                    let item = new chatListItem_1.ChatListItem(data);
                    self.userListItems.push(item);
                    self.$chatListContainer.append(item.$element);
                }
            });
        }
        newMessage(message) {
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
    exports.ChatList = ChatList;
});
