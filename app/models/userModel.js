define(["require", "exports"], function (require, exports) {
    "use strict";
    let SpicalAccounts = ["weibo", "qqmail", "fmessage", "tmessage", "qmessage", "qqsync", "floatbottle", "lbsapp", "shakeapp", "medianote", "qqfriend", "readerapp", "blogapp", "facebookapp", "masssendapp", "meishiapp", "feedsapp", "voip", "blogappweixin", "weixin", "brandsessionholder", "weixinreminder", "wxid_novlwrv3lqwv11", "gh_22b87fa7cb3c", "officialaccounts", "notification_messages"];
    let ShieldAccounts = ["newsapp", "wxid_novlwrv3lqwv11", "gh_22b87fa7cb3c", "notification_messages"];
    var CONTACTFLAG;
    (function (CONTACTFLAG) {
        CONTACTFLAG[CONTACTFLAG["CONTACT"] = 1] = "CONTACT";
        CONTACTFLAG[CONTACTFLAG["CHATCONTACT"] = 2] = "CHATCONTACT";
        CONTACTFLAG[CONTACTFLAG["CHATROOMCONTACT"] = 4] = "CHATROOMCONTACT";
        CONTACTFLAG[CONTACTFLAG["BLACKLISTCONTACT"] = 8] = "BLACKLISTCONTACT";
        CONTACTFLAG[CONTACTFLAG["DOMAINCONTACT"] = 16] = "DOMAINCONTACT";
        CONTACTFLAG[CONTACTFLAG["HIDECONTACT"] = 32] = "HIDECONTACT";
        CONTACTFLAG[CONTACTFLAG["FAVOURCONTACT"] = 64] = "FAVOURCONTACT";
        CONTACTFLAG[CONTACTFLAG["RDAPPCONTACT"] = 128] = "RDAPPCONTACT";
        CONTACTFLAG[CONTACTFLAG["SNSBLACKLISTCONTACT"] = 256] = "SNSBLACKLISTCONTACT";
        CONTACTFLAG[CONTACTFLAG["NOTIFYCLOSECONTACT"] = 512] = "NOTIFYCLOSECONTACT";
        CONTACTFLAG[CONTACTFLAG["TOPCONTACT"] = 2048] = "TOPCONTACT";
    })(CONTACTFLAG || (CONTACTFLAG = {}));
    var CHATROOM_NOTIFY;
    (function (CHATROOM_NOTIFY) {
        CHATROOM_NOTIFY[CHATROOM_NOTIFY["CLOSE"] = 0] = "CLOSE";
        CHATROOM_NOTIFY[CHATROOM_NOTIFY["OPEN"] = 1] = "OPEN";
    })(CHATROOM_NOTIFY || (CHATROOM_NOTIFY = {}));
    class UserModel {
        constructor(userInfo) {
            this.updateUserInfo(userInfo);
        }
        updateUserInfo(userInfo) {
            let contactFlag = userInfo.ContactFlag;
            this.isContact = !!(contactFlag & CONTACTFLAG.CONTACT);
            this.isBlackContact = !!(contactFlag & CONTACTFLAG.BLACKLISTCONTACT);
            this.isRoomContact = UserModel.isRoomContact(userInfo.UserName);
            this.isMuted = this.isRoomContact ?
                userInfo.Statues === CHATROOM_NOTIFY.CLOSE :
                !!(contactFlag & CONTACTFLAG.NOTIFYCLOSECONTACT);
            this.isTop = !!(contactFlag & CONTACTFLAG.TOPCONTACT);
            this.hasPhotoAlbum = !!(1 & userInfo.SnsFlag);
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
