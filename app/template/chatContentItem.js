System.register(['./template'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var template_1;
    var templateString, ChatContentItem;
    return {
        setters:[
            function (template_1_1) {
                template_1 = template_1_1;
            }],
        execute: function() {
            templateString = `
<div class="item {{className}}">
	<figure class="avatar">
		<img src="/images/wechat_avatar_default.png" data-src="{{avatar}}" alt="{{nickName}}">
	</figure>
	<section class="content">
		<p>{{content}}</p>
	</section>
</div>
`;
            ChatContentItem = class ChatContentItem extends template_1.Template {
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
            };
            exports_1("ChatContentItem", ChatContentItem);
        }
    }
});
