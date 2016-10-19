System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var fetchRemoteImage, throttle, reEscape, reUnescape, oEscape, oUnescape, fnEscape, fnUnescape, escape, unescape;
    return {
        setters:[],
        execute: function() {
            exports_1("fetchRemoteImage", fetchRemoteImage = function (url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.responseType = 'blob';
                xhr.onload = function (e) {
                    if (callback) {
                        callback(URL.createObjectURL(this.response));
                    }
                };
                xhr.send();
            });
            throttle = (fn) => {
            };
            reEscape = /[&<>'"]/g;
            reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
            oEscape = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
            oUnescape = { '&amp;': '&', '&#38;': '&', '&lt;': '<', '&#60;': '<', '&gt;': '>', '&#62;': '>', '&apos;': "'", '&#39;': "'", '&quot;': '"', '&#34;': '"' };
            fnEscape = function (m) { return oEscape[m]; };
            fnUnescape = function (m) { return oUnescape[m]; };
            exports_1("escape", escape = function (str) { return str.replace(reEscape, fnEscape); });
            exports_1("unescape", unescape = function (str) { return str.replace(reUnescape, fnUnescape); });
        }
    }
});
