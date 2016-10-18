define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.ContactInListIndex = (list, params) => {
        return list.findIndex(value => {
            return value.UserName == params.UserName;
        });
    };
});
