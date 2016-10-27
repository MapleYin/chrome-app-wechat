define(["require", "exports", './baseManager', './contactManager', '../utility/notificationCenter', '../servers/sourceServer'], function (require, exports, baseManager_1, contactManager_1, notificationCenter_1, sourceServer_1) {
    "use strict";
    class NotificationManager extends baseManager_1.BaseManager {
        constructor() {
            super();
            chrome.notifications.onClicked.addListener(msgID => {
                this.notificationClicked(msgID);
            });
        }
        post(message, disappear) {
            let noticeID = message.MsgId.toString();
            let noticeOptions = this.createOption(message);
            disappear = disappear || 5000;
            sourceServer_1.sourceServer.fetchSource(noticeOptions.iconUrl).then(localUrl => {
                noticeOptions.iconUrl = localUrl;
                chrome.notifications.create(noticeID, noticeOptions, noticeID => {
                    setTimeout(() => {
                        chrome.notifications.clear(noticeID);
                    }, disappear);
                });
            });
        }
        createOption(message) {
            var option = {};
            let user = contactManager_1.contactManager.getContact(message.MMPeerUserName);
            option.type = 'basic';
            option.title = user.getDisplayName();
            option.iconUrl = user.HeadImgUrl;
            option.message = message.MMDigest;
            // switch (message.MsgType) {
            // 	case MessageType.TEXT:
            // 		option.message = message.MMDigest;
            // 		break;
            // 	case MessageType.IMAGE:
            // 		option.imageUrl = message.ImageUrl;
            // 		break;
            // 	default:
            // 		// code...
            // 		break;
            // }
            return option;
        }
        notificationClicked(msgID) {
            notificationCenter_1.NotificationCenter.post('notification.click', msgID);
        }
    }
    exports.notificationManager = new NotificationManager();
});
