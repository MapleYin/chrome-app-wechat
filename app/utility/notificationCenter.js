System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var NotificationCenterCreate, NotificationCenter;
    return {
        setters:[],
        execute: function() {
            NotificationCenterCreate = class NotificationCenterCreate {
                constructor() {
                    this.eventMap = {};
                }
                post(eventString, userInfo) {
                    let self = this;
                    let eventParts = eventString.split('.');
                    var eventNameArray = [];
                    eventParts.forEach(eventPartName => {
                        eventNameArray.push(eventPartName);
                        let eventName = eventNameArray.join('.');
                        if (eventName in self.eventMap) {
                            console.log(`[NotificationCenter] Post EventName:${eventName}`);
                            self.eventMap[eventName].forEach((handler) => {
                                handler({
                                    eventName: eventName,
                                    timestamp: +new Date,
                                    userInfo: userInfo
                                });
                            });
                        }
                    });
                }
                on(eventNames, handler) {
                    let eventNameArray = eventNames.split(',');
                    eventNameArray.forEach(eventName => {
                        console.log(`[NotificationCenter] Listen EventName:${eventName}`);
                        if (!(eventName in this.eventMap)) {
                            this.eventMap[eventName] = [];
                        }
                        this.eventMap[eventName].push(handler);
                    });
                }
            };
            exports_1("NotificationCenter", NotificationCenter = new NotificationCenterCreate());
        }
    }
});
