define(["require", "exports", './baseServer', '../tools/postMessageManager'], function (require, exports, baseServer_1, postMessageManager_1) {
    "use strict";
    class UserServer extends baseServer_1.BaseServer {
        constructor() {
            super();
            this.$sandbox = $('#sandbox')[0];
            this.postMessageManager = new postMessageManager_1.PostMessageManager(this.$sandbox);
        }
    }
    exports.UserServer = UserServer;
});
