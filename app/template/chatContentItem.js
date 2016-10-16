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
            this.avatar = fromUser.HeadImgUrl;
            this.nickName = fromUser.NickName;
            this.content = itemData.Content;
            this.render({
                avatar: this.avatar,
                nickName: this.nickName,
                content: this.content,
                className: isSelf ? 'self' : ''
            });
        }
        convertContentToFit(itemData) {
            var content = '';
            switch (itemData.MsgType) {
                case 1:
                    content = itemData.Content;
                    break;
                case 2:
                    break;
                default:
                    // code...
                    break;
            }
            return '';
        }
    }
    exports.ChatContentItem = ChatContentItem;
});
