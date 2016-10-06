define(["require", "exports"], function (require, exports) {
    "use strict";
    class Eventable {
        constructor() {
            this.eventHandlers = {};
        }
        on(message, callback) {
            this.eventHandlers[message] = callback;
        }
        dispatchEvent(message, data, callback) {
            if (message in this.eventHandlers) {
                this.eventHandlers[message].call(this, data, callback);
            }
        }
    }
    exports.Eventable = Eventable;
});
