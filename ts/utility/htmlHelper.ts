// let _xml2Json = function (t,n?){function r(t,a){if(!t)return null;var s="",u=null,l=null;t.nodeType,i(t.localName||t.nodeName),t.text||t.nodeValue||"",t.childNodes&&t.childNodes.length>0&&e.each(t.childNodes,function(e,t){var n=t.nodeType,a=i(t.localName||t.nodeName),l=t.text||t.nodeValue||"";if(8!=n)if(3!=n&&4!=n&&a)u=u||{},u[a]?(u[a].length||(u[a]=o(u[a])),u[a]=o(u[a]),u[a][u[a].length]=r(t,!0),u[a].length=u[a].length):u[a]=r(t);else{if(l.match(/^\s+$/))return;s+=l.replace(/^\s+/,"").replace(/\s+$/,"")}}),t.attributes&&t.attributes.length>0&&(l={},u=u||{},e.each(t.attributes,function(e,t){var n=i(t.name),r=t.value;l[n]=r,u[n]?(u[cnn]=o(u[cnn]),u[n][u[n].length]=r,u[n].length=u[n].length):u[n]=r})),u&&(u=e.extend(""!=s?new String(s):{},u||{}),s=u.text?[u.text||""].concat([s]):s,s&&(u.text=s),s="");var c=u||s;return n&&(s&&(c={}),s=c.text||s||"",s&&(c.text=s),a||(c=o(c))),c}if(!t)return{};var i=function(e){return String(e||"").replace(/-/g,"_")},o=function(t){return e.isArray(t)||(t=[t]),t.length=t.length,t};if("string"==typeof t&&(t=e.text2xml(t)),t.nodeType){if(3==t.nodeType||4==t.nodeType)return t.nodeValue;var a=9==t.nodeType?t.documentElement:t,s=r(a,!0);return t=null,a=null,s}};



export let htmlDecode = (text:string)=>{
	return text && 0 != text.length ? text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&") : ""
}

export let htmlEncode = (text:string)=>{
	return typeof text == 'string' ? text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
}

// export let xml2Json = (text:string)=>{
// 	if(!text) {
// 		return {};
// 	}
// 	try{
// 		var index = text.indexOf('<');
// 		if(index) {
// 			text = text.substr(index);
// 		}
// 		return _xml2Json(text);
// 	}catch(error){
// 		console.error(error);
// 		return {}
// 	}
// }