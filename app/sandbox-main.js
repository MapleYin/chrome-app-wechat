define(["require", "exports", './tools/sandbox'], function (require, exports, sandbox_1) {
    "use strict";
    requirejs.config({
        'baseUrl': 'app/',
        'urlArgs': 'bust=' + (new Date()).getTime()
    });
    new sandbox_1.Sandbox();
});
