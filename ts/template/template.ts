import {sourceServer} from '../servers/sourceServer'

var templateUniqueId:number = 0;


export class Template{
	private templateString:string;
	private templateId:number = 0;
	$element:JQuery;

	constructor (templateString:string){
		this.templateString = templateString;
	}

	render(data:Object){
		this.templateId = templateUniqueId++;
		var templateString = this.templateString;

		let replaceKeyArray = templateString.match(/{{.*?}}/g);
		for (var i = 0,count = replaceKeyArray.length; i < count; i++) {
			let key = replaceKeyArray[i];
			let reg = new RegExp(key, 'g');
			let value = data[key.slice(2, -2)]||'';
			templateString = templateString.replace(reg,value);
		}

		this.$element = $(templateString);

		this.loadImage(this.$element);
	}


	loadImage($element:JQuery){
		let $image = $element.find('img');
		let url:string = $image.data('src');
		if(url && url.search(/chrome-extension/) == -1) {
			sourceServer.fetchUserHeadImage('https://wx.qq.com'+url).then((localUrl)=>{
				$image.attr('src',localUrl);
			}).catch(reason=>{
				console.log(reason);
			});
		}
	}
}