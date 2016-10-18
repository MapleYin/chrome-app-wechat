define(["require", "exports"], function (require, exports) {
    "use strict";
    class Eventable {
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
    }
    exports.Eventable = Eventable;
});
