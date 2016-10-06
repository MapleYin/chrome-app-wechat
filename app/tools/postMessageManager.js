define(["require", "exports"], function (require, exports) {
    "use strict";
    let CALLBACK_MESSAGE_TYPE = '_CALLBACK_MESSAGE_TYPE_';
    class PostMessageManager {
        constructor(iframe) {
            this.messageId = 0;
            this.eventHandlers = {};
            this.callbacks = {};
            let self = this;
            if (iframe) {
                this.window = iframe.contentWindow;
            }
            else if (window.parent) {
                this.window = window.parent;
            }
            window.addEventListener('message', function (event) {
                let messageId = event.data.messageId;
                let command = event.data.command;
                let params = event.data.params;
                let callbackId = event.data.callbackId;
                // 如果是回调消息就在此返回吧
                if (command == CALLBACK_MESSAGE_TYPE && callbackId in self.callbacks) {
                    self.callbacks[callbackId](params);
                    delete self.callbacks[callbackId];
                    return;
                }
                if (command in self.eventHandlers) {
                    let action = self.eventHandlers[command];
                    if (action) {
                        action(params, function (message) {
                            self.window.postMessage({
                                command: CALLBACK_MESSAGE_TYPE,
                                params: message,
                                callbackId: messageId
                            }, '*');
                        });
                    }
                }
            });
        }
        on(command, handler) {
            this.eventHandlers[command] = handler;
        }
        post(command, params, callback) {
            let messageId = this.messageId++;
            this.window.postMessage({
                command: command,
                params: params,
                messageId: messageId
            }, '*');
            if (callback) {
                this.callbacks[messageId] = callback;
            }
        }
    }
    exports.PostMessageManager = PostMessageManager;
});
