System.register(['./postMessageManager'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var postMessageManager_1;
    var Sandbox;
    return {
        setters:[
            function (postMessageManager_1_1) {
                postMessageManager_1 = postMessageManager_1_1;
            }],
        execute: function() {
            Sandbox = class Sandbox {
                constructor() {
                    this.postMessageManager = new postMessageManager_1.PostMessageManager();
                    this.setupEventListener();
                }
                setupEventListener() {
                    this.postMessageManager.on('eval', function (params, callback) {
                        if (params instanceof Array) {
                            let results = [];
                            for (var index in params) {
                                try {
                                    results.push(eval(params[index]));
                                }
                                catch (e) {
                                    console.error(e);
                                }
                            }
                            callback(results);
                        }
                        else {
                            try {
                                let result = eval(params);
                                callback(result);
                            }
                            catch (e) {
                                console.error(e);
                                callback();
                            }
                        }
                    });
                    this.postMessageManager.on('image', function (params, callback) {
                        $.ajax({
                            url: params,
                            dataType: 'blob',
                            xhrFields: {
                                responseType: 'blob'
                            },
                            success: function (data) {
                                console.log('LoadImageDone:' + params);
                                if (callback) {
                                    callback(URL.createObjectURL(data));
                                }
                            }
                        });
                    });
                }
            };
            exports_1("Sandbox", Sandbox);
        }
    }
});
