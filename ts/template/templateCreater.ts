import {MessageType,AppMsgType} from '../models/wxInterface'


export interface commonRenderData{
	avatar:string;
	nickName:string;
}

export interface textMsgRenderData{
	content:string;
}

export interface voiceMsgRenderData{
	time:number;
}

export interface emoticonMsgRenderData{
	image:string;
}

export interface imageMsgRenderData extends emoticonMsgRenderData{
	originImage:string;
}

export interface appMsgRenderData extends emoticonMsgRenderData{
	title:string;
	desc:string;
	source:string;
}

class ChatContentTemplateCreater{
	constructor(){
	}

	create(msgType:MessageType,appMsgType?:AppMsgType):string{
		var templateString:string;
		var typeClass:string;
		switch (msgType) {
			case MessageType.IMAGE:
				templateString = this.imageMessageTemplate();
				typeClass = 'image';
				break;
			case MessageType.APP:
				templateString = this.appMessageTemplate();
				typeClass = 'link';
				break;
			case MessageType.EMOTICON:
				templateString = this.emoticonMessageTemplate();
				typeClass = 'emoji-image';
				break;
			case MessageType.VOICE:
				templateString = this.voiceMessageTemplate();
				typeClass = 'voice'
				break;
			default:
				templateString = this.textMessageTemplate();
				typeClass = 'text';
				break;
		}
		return this.combineTemplate(typeClass,templateString);
	}
	private combineTemplate(typeClass:string,template:string):string{
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
	private textMessageTemplate():string{
		return `<p>{{content}}</p>`;
	}
	private emoticonMessageTemplate():string{
		return `<img src="" class="emoticon-image" data-src="{{image}}" alt="" />`
	}
	private imageMessageTemplate(){
		return `<img src="{{image}}" data-src="{{image}}" data-origin="{{originImage}}" class="msg-image" alt="" />`;
	}
	private voiceMessageTemplate(){
		return `<span class="control"></span><time class="length">{{time}}</time>`;
	}
	private appMessageTemplate():string{
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


export let chatContentTemplateCreater = new ChatContentTemplateCreater();