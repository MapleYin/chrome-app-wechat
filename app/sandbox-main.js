System.register(['./tools/sandbox'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var sandbox_1;
    return {
        setters:[
            function (sandbox_1_1) {
                sandbox_1 = sandbox_1_1;
            }],
        execute: function() {
            new sandbox_1.Sandbox();
        }
    }
});
