interface notificationEvent<T>{
	eventName : string;
	timestamp : number;
	userInfo?: T;
}

interface eventHandler<T>{
	(event:notificationEvent<T>):void
}

class NotificationCenterCreate{
	private eventMap:{[key:string]:eventHandler<any>[]} = {};
	post<T>(eventString:string,userInfo?:T){
		let self = this;
		let eventParts = eventString.split('.');
		var eventNameArray:string[] = [];

		eventParts.forEach(eventPartName=>{
			eventNameArray.push(eventPartName);
			let eventName = eventNameArray.join('.');
			if(eventName in self.eventMap) {
				console.log(`[NotificationCenter] Post EventName:${eventName}`);
				self.eventMap[eventName].forEach((handler)=>{
					handler({
						eventName:eventName,
						timestamp:+new Date,
						userInfo:userInfo
					});
				});
			}
		});
	}
	on<T>(eventNames:string,handler:eventHandler<T>){
		let eventNameArray = eventNames.split(',');
		eventNameArray.forEach(eventName=>{
			console.log(`[NotificationCenter] Listen EventName:${eventName}`);
			if(!(eventName in this.eventMap)) {
				this.eventMap[eventName] = [];
			}
			this.eventMap[eventName].push(handler);
		});
	}
}

export let NotificationCenter = new NotificationCenterCreate();