export interface MessageEventHandler{
	(params:any,callback:MessageEventCallback):void;
}
export interface MessageEventCallback{
	(message?:any):void;
}

interface postMessageMethod{
	(message:any,targetOrigin:string,ports?:any):void;
}

let CALLBACK_MESSAGE_TYPE = '_CALLBACK_MESSAGE_TYPE_';

export class PostMessageManager{
	private window;
	private messageId:number = 0;
	private eventHandlers:Object = {};
	private callbacks:Object = {};
	private postMessage:postMessageMethod;

	constructor(iframe?:HTMLIFrameElement){
		let self = this;
		if(iframe) {
			this.window = iframe.contentWindow;
		}else if(window.parent){
			this.window = window.parent;
		}

		window.addEventListener('message',function(event:MessageEvent){
			let messageId = event.data.messageId;
			let command = event.data.command;
			let params = event.data.params;
			let callbackId = event.data.callbackId;

			// 如果是回调消息就在此返回吧
			if(command == CALLBACK_MESSAGE_TYPE && callbackId in self.callbacks) {
				self.callbacks[callbackId](params);
				delete self.callbacks[callbackId];
				return ;
			}
			if(command in self.eventHandlers) {
				let action = self.eventHandlers[command] as MessageEventHandler;
				if(action) {
					action(params,function(message){
						self.window.postMessage({
							command:CALLBACK_MESSAGE_TYPE,
							params:message,
							callbackId:messageId
						},'*');
					});
				}
			}
				
		});
	}

	on(command:string,handler:MessageEventHandler){
		this.eventHandlers[command] = handler;
	}
	post(command:string,params:any,callback?:MessageEventCallback){
		let messageId = this.messageId++;
		this.window.postMessage({
			command:command,
			params:params,
			messageId:messageId
		},'*');
		if(callback) {
			this.callbacks[messageId] = callback;
		}
	}
}