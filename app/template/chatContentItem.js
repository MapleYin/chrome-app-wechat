define(["require", "exports", '../models/wxInterface', './template'], function (require, exports, wxInterface_1, template_1) {
    "use strict";
    let templateString = `
<div class="item {{className}}">
	<figure class="avatar">
		<img src="/images/wechat_avatar_default.png" data-src="{{avatar}}" alt="{{nickName}}">
	</figure>
	<section class="content">
		<p>{{content}}</p>
	</section>
</div>
`;
    class ChatContentItem extends template_1.Template {
        constructor(message, sender) {
            super(templateString);
            this.avatar = sender.HeadImgUrl;
            this.nickName = sender.getDisplayName();
            this.processMessage(message);
            this.render({
                avatar: this.avatar,
                nickName: this.nickName,
                content: this.content,
                className: sender.isSelf ? 'self' : ''
            });
        }
        processMessage(message) {
            switch (message.MsgType) {
                case wxInterface_1.MessageType.TEXT:
                    this.content = message.MMActualContent;
                    break;
                case wxInterface_1.MessageType.IMAGE:
                    this.content = `<img data-src="${message.ImageUrl}" class="msg-image" />`;
                    break;
                default:
                    this.content = '[未知消息]';
                    break;
            }
        }
    }
    exports.ChatContentItem = ChatContentItem;
});
