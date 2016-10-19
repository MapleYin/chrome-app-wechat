System.register(['../template/chatListItem', './baseController', '../utility/notificationCenter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var chatListItem_1, baseController_1, notificationCenter_1;
    var ChatListController, chatListController;
    return {
        setters:[
            function (chatListItem_1_1) {
                chatListItem_1 = chatListItem_1_1;
            },
            function (baseController_1_1) {
                baseController_1 = baseController_1_1;
            },
            function (notificationCenter_1_1) {
                notificationCenter_1 = notificationCenter_1_1;
            }],
        execute: function() {
            ChatListController = class ChatListController extends baseController_1.BaseController {
                constructor() {
                    super();
                    this.$chatListContainer = $('#chat-list-container');
                    this.userListItems = [];
                    this.userListItemsInfo = {};
                    this.bindEvent();
                }
                updateChatList(chatListInfo) {
                    let self = this;
                    this.$chatListContainer.empty();
                    this.userListItems = [];
                    console.time('updateChatListElement');
                    chatListInfo.forEach(function (user, index) {
                        let item = new chatListItem_1.ChatListItem(user);
                        self.userListItems.push(item);
                        self.userListItemsInfo[user.UserName] = item;
                        self.$chatListContainer.append(item.$element);
                    });
                    console.timeEnd('updateChatListElement');
                }
                newMessage(message, userInfo) {
                    let self = this;
                    if (message.MMPeerUserName in self.userListItemsInfo) {
                        let item = self.userListItemsInfo[message.MMPeerUserName];
                        item.lastMessage = message.MMDigest;
                        item.lastDate = new Date(message.CreateTime * 1000);
                        let index = self.userListItems.indexOf(item);
                        self.userListItems.splice(index, 1);
                        self.userListItems.unshift(item);
                    }
                    else {
                        let item = new chatListItem_1.ChatListItem(userInfo);
                        item.lastMessage = message.MMDigest;
                        item.lastDate = new Date(message.CreateTime * 1000);
                        self.userListItemsInfo[message.MMPeerUserName] = item;
                        self.userListItems.push(item);
                    }
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
                    notificationCenter_1.NotificationCenter.post('chatList.select.user', item.id);
                }
                bindEvent() {
                    let self = this;
                    this.$chatListContainer.on('click', '.item', function (event) {
                        let index = $(this).index();
                        self.selectedItem(index);
                    });
                }
            };
            exports_1("chatListController", chatListController = new ChatListController());
        }
    }
});
