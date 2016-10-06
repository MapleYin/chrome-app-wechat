export class Eventable{

	private eventHandlers = {};

	on(message,callback){
		this.eventHandlers[message] = callback;
	}

	protected dispatchEvent(message:string,data?:any){
		if(message in this.eventHandlers) {
			this.eventHandlers[message].call(this,data);
		}
	}
}