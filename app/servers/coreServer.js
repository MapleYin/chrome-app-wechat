System.register(['./baseServer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var baseServer_1;
    var CoreServer;
    return {
        setters:[
            function (baseServer_1_1) {
                baseServer_1 = baseServer_1_1;
            }],
        execute: function() {
            CoreServer = class CoreServer extends baseServer_1.BaseServer {
                constructor() {
                    super(...arguments);
                    this.class = CoreServer;
                }
                static baseRequest() {
                    return {
                        Uin: this.Uin,
                        Sid: this.Sid,
                        Skey: this.Skey,
                        DeviceID: this.getDeviceID()
                    };
                }
                static getDeviceID() {
                    return "e" + ("" + Math.random().toFixed(15)).substring(2, 17);
                }
                commonJsonPost(urlString, urlParams, postData) {
                    let url = new URL(urlString);
                    for (var key in urlParams) {
                        url['searchParams'].append(key, urlParams[key]);
                    }
                    if (postData) {
                        postData['BaseRequest'] = CoreServer.baseRequest();
                    }
                    else {
                        postData = {
                            BaseRequest: CoreServer.baseRequest()
                        };
                    }
                    return this.post(url.toString(), postData);
                }
            };
            exports_1("CoreServer", CoreServer);
        }
    }
});
