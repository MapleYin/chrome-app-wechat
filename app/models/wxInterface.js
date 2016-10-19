System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MessageType, AppMsgType, StatusNotifyCode, ContactFlag, UserAttrVerifyFlag, ChatRoomNotify, TextInfoMap, EmojiCodeMap;
    return {
        setters:[],
        execute: function() {
            ;
            (function (MessageType) {
                MessageType[MessageType["TEXT"] = 1] = "TEXT";
                MessageType[MessageType["IMAGE"] = 3] = "IMAGE";
                MessageType[MessageType["VOICE"] = 34] = "VOICE";
                MessageType[MessageType["VIDEO"] = 43] = "VIDEO";
                MessageType[MessageType["MICROVIDEO"] = 62] = "MICROVIDEO";
                MessageType[MessageType["EMOTICON"] = 47] = "EMOTICON";
                MessageType[MessageType["APP"] = 49] = "APP";
                MessageType[MessageType["VOIPMSG"] = 50] = "VOIPMSG";
                MessageType[MessageType["VOIPNOTIFY"] = 52] = "VOIPNOTIFY";
                MessageType[MessageType["VOIPINVITE"] = 53] = "VOIPINVITE";
                MessageType[MessageType["LOCATION"] = 48] = "LOCATION";
                MessageType[MessageType["STATUSNOTIFY"] = 51] = "STATUSNOTIFY";
                MessageType[MessageType["SYSNOTICE"] = 9999] = "SYSNOTICE";
                MessageType[MessageType["POSSIBLEFRIEND_MSG"] = 40] = "POSSIBLEFRIEND_MSG";
                MessageType[MessageType["VERIFYMSG"] = 37] = "VERIFYMSG";
                MessageType[MessageType["SHARECARD"] = 42] = "SHARECARD";
                MessageType[MessageType["SYS"] = 10000] = "SYS";
                MessageType[MessageType["RECALLED"] = 10002] = "RECALLED"; // 撤回消息
            })(MessageType || (MessageType = {}));
            exports_1("MessageType", MessageType);
            (function (AppMsgType) {
                AppMsgType[AppMsgType["TEXT"] = 1] = "TEXT";
                AppMsgType[AppMsgType["IMG"] = 2] = "IMG";
                AppMsgType[AppMsgType["AUDIO"] = 3] = "AUDIO";
                AppMsgType[AppMsgType["VIDEO"] = 4] = "VIDEO";
                AppMsgType[AppMsgType["URL"] = 5] = "URL";
                AppMsgType[AppMsgType["ATTACH"] = 6] = "ATTACH";
                AppMsgType[AppMsgType["OPEN"] = 7] = "OPEN";
                AppMsgType[AppMsgType["EMOJI"] = 8] = "EMOJI";
                AppMsgType[AppMsgType["VOICE_REMIND"] = 9] = "VOICE_REMIND";
                AppMsgType[AppMsgType["SCAN_GOOD"] = 10] = "SCAN_GOOD";
                AppMsgType[AppMsgType["GOOD"] = 13] = "GOOD";
                AppMsgType[AppMsgType["EMOTION"] = 15] = "EMOTION";
                AppMsgType[AppMsgType["CARD_TICKET"] = 16] = "CARD_TICKET";
                AppMsgType[AppMsgType["REALTIME_SHARE_LOCATION"] = 17] = "REALTIME_SHARE_LOCATION";
                AppMsgType[AppMsgType["TRANSFERS"] = 2000] = "TRANSFERS";
                AppMsgType[AppMsgType["RED_ENVELOPES"] = 2001] = "RED_ENVELOPES";
                AppMsgType[AppMsgType["READER_TYPE"] = 100001] = "READER_TYPE";
            })(AppMsgType || (AppMsgType = {}));
            exports_1("AppMsgType", AppMsgType);
            (function (StatusNotifyCode) {
                StatusNotifyCode[StatusNotifyCode["READED"] = 1] = "READED";
                StatusNotifyCode[StatusNotifyCode["ENTER_SESSION"] = 2] = "ENTER_SESSION";
                StatusNotifyCode[StatusNotifyCode["INITED"] = 3] = "INITED";
                StatusNotifyCode[StatusNotifyCode["SYNC_CONV"] = 4] = "SYNC_CONV";
                StatusNotifyCode[StatusNotifyCode["QUIT_SESSION"] = 5] = "QUIT_SESSION";
            })(StatusNotifyCode || (StatusNotifyCode = {}));
            exports_1("StatusNotifyCode", StatusNotifyCode);
            (function (ContactFlag) {
                ContactFlag[ContactFlag["CONTACT"] = 1] = "CONTACT";
                ContactFlag[ContactFlag["CHATCONTACT"] = 2] = "CHATCONTACT";
                ContactFlag[ContactFlag["CHATROOMCONTACT"] = 4] = "CHATROOMCONTACT";
                ContactFlag[ContactFlag["BLACKLISTCONTACT"] = 8] = "BLACKLISTCONTACT";
                ContactFlag[ContactFlag["DOMAINCONTACT"] = 16] = "DOMAINCONTACT";
                ContactFlag[ContactFlag["HIDECONTACT"] = 32] = "HIDECONTACT";
                ContactFlag[ContactFlag["FAVOURCONTACT"] = 64] = "FAVOURCONTACT";
                ContactFlag[ContactFlag["RDAPPCONTACT"] = 128] = "RDAPPCONTACT";
                ContactFlag[ContactFlag["SNSBLACKLISTCONTACT"] = 256] = "SNSBLACKLISTCONTACT";
                ContactFlag[ContactFlag["NOTIFYCLOSECONTACT"] = 512] = "NOTIFYCLOSECONTACT";
                ContactFlag[ContactFlag["TOPCONTACT"] = 2048] = "TOPCONTACT";
            })(ContactFlag || (ContactFlag = {}));
            exports_1("ContactFlag", ContactFlag);
            (function (UserAttrVerifyFlag) {
                UserAttrVerifyFlag[UserAttrVerifyFlag["BIZ"] = 1] = "BIZ";
                UserAttrVerifyFlag[UserAttrVerifyFlag["FAMOUS"] = 2] = "FAMOUS";
                UserAttrVerifyFlag[UserAttrVerifyFlag["BIZ_BIG"] = 4] = "BIZ_BIG";
                UserAttrVerifyFlag[UserAttrVerifyFlag["BIZ_BRAND"] = 8] = "BIZ_BRAND";
                UserAttrVerifyFlag[UserAttrVerifyFlag["BIZ_VERIFIED"] = 16] = "BIZ_VERIFIED";
            })(UserAttrVerifyFlag || (UserAttrVerifyFlag = {}));
            exports_1("UserAttrVerifyFlag", UserAttrVerifyFlag);
            (function (ChatRoomNotify) {
                ChatRoomNotify[ChatRoomNotify["CLOSE"] = 0] = "CLOSE";
                ChatRoomNotify[ChatRoomNotify["OPEN"] = 1] = "OPEN";
            })(ChatRoomNotify || (ChatRoomNotify = {}));
            exports_1("ChatRoomNotify", ChatRoomNotify);
            exports_1("TextInfoMap", TextInfoMap = {
                "2457513": "周六",
                "4078104": "[视频]",
                "7068541": "查看详细资料",
                "02d9819": "提示",
                "0d2fc2c": "程序初始化失败，点击确认刷新页面",
                "61e885c": "不允许发送空文件",
                "9a7dbbc": "发送视频文件不允许超过 20MB",
                "76a7e04": "图片上传失败，请检查你的网络",
                "82cf63d": "抱歉，截屏工具暂不支持64位操作系统下的IE浏览器。",
                "112a5c0": "请检查你是否禁用了截屏插件。如果你还没安装截屏插件，点击确定安装。",
                "c5795a7": "图片上传失败，请检查你的网络，",
                "8d521cc": "点击修改备注",
                "5a97440": "我是",
                "f45a3d8": "添加好友失败",
                "84e4fac": "取消置顶",
                "3d43ff1": "置顶",
                "1f9be6d": "修改群名",
                "685739c": "关闭聊天",
                "91382d9": "清屏",
                "b5f1591": "发送消息",
                "0bd10a8": "添加到通讯录",
                "3b61c96": "引用",
                "d9eb6f5": "「",
                "83b6d34": "」",
                "79d3abe": "复制",
                "f26ef91": "下载",
                "21e106f": "转发",
                "0d42740": "创建群聊失败",
                "b3b6735": "最近聊天",
                "845ec73": "图片加载失败，请关闭后重试。",
                "809bb9d": "[表情]",
                "562d747": "周日",
                "1603b06": "周一",
                "b5a6a07": "周二",
                "e60725e": "周三",
                "170fc8e": "周四",
                "eb79cea": "周五",
                "938b111": "该消息网页版微信暂时不支持",
                "a5627e8": "[图片]",
                "b28dac0": "[语音]",
                "1f94b1b": "[小视频]",
                "80f56fb": "[发送了一个表情，请在手机上查看]",
                "2242ac7": "[收到了一个表情，请在手机上查看]",
                "e230fc1": "[动画表情]",
                "fdaa3a3": "[收到一条视频/语音聊天消息，请在手机上查看]",
                "0e23719": "[音乐]",
                "4f20785": "[应用消息]",
                "c4e04ee": "请在手机点击打开",
                "e5b228c": "[链接]",
                "6daeae3": "[文件]",
                "0cdad09": "[收到一条微信转账消息，请在手机上查看]",
                "c534fc3": "[收到一条优惠券消息，请在手机上查看]",
                "8e94ca5": "我发起了位置共享，请在手机上查看",
                "a41d576": "对方",
                "a1f1299": "发起了位置共享，请在手机上查看",
                "95afe20": "[收到一条扫商品消息，请在手机上查看]",
                "355765a": "[收到一条商品消息，请在手机上查看]",
                "9d7f4bb": "[收到一条表情分享消息，请在手机上查看]",
                "e24e75c": "[微信红包]",
                "ded861c": "撤回了一条消息",
                "df1fd91": "你",
                "ebeaf99": "想要将你加为朋友",
                "9a2223f": "你推荐了",
                "dd14577": "向你推荐了",
                "6c2fc35": "微信团队",
                "eb7ec65": "文件传输助手",
                "0469c27": "腾讯新闻",
                "a82c4c4": "朋友推荐消息",
                "f13fb20": "星标好友",
                "59d29a3": "好友",
                "4b0ab7b": "群组",
                "215feec": "公众号",
                "2f521c5": "微信网页版",
                "cfbf6f4": "微信",
                "a7dd12b": "show",
                "a88f05b": "hide",
                "41f984b": "toggle"
            });
            exports_1("EmojiCodeMap", EmojiCodeMap = {
                "1f604": "",
                "1f60a": "",
                "1f603": "",
                "263a": "",
                "1f609": "",
                "1f60d": "",
                "1f618": "",
                "1f61a": "",
                "1f633": "",
                "1f63c": "",
                "1f60c": "",
                "1f61c": "",
                "1f445": "",
                "1f612": "",
                "1f60f": "",
                "1f613": "",
                "1f640": "",
                "1f61e": "",
                "1f616": "",
                "1f625": "",
                "1f630": "",
                "1f628": "",
                "1f62b": "",
                "1f622": "",
                "1f62d": "",
                "1f602": "",
                "1f632": "",
                "1f631": "",
                "1f620": "",
                "1f63e": "",
                "1f62a": "",
                "1f637": "",
                "1f47f": "",
                "1f47d": "",
                2764: "",
                "1f494": "",
                "1f498": "",
                2728: "",
                "1f31f": "",
                2755: "",
                2754: "",
                "1f4a4": "",
                "1f4a6": "",
                "1f3b5": "",
                "1f525": "",
                "1f4a9": "",
                "1f44d": "",
                "1f44e": "",
                "1f44a": "",
                "270c": "",
                "1f446": "",
                "1f447": "",
                "1f449": "",
                "1f448": "",
                "261d": "",
                "1f4aa": "",
                "1f48f": "",
                "1f491": "",
                "1f466": "",
                "1f467": "",
                "1f469": "",
                "1f468": "",
                "1f47c": "",
                "1f480": "",
                "1f48b": "",
                2600: "",
                2614: "",
                2601: "",
                "26c4": "",
                "1f319": "",
                "26a1": "",
                "1f30a": "",
                "1f431": "",
                "1f429": "",
                "1f42d": "",
                "1f439": "",
                "1f430": "",
                "1f43a": "",
                "1f438": "",
                "1f42f": "",
                "1f428": "",
                "1f43b": "",
                "1f437": "",
                "1f42e": "",
                "1f417": "",
                "1f435": "",
                "1f434": "",
                "1f40d": "",
                "1f426": "",
                "1f414": "",
                "1f427": "",
                "1f41b": "",
                "1f419": "",
                "1f420": "",
                "1f433": "",
                "1f42c": "",
                "1f339": "",
                "1f33a": "",
                "1f334": "",
                "1f335": "",
                "1f49d": "",
                "1f383": "",
                "1f47b": "",
                "1f385": "",
                "1f384": "",
                "1f381": "",
                "1f514": "",
                "1f389": "",
                "1f388": "",
                "1f4bf": "",
                "1f4f7": "",
                "1f3a5": "",
                "1f4bb": "",
                "1f4fa": "",
                "1f4de": "",
                "1f513": "",
                "1f512": "",
                "1f511": "",
                "1f528": "",
                "1f4a1": "",
                "1f4eb": "",
                "1f6c0": "",
                "1f4b2": "",
                "1f4a3": "",
                "1f52b": "",
                "1f48a": "",
                "1f3c8": "",
                "1f3c0": "",
                "26bd": "",
                "26be": "",
                "26f3": "",
                "1f3c6": "",
                "1f47e": "",
                "1f3a4": "",
                "1f3b8": "",
                "1f459": "",
                "1f451": "",
                "1f302": "",
                "1f45c": "",
                "1f484": "",
                "1f48d": "",
                "1f48e": "",
                2615: "",
                "1f37a": "",
                "1f37b": "",
                "1f377": "",
                "1f354": "",
                "1f35f": "",
                "1f35d": "",
                "1f363": "",
                "1f35c": "",
                "1f373": "",
                "1f366": "",
                "1f382": "",
                "1f34f": "",
                2708: "",
                "1f680": "",
                "1f6b2": "",
                "1f684": "",
                "26a0": "",
                "1f3c1": "",
                "1f6b9": "",
                "1f6ba": "",
                "2b55": "",
                "274e": "",
                a9: "",
                ae: "",
                2122: ""
            });
        }
    }
});
