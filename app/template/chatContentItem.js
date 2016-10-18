define(["require", "exports", './template'], function (require, exports, template_1) {
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
        constructor(content, sender) {
            super(templateString);
            this.avatar = sender.HeadImgUrl;
            this.nickName = sender.getDisplayName();
            this.content = content;
            this.render({
                avatar: this.avatar,
                nickName: this.nickName,
                content: this.content,
                className: sender.isSelf ? 'self' : ''
            });
        }
    }
    exports.ChatContentItem = ChatContentItem;
});
