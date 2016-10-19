import {fetchParams} from './interface'
chrome.runtime.onMessage.addListener(function(message:fetchParams, sender:chrome.runtime.MessageSender,sendResponse:(response:any)=>void){
	let url = new URL(message.url);
	for (var key in message.query) {
		url['searchParams'].append(key,message.query[key]);
	}
	var init;
	if(message.method == 'POST') {
		init = {
			credentials : 'include',
			headers : message.headers || null
		};
	}else{
		init = {
			method: "POST",
			credentials : 'include',
			body : JSON.stringify(message.body),
			headers : message.headers || null
		}
	}
	fetch(url.toString(),init).then(response=>{
		switch (message.headers['responseType']) {
			case 'blob':
				response.blob().then(result=>{
					let objURL = URL.createObjectURL(result);
					sendResponse({
						status : 0,
						message : 'ok',
						data : objURL
					});
				});
				break;
			case 'text':
				response.text().then(result=>{
					sendResponse({
						status : 0,
						message : 'ok',
						data : result
					});
				});
				break;
			case 'json':
				response.json().then(result=>{
					sendResponse({
						status : 0,
						message : 'ok',
						data : result
					});
				});
			default:
				// code...
				break;
		}
	}).catch(reason=>{
		sendResponse({
			status : -1,
			message : reason,
			data : null
		});
	});
	return true;
});