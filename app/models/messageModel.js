define(["require", "exports", './wxInterface', '../manager/contactManager', '../manager/emoticonManager', '../servers/coreServer', './userModel'], function (require, exports, wxInterface_1, contactManager_1, emoticonManager_1, coreServer_1, userModel_1) {
    "use strict";
    let GET_MSG_IMG_URL = '/cgi-bin/mmwebwx-bin/webwxgetmsgimg';
    class MessageModel {
        constructor(message) {
            this.commonMsgProcess(message);
        }
        commonMsgProcess(message) {
            this.FromUserName = message.FromUserName;
            this.ToUserName = message.ToUserName;
            this.MsgType = message.MsgType;
            this.StatusNotifyCode = message.StatusNotifyCode;
            this.StatusNotifyUserName = message.StatusNotifyUserName;
            this.Content = message.Content || '';
            this.CreateTime = message.CreateTime;
            this.MsgId = message.MsgId;
            var actualContent = '';
            var username = '';
            this.MMPeerUserName = (message.FromUserName == contactManager_1.contactManager.account.UserName || message.FromUserName == '') ? message.ToUserName : message.FromUserName;
            this.MMDigest = '';
            this.MMIsSend = message.FromUserName == contactManager_1.contactManager.account.UserName || message.FromUserName == '';
            if (userModel_1.UserModel.isRoomContact(this.MMPeerUserName)) {
                this.MMIsChatRoom = true;
                actualContent = this.Content.replace(/^(@[a-zA-Z0-9]+|[a-zA-Z0-9_-]+):<br\/>/, (str, name) => {
                    username = name;
                    return '';
                });
                if (username && username != contactManager_1.contactManager.account.UserName) {
                    let user = contactManager_1.contactManager.getContact(username, this.MMPeerUserName);
                    if (user) {
                        let displayName = user.getDisplayName();
                        if (displayName) {
                            this.MMDigest = displayName + ':';
                        }
                    }
                }
            }
            else {
                this.MMIsChatRoom = false;
                actualContent = this.Content;
            }
            if (!this.MMIsSend && this.MMUnread == undefined && this.MsgType != wxInterface_1.MessageType.SYS) {
                this.MMUnread = true;
            }
            if (!this.LocalID) {
                this.ClientMsgId = this.LocalID = this.MsgId;
            }
            // emoji
            actualContent = emoticonManager_1.emoticonManager.emoticonFormat(actualContent);
            this.MMActualContent = actualContent;
            this.MMActualSender = username || message.FromUserName;
            switch (message.MsgType) {
                case wxInterface_1.MessageType.TEXT:
                    this.MMDigest += this.MMActualContent.replace(/<br ?[^><]*\/?>/g, "");
                    break;
                case wxInterface_1.MessageType.IMAGE:
                    this.MMDigest += wxInterface_1.TextInfoMap["a5627e8"];
                    this.ImageUrl = this.getMsgImg(this.MsgId, 'slave');
                    this.OriginImageUrl = this.getMsgImg(this.MsgId);
                    break;
                default:
                    // code...
                    break;
            }
            //@TODO
            //对消息显示时间的标志
        }
        getMsgImg(MsgId, quality) {
            var type = '';
            if (quality) {
                type = `&type=${quality}`;
            }
            return `${GET_MSG_IMG_URL}?&MsgID=${MsgId}&skey=${encodeURIComponent(coreServer_1.CoreServer.Skey)}${type}`;
        }
    }
    exports.MessageModel = MessageModel;
});
