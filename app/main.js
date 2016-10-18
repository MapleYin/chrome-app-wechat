define(["require", "exports", './app'], function (require, exports, app_1) {
    "use strict";
    chrome.storage.sync.get('redirectUrl', function (item) {
        new app_1.App(item.redirectUrl);
    });
});
