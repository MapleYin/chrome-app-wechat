interface VoidCallBack{
	():void;
}

interface ListenCallBack{
	(data:any,callback:VoidCallBack):void;
}

export class Eventable{

	private eventHandlers:{[key:string]:Array<ListenCallBack>} = {};

	on(message:string,callback:ListenCallBack){
		if( !(message in this.eventHandlers) ){
			this.eventHandlers[message] = [];
		}
		this.eventHandlers[message].push(callback);
	}

	protected dispatchEvent(message:string,data?:any,callback?:VoidCallBack){
		let self = this;
		if(message in this.eventHandlers) {
			this.eventHandlers[message].forEach(function(value){
				value.call(self,data,callback);
			});
		}
	}
}