define(["require", "exports", '../models/wxInterface'], function (require, exports, wxInterface_1) {
    "use strict";
    class ChatContentTemplateCreater {
        constructor() {
        }
        create(msgType, appMsgType) {
            var templateString;
            var typeClass;
            switch (msgType) {
                case wxInterface_1.MessageType.IMAGE:
                    templateString = this.imageMessageTemplate();
                    typeClass = 'image';
                    break;
                case wxInterface_1.MessageType.APP:
                    templateString = this.appMessageTemplate();
                    typeClass = 'link';
                    break;
                case wxInterface_1.MessageType.EMOTICON:
                    templateString = this.emoticonMessageTemplate();
                    typeClass = 'emoji-image';
                    break;
                case wxInterface_1.MessageType.VOICE:
                    templateString = this.voiceMessageTemplate();
                    typeClass = 'voice';
                    break;
                default:
                    templateString = this.textMessageTemplate();
                    typeClass = 'text';
                    break;
            }
            return this.combineTemplate(typeClass, templateString);
        }
        combineTemplate(typeClass, template) {
            typeClass = typeClass || '';
            template = template || '';
            return `
		<div class="item ${typeClass} {{className}}" data-id={{msgId}}>
			<figure class="avatar">
				<img src="/images/wechat_avatar_default.png" data-src="{{avatar}}" alt="{{nickName}}">
			</figure>
			<section class="content">${template}</section>
		</div>`;
        }
        textMessageTemplate() {
            return `<p>{{content}}</p>`;
        }
        emoticonMessageTemplate() {
            return `<img src="" class="emoticon-image" data-src="{{image}}" alt="" />`;
        }
        imageMessageTemplate() {
            return `<img src="{{image}}" data-src="{{image}}" data-origin="{{originImage}}" class="msg-image" alt="" />`;
        }
        voiceMessageTemplate() {
            return `<span class="control"></span><time class="length">{{time}}</time>`;
        }
        appMessageTemplate() {
            return `
		<header>
			<h1>{{title}}</h1>
		</header>
		<figure>
			<p>{{desc}}</p>
			<img src="" data-src="{{image}}" alt="">
		</figure>
		<footer>
			<span>{{source}}</span>
		</footer>
		`;
        }
    }
    exports.chatContentTemplateCreater = new ChatContentTemplateCreater();
});
