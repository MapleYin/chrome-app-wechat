define(["require", "exports", './controller/login'], function (require, exports, login_1) {
    "use strict";
    requirejs.config({
        'baseUrl': 'app/',
        'urlArgs': 'bust=' + (new Date()).getTime()
    });
    new login_1.Login();
});
