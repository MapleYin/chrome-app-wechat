interface VoidCallBack{
	():void;
}

interface ListenCallBack<T>{
	(data:T,callback:VoidCallBack):void;
}

export class Eventable{

	private eventHandlers:{[key:string]:ListenCallBack<any>[]} = {};

	on<T>(message:string,callback:ListenCallBack<T>){
		if( !(message in this.eventHandlers) ){
			this.eventHandlers[message] = [];
		}
		this.eventHandlers[message].push(callback);
	}

	protected dispatchEvent<T>(message:string,data?:T,callback?:VoidCallBack){
		let self = this;
		if(message in this.eventHandlers) {
			this.eventHandlers[message].forEach(function(value){
				value.call(self,data,callback);
			});
		}
	}
}