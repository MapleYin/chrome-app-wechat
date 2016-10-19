System.register(['./app'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var app_1;
    return {
        setters:[
            function (app_1_1) {
                app_1 = app_1_1;
            }],
        execute: function() {
            chrome.storage.sync.get('redirectUrl', function (item) {
                new app_1.App(item.redirectUrl);
            });
        }
    }
});
