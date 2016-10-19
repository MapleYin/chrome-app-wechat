System.register(['./template'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var template_1;
    var templateString, ChatListItem;
    return {
        setters:[
            function (template_1_1) {
                template_1 = template_1_1;
            }],
        execute: function() {
            templateString = `<li class="item" data-id="{{id}}">
	<header class="item-header">
		<img src="/images/wechat_avatar_default.png" data-src="{{avatar}}" alt="{{nickName}}" class="avatar">
	</header>
	<div class="item-body">
		<header class="info">
			<h1 class="username">{{nickName}}</h1>
			<time class="message-date">{{lastDate}}</time>
		</header>
		<p class="message">{{lastMessage}}</p>
	</div>
</li>`;
            ChatListItem = class ChatListItem extends template_1.Template {
                constructor(itemData) {
                    super(templateString);
                    let self = this;
                    this.data = {
                        id: itemData.UserName,
                        avatar: itemData.HeadImgUrl,
                        nickName: itemData.RemarkName || itemData.NickName
                    };
                    this.id = this.data.id;
                    this.avatar = this.data.avatar;
                    this.nickName = this.data.nickName;
                    this.render(this.data);
                }
                set active(v) {
                    this._active = v;
                    if (v) {
                        this.$element.addClass('active');
                    }
                    else {
                        this.$element.removeClass('active');
                    }
                }
                set lastDate(v) {
                    this._lastDate = v;
                    this.$element.find('.message-date').text(v.toLocaleTimeString());
                }
                set lastMessage(v) {
                    this._lastMessage = v;
                    this.$element.find('p.message').text(v);
                }
            };
            exports_1("ChatListItem", ChatListItem);
        }
    }
});
