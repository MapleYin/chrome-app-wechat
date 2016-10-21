define(["require", "exports", './baseManager', './emoticonManager', '../servers/contactServer', '../models/wxInterface', '../models/userModel', '../utility/contactListHelper', '../utility/notificationCenter'], function (require, exports, baseManager_1, emoticonManager_1, contactServer_1, wxInterface_1, userModel_1, contactListHelper_1, notificationCenter_1) {
    "use strict";
    // BatchgetContact 函数截流
    let delayAddBatchgetContact = (function (delay) {
        var timer;
        var processFn;
        return function (fn) {
            if (!processFn) {
                processFn = fn;
            }
            else {
                clearTimeout(timer);
                timer = setTimeout(processFn, delay);
            }
        };
    })(200);
    class ContactManager extends baseManager_1.BaseManager {
        constructor() {
            super();
            this.contacts = {};
            this.strangerContacts = {};
            // chatRoomMemberDisplayNames = {};
            this.getContactToGetList = [];
            let self = this;
        }
        setAccount(userInfo) {
            this.account = new userModel_1.UserModel(userInfo, true);
            this.addContact(userInfo);
        }
        getContact(username, chatRoomId, isSingleUser) {
            let self = this;
            var user = this.contacts[username] || this.strangerContacts[username];
            if (isSingleUser) {
                return user;
            }
            else {
                if (user && userModel_1.UserModel.isRoomContact(username) && user.MemberCount == 0) {
                    self.addBatchgetContact({
                        UserName: username,
                        EncryChatRoomId: chatRoomId || ''
                    });
                }
            }
            return user;
        }
        addContacts(usersInfos, isFromBatchGet) {
            let self = this;
            usersInfos.forEach(function (userInfo) {
                self.addContact(userInfo, isFromBatchGet);
            });
        }
        addContact(userInfo, isFromBatchGet) {
            if (userInfo) {
                let user = new userModel_1.UserModel(userInfo);
                if (user.EncryChatRoomId && user.UserName || isFromBatchGet) {
                    user.MMFromBatchget = true;
                }
                if (user.RemarkName) {
                    user.RemarkName = emoticonManager_1.emoticonManager.transformSpanToImg(user.RemarkName);
                }
                if (user.NickName) {
                    user.NickName = emoticonManager_1.emoticonManager.transformSpanToImg(user.NickName);
                }
                if (user.isShieldUser || !user.isContact && !user.isRoomContact) {
                    this.addStrangerContact(user);
                }
                else {
                    this.addFriendContact(user);
                }
            }
        }
        addBatchgetChatroomContact(username) {
            if (userModel_1.UserModel.isRoomContact(username)) {
                let user = this.getContact(username);
                if (!user || !user.MMFromBatchget) {
                    this.addBatchgetContact({
                        UserName: username
                    });
                }
            }
        }
        addBatchgetChatroomMembersContact(username) {
            let self = this;
            let user = this.getContact(username);
            if (user && user.isRoomContact && !user.MMBatchgetMember && user.MemberCount > 0) {
                console.log(`Get Room Members Info`);
                user.MMBatchgetMember = true;
                user.MemberList.forEach(member => {
                    let memberUser = self.getContact(member.UserName);
                    if (memberUser && !memberUser.isContact && !memberUser.MMFromBatchget) {
                        self.addBatchgetContact({
                            UserName: memberUser.UserName,
                            EncryChatRoomId: user.UserName
                        });
                    }
                });
            }
        }
        addBatchgetContact(contactInfo, toTop) {
            let self = this;
            if (contactInfo && contactInfo.UserName) {
                if (contactListHelper_1.ContactInListIndex(this.getContactToGetList, contactInfo) > -1) {
                    return;
                }
                if (userModel_1.UserModel.isRoomContact(contactInfo.UserName) || toTop) {
                    this.getContactToGetList.unshift(contactInfo);
                }
                else {
                    this.getContactToGetList.push(contactInfo);
                }
                // 需要做一个函数截流～
                delayAddBatchgetContact(function () {
                    contactServer_1.contactServer.batchGetContact(self.getContactToGetList).then(result => {
                        return self.batchGetContactSuccess(result);
                    }).catch(reason => {
                        return self.batchGetContactError(reason);
                    });
                });
            }
        }
        getUserHeadImage(url) {
            if (url && url.search(/chrome-extension/) == -1) {
                url = contactServer_1.contactServer.host + url;
                return contactServer_1.contactServer.getImage(url);
            }
            else {
                return new Promise((resolve, reject) => { reject(); });
            }
        }
        initContact(seq) {
            let self = this;
            // var count = 1;
            contactServer_1.contactServer.getAllContacts(seq).then(result => {
                self.addContacts(result.MemberList);
                if (result.Seq && result.Seq != 0) {
                    // count++;
                    self.initContact(result.Seq);
                    notificationCenter_1.NotificationCenter.post('contact.init.fetching');
                }
                else {
                    notificationCenter_1.NotificationCenter.post('contact.init.success');
                }
            }).catch(reason => {
                console.error(`[ContactManager] error:${reason}`);
                console.log(`Retry at 5 seconds`);
                setTimeout(() => {
                    self.initContact(0);
                });
            });
        }
        batchGetContactSuccess(contacts) {
            let self = this;
            contacts.forEach(user => {
                let index = contactListHelper_1.ContactInListIndex(this.getContactToGetList, user);
                if (index > -1) {
                    this.getContactToGetList.splice(index, 1);
                }
                if (userModel_1.UserModel.isRoomContact(user.UserName) && user.MemberList) {
                    user.MemberList.forEach(memberInfo => {
                        let member = self.getContact(memberInfo.UserName, "", true);
                        if (member) {
                            let memberIndex = contactListHelper_1.ContactInListIndex(self.getContactToGetList, member);
                            if (memberIndex > -1) {
                                self.getContactToGetList.splice(memberIndex, 1);
                            }
                        }
                    });
                }
            });
            self.addContacts(contacts, true);
            if (self.getContactToGetList.length > 0) {
                contactServer_1.contactServer.batchGetContact(self.getContactToGetList).then(result => {
                    return self.batchGetContactSuccess(result);
                }).catch(reason => {
                    return self.batchGetContactError(reason);
                });
            }
            return contacts;
        }
        batchGetContactError(error) {
            let self = this;
            if (self.getContactToGetList.length) {
                contactServer_1.contactServer.batchGetContact(self.getContactToGetList).then(result => {
                    return self.batchGetContactSuccess(result);
                }).catch(reason => {
                    return self.batchGetContactError(reason);
                });
            }
            return error;
        }
        specialContactHandler(user) {
            let specialContacts = {
                weixin: wxInterface_1.TextInfoMap["6c2fc35"],
                filehelper: wxInterface_1.TextInfoMap["eb7ec65"],
                newsapp: wxInterface_1.TextInfoMap["0469c27"],
                fmessage: wxInterface_1.TextInfoMap["a82c4c4"]
            };
            if (specialContacts[user.UserName]) {
                user.NickName = specialContacts[user.UserName];
            }
            if (user.UserName == 'fmessage') {
                user.contactFlag = 0;
            }
        }
        addFriendContact(user) {
            this.specialContactHandler(user);
            this.contacts[user.UserName] = user;
        }
        addStrangerContact(user) {
            this.strangerContacts[user.UserName] = user;
        }
    }
    exports.contactManager = new ContactManager();
});
