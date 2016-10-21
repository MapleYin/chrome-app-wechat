define(["require", "exports", './app'], function (require, exports, app_1) {
    "use strict";
    window.onload = () => {
        new app_1.App(window['redirectUrl']);
    };
});
