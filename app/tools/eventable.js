define(["require", "exports"], function (require, exports) {
    "use strict";
    class Eventable {
        constructor() {
            this.eventHandlers = {};
        }
        on(message, callback) {
            this.eventHandlers[message] = callback;
        }
        dispatchEvent(message, data) {
            if (message in this.eventHandlers) {
                this.eventHandlers[message].call(this, data);
            }
        }
    }
    exports.Eventable = Eventable;
});
