define(["require", "exports"], function (require, exports) {
    "use strict";
    ;
    (function (MessageType) {
        MessageType[MessageType["MSGTYPE_TEXT"] = 1] = "MSGTYPE_TEXT";
        MessageType[MessageType["MSGTYPE_IMAGE"] = 3] = "MSGTYPE_IMAGE";
        MessageType[MessageType["MSGTYPE_VOICE"] = 34] = "MSGTYPE_VOICE";
        MessageType[MessageType["MSGTYPE_VIDEO"] = 43] = "MSGTYPE_VIDEO";
        MessageType[MessageType["MSGTYPE_MICROVIDEO"] = 62] = "MSGTYPE_MICROVIDEO";
        MessageType[MessageType["MSGTYPE_EMOTICON"] = 47] = "MSGTYPE_EMOTICON";
        MessageType[MessageType["MSGTYPE_APP"] = 49] = "MSGTYPE_APP";
        MessageType[MessageType["MSGTYPE_VOIPMSG"] = 50] = "MSGTYPE_VOIPMSG";
        MessageType[MessageType["MSGTYPE_VOIPNOTIFY"] = 52] = "MSGTYPE_VOIPNOTIFY";
        MessageType[MessageType["MSGTYPE_VOIPINVITE"] = 53] = "MSGTYPE_VOIPINVITE";
        MessageType[MessageType["MSGTYPE_LOCATION"] = 48] = "MSGTYPE_LOCATION";
        MessageType[MessageType["MSGTYPE_STATUSNOTIFY"] = 51] = "MSGTYPE_STATUSNOTIFY";
        MessageType[MessageType["MSGTYPE_SYSNOTICE"] = 9999] = "MSGTYPE_SYSNOTICE";
        MessageType[MessageType["MSGTYPE_POSSIBLEFRIEND_MSG"] = 40] = "MSGTYPE_POSSIBLEFRIEND_MSG";
        MessageType[MessageType["MSGTYPE_VERIFYMSG"] = 37] = "MSGTYPE_VERIFYMSG";
        MessageType[MessageType["MSGTYPE_SHARECARD"] = 42] = "MSGTYPE_SHARECARD";
        MessageType[MessageType["MSGTYPE_SYS"] = 10000] = "MSGTYPE_SYS";
        MessageType[MessageType["MSGTYPE_RECALLED"] = 10002] = "MSGTYPE_RECALLED"; // 撤回消息
    })(exports.MessageType || (exports.MessageType = {}));
    var MessageType = exports.MessageType;
});
