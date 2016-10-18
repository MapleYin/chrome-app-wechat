define(["require", "exports", './wxInterface', '../manager/contactManager'], function (require, exports, wxInterface_1, contactManager_1) {
    "use strict";
    let SpicalAccounts = ["weibo", "qqmail", "fmessage", "tmessage", "qmessage", "qqsync", "floatbottle", "lbsapp", "shakeapp", "medianote", "qqfriend", "readerapp", "blogapp", "facebookapp", "masssendapp", "meishiapp", "feedsapp", "voip", "blogappweixin", "weixin", "brandsessionholder", "weixinreminder", "wxid_novlwrv3lqwv11", "gh_22b87fa7cb3c", "officialaccounts", "notification_messages"];
    let ShieldAccounts = ["newsapp", "wxid_novlwrv3lqwv11", "gh_22b87fa7cb3c", "notification_messages"];
    class UserModel {
        constructor(userInfo, isSelf) {
            this.MMFromBatchget = false;
            this.MMBatchgetMember = false;
            this.isSelf = false;
            this.class = this.constructor;
            this.updateUserInfo(userInfo, isSelf);
        }
        set contactFlag(contactFlag) {
            this._contactFlag = contactFlag;
            this.isContact = !!(contactFlag & wxInterface_1.ContactFlag.CONTACT);
            this.isBlackContact = !!(contactFlag & wxInterface_1.ContactFlag.BLACKLISTCONTACT);
            this.isMuted = this.isRoomContact ?
                this.Statues === wxInterface_1.ChatRoomNotify.CLOSE :
                !!(contactFlag & wxInterface_1.ContactFlag.NOTIFYCLOSECONTACT);
            this.isTop = !!(contactFlag & wxInterface_1.ContactFlag.TOPCONTACT);
        }
        updateUserInfo(userInfo, isSelf) {
            // property
            this.UserName = userInfo.UserName;
            this.NickName = userInfo.NickName;
            this.Sex = userInfo.Sex;
            this.RemarkName = userInfo.RemarkName;
            this.HeadImgUrl = userInfo.HeadImgUrl;
            this.Signature = userInfo.Signature;
            this.City = userInfo.City;
            this.Province = userInfo.Province;
            this.EncryChatRoomId = userInfo.EncryChatRoomId;
            this.MemberList = userInfo.MemberList;
            this.MemberCount = userInfo.MemberCount;
            // status
            this.isRoomContact = UserModel.isRoomContact(userInfo.UserName);
            this.Statues = userInfo.Statues;
            this.contactFlag = userInfo.ContactFlag;
            this.hasPhotoAlbum = !!(1 & userInfo.SnsFlag);
            this.isShieldUser = this.class.isShieldUser(this.UserName);
            this.isBrandContact = !!(userInfo.VerifyFlag & wxInterface_1.UserAttrVerifyFlag.BIZ_BRAND);
            if (isSelf != undefined) {
                this.isSelf = isSelf;
            }
            else if (contactManager_1.contactManager.account) {
                this.isSelf = userInfo.UserName == contactManager_1.contactManager.account.UserName;
            }
        }
        getDisplayName() {
            let self = this;
            var name = "";
            if (this.isRoomContact) {
                name = this.RemarkName || this.NickName;
                if (!name && !this.MemberCount) {
                    this.MemberList.slice(0, 10).forEach(membr => {
                        let contactUser = contactManager_1.contactManager.getContact(membr.UserName);
                        if (contactUser) {
                            name += contactUser.RemarkName || contactUser.NickName;
                        }
                        else {
                            name += membr.NickName;
                        }
                    });
                }
                else if (!name) {
                    name = this.UserName;
                }
            }
            else {
                name = this.RemarkName || this.NickName;
            }
            return name;
        }
        static getDisplayName(username) {
            return;
        }
        static isSpUser(username) {
            return /@qqim$/.test(username) || SpicalAccounts.indexOf(username) != -1;
        }
        static isShieldUser(username) {
            return /@lbsroom$/.test(username) || /@talkroom$/.test(username) || ShieldAccounts.indexOf(username) != -1;
        }
        static isRoomContact(username) {
            return username ? /^@@|@chatroom$/.test(username) : false;
        }
    }
    exports.UserModel = UserModel;
});
