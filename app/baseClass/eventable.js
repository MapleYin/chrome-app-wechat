System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Eventable;
    return {
        setters:[],
        execute: function() {
            Eventable = class Eventable {
                constructor() {
                    this.eventHandlers = {};
                }
                on(message, callback) {
                    if (!(message in this.eventHandlers)) {
                        this.eventHandlers[message] = [];
                    }
                    this.eventHandlers[message].push(callback);
                }
                dispatchEvent(message, data, callback) {
                    let self = this;
                    if (message in this.eventHandlers) {
                        this.eventHandlers[message].forEach(function (value) {
                            value.call(self, data, callback);
                        });
                    }
                }
            };
            exports_1("Eventable", Eventable);
        }
    }
});
