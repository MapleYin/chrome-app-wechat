System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ContactInListIndex;
    return {
        setters:[],
        execute: function() {
            exports_1("ContactInListIndex", ContactInListIndex = (list, params) => {
                return list.findIndex(value => {
                    return value.UserName == params.UserName;
                });
            });
        }
    }
});
