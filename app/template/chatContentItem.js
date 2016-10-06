define(["require", "exports", './template'], function (require, exports, template_1) {
    "use strict";
    let templateString = `
<div class="item {{className}}">
	<figure class="avatar">
		<img src="{{avatar}}" alt="">
	</figure>
	<section class="content">
		<p>{{content}}</p>
	</section>
</div>
`;
    class ChatContentItem extends template_1.Template {
        constructor(itemData, fromUser, isSelf) {
            super(templateString);
            this.data = {
                avatar: fromUser.HeadImgUrl,
                nickName: fromUser.NickName,
                content: itemData.Content,
                className: isSelf ? 'self' : ''
            };
            this.render(this.data);
        }
    }
    exports.ChatContentItem = ChatContentItem;
});
