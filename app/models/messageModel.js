define(["require", "exports", './wxInterface', '../manager/contactManager', '../manager/emoticonManager', '../servers/coreServer', './userModel', '../utility/stringHelper'], function (require, exports, wxInterface_1, contactManager_1, emoticonManager_1, coreServer_1, userModel_1, stringHelper_1) {
    "use strict";
    let GET_MSG_IMG_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetmsgimg';
    let GET_MSG_VOICE_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetvoice';
    let GET_MSG_VIDEO_URL = 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxgetvideo';
    class MessageModel {
        constructor(message) {
            this.commonMsgProcess(message);
        }
        commonMsgProcess(message) {
            this.FromUserName = message.FromUserName;
            this.ToUserName = message.ToUserName;
            this.MsgType = message.MsgType;
            this.AppMsgType = message.AppMsgType;
            this.StatusNotifyCode = message.StatusNotifyCode;
            this.StatusNotifyUserName = message.StatusNotifyUserName;
            this.Content = message.Content || '';
            this.CreateTime = message.CreateTime;
            this.MsgId = message.MsgId;
            this.FileName = message.FileName || '';
            this.FileSize = message.FileSize || '';
            this.Url = stringHelper_1.htmlDecode(message.Url) || '';
            this.HasProductId = message.HasProductId || 0;
            this.VoiceLength = message.VoiceLength || 0;
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
                case wxInterface_1.MessageType.APP:
                    this.appMsgProcess();
                    break;
                case wxInterface_1.MessageType.EMOTICON:
                    this.emojiMsgProcess();
                    break;
                case wxInterface_1.MessageType.IMAGE:
                    this.imageMsgProcess();
                    break;
                case wxInterface_1.MessageType.VOICE:
                    this.voiceMsgProcess();
                    break;
                case wxInterface_1.MessageType.VIDEO:
                    this.videoMsgProcess();
                    break;
                case wxInterface_1.MessageType.MICROVIDEO:
                    this.mircoVideoMsgProcess();
                    break;
                case wxInterface_1.MessageType.TEXT:
                    this.textMsgProcess();
                    break;
                case wxInterface_1.MessageType.RECALLED:
                    this.recalledMsgProcess();
                    break;
                default:
                    // code...
                    break;
            }
            //@TODO
            //对消息显示时间的标志
        }
        textMsgProcess() {
            this.MsgType = wxInterface_1.MessageType.TEXT;
            this.MMDigest += this.MMActualContent.replace(/<br ?[^><]*\/?>/g, "");
        }
        imageMsgProcess() {
            this.MsgType = wxInterface_1.MessageType.IMAGE;
            this.MMDigest += wxInterface_1.TextInfoMap["a5627e8"];
            this.ImageUrl = this.getMsgImg(this.MsgId, 'slave');
            this.OriginImageUrl = this.getMsgImg(this.MsgId);
        }
        mircoVideoMsgProcess() {
            this.MsgType = wxInterface_1.MessageType.MICROVIDEO;
            this.ImageUrl = this.getMsgImg(this.MsgId, 'slave');
            this.Url = this.getMsgVideo(this.MsgId);
            this.MMDigest += wxInterface_1.TextInfoMap['1f94b1b'];
        }
        videoMsgProcess() {
            this.MsgType = wxInterface_1.MessageType.VIDEO;
            this.MMDigest += wxInterface_1.TextInfoMap['4078104'];
        }
        emojiMsgProcess() {
            if (this.HasProductId) {
                this.MMActualContent = this.MMIsSend ? wxInterface_1.TextInfoMap['80f56fb'] : wxInterface_1.TextInfoMap['2242ac7'];
                this.textMsgProcess();
            }
            else {
                this.MsgType = wxInterface_1.MessageType.EMOTICON;
                this.MMDigest += wxInterface_1.TextInfoMap['e230fc1'];
                this.ImageUrl = this.getMsgImg(this.MsgId, 'big');
                var actualContent = stringHelper_1.xml2Json(stringHelper_1.htmlDecode(this.MMActualContent));
                if (actualContent && actualContent.emoji && actualContent.emoji.md5) {
                    this.md5 = actualContent.emoji.md5;
                }
            }
        }
        voiceMsgProcess() {
            this.MsgType = wxInterface_1.MessageType.VOICE;
            this.MMDigest += wxInterface_1.TextInfoMap['b28dac0'];
            this.MMVoiceUnRead = !this.MMIsSend && this.MMUnread;
            this.Url = this.getMsgVoice(this.MsgId);
        }
        recalledMsgProcess() {
            var actualContent = stringHelper_1.htmlDecode(this.MMActualContent);
            let digest = wxInterface_1.TextInfoMap['ded861c'];
            // TODO
        }
        appMsgProcess() {
            switch (this.AppMsgType) {
                case wxInterface_1.AppMsgType.TEXT:
                    this.appTextMsgProcess();
                    break;
                case wxInterface_1.AppMsgType.IMG:
                    this.imageMsgProcess();
                    break;
                case wxInterface_1.AppMsgType.AUDIO:
                    this.appAudioMsgProcess();
                    break;
                case wxInterface_1.AppMsgType.VIDEO:
                    this.appVideoMsgProcess();
                    break;
                case wxInterface_1.AppMsgType.EMOJI:
                    this.emojiMsgProcess();
                    break;
                case wxInterface_1.AppMsgType.URL:
                    this.appUrlMsgProcess();
                    break;
                case wxInterface_1.AppMsgType.ATTACH:
                    break;
                case wxInterface_1.AppMsgType.TRANSFERS:
                    break;
                case wxInterface_1.AppMsgType.RED_ENVELOPES:
                    break;
                case wxInterface_1.AppMsgType.CARD_TICKET:
                    break;
                case wxInterface_1.AppMsgType.OPEN:
                    break;
                case wxInterface_1.AppMsgType.REALTIME_SHARE_LOCATION:
                    break;
                case wxInterface_1.AppMsgType.SCAN_GOOD:
                    break;
                case wxInterface_1.AppMsgType.EMOTION:
                    break;
                default:
                    // code...
                    break;
            }
        }
        appUrlMsgProcess(digest) {
            this.MsgType = wxInterface_1.MessageType.APP;
            this.AppMsgType = wxInterface_1.AppMsgType.URL;
            digest = digest || wxInterface_1.TextInfoMap['e5b228c'] + this.FileName;
            this.MMDigest += digest;
            this.ImageUrl = this.getMsgImg(this.MsgId, 'slave');
            var actualContent = stringHelper_1.htmlDecode(this.MMActualContent);
            actualContent = stringHelper_1.encodeEmoji(actualContent);
            actualContent = stringHelper_1.xml2Json(actualContent).msg;
            this.MMAppMsgDesc = stringHelper_1.decodeEmoji(actualContent.appmsg.des);
            this.MMAppName = actualContent.appinfo.appname || actualContent.appmsg.sourcedisplayname || '';
            if (actualContent.appmsg.mmreader) {
                this.appReaderMsgProcess(actualContent.appmsg.mmreader);
            }
        }
        appTextMsgProcess() {
            let actualContent = stringHelper_1.htmlDecode(this.MMActualContent).replace(/<br\/>/g, '');
            actualContent = stringHelper_1.encodeEmoji(actualContent);
            actualContent = stringHelper_1.xml2Json(actualContent).msg;
            this.appAsTextMsgProcess(stringHelper_1.decodeEmoji(stringHelper_1.htmlEncode(actualContent.appmsg.title)));
        }
        appAudioMsgProcess() {
            let digest = wxInterface_1.TextInfoMap['0e23719'] + this.FileName;
            this.appUrlMsgProcess(digest);
        }
        appVideoMsgProcess() {
            let digest = wxInterface_1.TextInfoMap['4078104'] + this.FileName;
            this.appUrlMsgProcess(digest);
        }
        appOpenMsgProcess() {
            let digest = wxInterface_1.TextInfoMap['4f20785'] + this.FileName;
            this.appUrlMsgProcess(digest);
            this.MMAlert = wxInterface_1.TextInfoMap['c4e04ee'];
        }
        appReaderMsgProcess(mmreader) {
            this.MsgType = wxInterface_1.MessageType.APP;
            this.AppMsgType = wxInterface_1.AppMsgType.READER_TYPE;
            if (mmreader.category.count == 1) {
                this.MMCategory = [mmreader.category.item];
            }
            else {
                this.MMCategory = mmreader.category.item;
            }
            this.MMCategory.forEach(item => {
                let pub_time = new Date(1e3 * item.pub_time);
                item.pub_time = stringHelper_1.formatNum(pub_time.getMonth() + 1, 2) + '-' + stringHelper_1.formatNum(pub_time.getDate(), 2);
                let coverArray = item.cover.split('|');
                if (coverArray.length == 3) {
                    item.cover = coverArray[0];
                    item.width = coverArray[1];
                    item.height = coverArray[2];
                }
            });
            this.MMDigest += this.MMCategory.length && this.MMCategory[0].title;
        }
        appAsTextMsgProcess(actualContent) {
            this.MMActualContent = actualContent;
            this.textMsgProcess();
        }
        getMsgVideo(MsgId) {
            return `${GET_MSG_VIDEO_URL}?MsgID=${MsgId}&skey=${encodeURIComponent(coreServer_1.CoreServer.Skey)}`;
        }
        getMsgImg(MsgId, quality) {
            var type = '';
            if (quality) {
                type = `&type=${quality}`;
            }
            return `${GET_MSG_IMG_URL}?MsgID=${MsgId}&skey=${encodeURIComponent(coreServer_1.CoreServer.Skey)}${type}`;
        }
        getMsgVoice(MsgId) {
            return `${GET_MSG_VOICE_URL}?MsgID=${MsgId}&skey=${encodeURIComponent(coreServer_1.CoreServer.Skey)}`;
        }
    }
    exports.MessageModel = MessageModel;
});
