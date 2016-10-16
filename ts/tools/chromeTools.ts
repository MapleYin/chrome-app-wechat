export let fetchRemoteImage = function(url:string,callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.onload = function(e) {
		if(callback) {
			callback(URL.createObjectURL(this.response));
		}
	};
	xhr.send();
}

let throttle = (fn)=>{
	
};

let reEscape = /[&<>'"]/g;
let reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
let oEscape = {'&': '&amp;','<': '&lt;','>': '&gt;',"'": '&#39;','"': '&quot;'};
let oUnescape = {'&amp;': '&','&#38;': '&','&lt;': '<','&#60;': '<','&gt;': '>','&#62;': '>','&apos;': "'",'&#39;': "'",'&quot;': '"','&#34;': '"'};
let fnEscape = function (m) {return oEscape[m];};
let fnUnescape = function (m) {return oUnescape[m];};
export let escape = function(str:string){return str.replace(reEscape,fnEscape)};
export let unescape = function(str:string) {return str.replace(reUnescape, fnUnescape)};