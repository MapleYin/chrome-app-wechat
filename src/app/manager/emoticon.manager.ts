import { Injectable } from '@angular/core';

import {MEmoji} from '../defined'

@Injectable()
export class EmoticonManager {
	transformSpanToImg(text:string):string{
		if(text) {
			text = text.replace(/<span.*?class="emoji emoji(.*?)"><\/span>/g,(str,substring)=>{
				let emoji = MEmoji[substring];
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