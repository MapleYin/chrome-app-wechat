define(["require", "exports", '../models/wxInterface', './template', './templateCreater'], function (require, exports, wxInterface_1, template_1, templateCreater_1) {
    "use strict";
    class ChatContentItem extends template_1.Template {
        constructor(message, sender) {
            super();
            this.itemClassName = [];
            if (sender.isSelf) {
                this.itemClassName.push('self');
            }
            this.messageId = message.MsgId;
            this.avatar = sender.HeadImgUrl;
            this.nickName = sender.getDisplayName();
            let templateString = templateCreater_1.chatContentTemplateCreater.create(message.MsgType);
            this.processMessage(message);
            this.render(templateString, this.renderData);
        }
        processMessage(message) {
            this.renderData = {
                msgId: this.messageId,
                avatar: this.avatar,
                nickName: this.nickName,
                className: this.itemClassName.join('')
            };
            switch (message.MsgType) {
                case wxInterface_1.MessageType.TEXT:
                    this.fillInData({
                        content: message.MMActualContent
                    });
                    break;
                case wxInterface_1.MessageType.IMAGE:
                    this.fillInData({
                        originImage: message.OriginImageUrl,
                        image: message.ImageUrl
                    });
                    break;
                case wxInterface_1.MessageType.EMOTICON:
                    this.fillInData({
                        image: message.ImageUrl
                    });
                    break;
                case wxInterface_1.MessageType.VOICE:
                    this.fillInData({
                        time: message.VoiceLength / 1e3
                    });
                    break;
                case wxInterface_1.MessageType.APP:
                    switch (message.AppMsgType) {
                        case wxInterface_1.AppMsgType.URL:
                            this.fillInData({
                                title: message.FileName,
                                desc: message.MMAppMsgDesc,
                                image: message.ImageUrl,
                                source: message.MMAppName
                            });
                            break;
                        default:
                            this.fillInData({
                                content: `[未知APP消息]:${message.AppMsgType}`
                            });
                            break;
                    }
                    break;
                case wxInterface_1.MessageType.MICROVIDEO:
                    this.fillInData({
                        content: `[小视频]`
                    });
                    break;
                default:
                    this.fillInData({
                        content: `[未知消息]:${message.MsgType}`
                    });
                    break;
            }
        }
        fillInData(data) {
            for (var key in data) {
                this.renderData[key] = data[key];
            }
        }
    }
    exports.ChatContentItem = ChatContentItem;
});
