import { Injectable } from '@angular/core';

import EmojiCodeMap = require("../interface/emoji.interface");

@Injectable()
export class EmoticonManager {
	transformSpanToImg(text:string):string{
		if(text) {
			text = text.replace(/<span.*?class="emoji emoji(.*?)"><\/span>/g,(str,substring)=>{
				let emoji = EmojiCodeMap[substring];
				return emoji;
			});
		}
		return text;
	}
	emoticonFormat(text:string):string{
		return text;
	}

	// genEmoticonHTML(className:string){
	// 	return `<img class="${className}" src="' + o.RES_IMG_PLACEHOLDER + '" />`;
	// }
}


export let emoticonManager = new EmoticonManager();