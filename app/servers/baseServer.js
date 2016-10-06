define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (StatusCode) {
        StatusCode[StatusCode["success"] = 0] = "success";
        StatusCode[StatusCode["unauthorized"] = 100] = "unauthorized";
        StatusCode[StatusCode["accounterror"] = 101] = "accounterror";
        StatusCode[StatusCode["missparams"] = 200] = "missparams";
        StatusCode[StatusCode["universal"] = 500] = "universal";
    })(exports.StatusCode || (exports.StatusCode = {}));
    var StatusCode = exports.StatusCode;
    class BaseServer {
        constructor() {
        }
        post(url, params, options) {
            let body = JSON.stringify(params);
            let xhr = new XMLHttpRequest();
            for (var key in options) {
                xhr[key] = options[key];
            }
            xhr.open('POST', url);
            xhr.send(body);
            return this.eventHandler(xhr);
        }
        get(url, params, options) {
            let xhr = new XMLHttpRequest();
            if (params) {
                url += '?' + this.convertParamsToSearchString(params);
            }
            for (var key in options) {
                xhr[key] = options[key];
            }
            xhr.open('GET', url);
            xhr.send();
            return this.eventHandler(xhr);
        }
        eventHandler(xhr) {
            return new Promise(function (resolve, reject) {
                xhr.addEventListener('readystatechange', function () {
                    if (this.readyState === this.DONE) {
                        if (this.status == 200) {
                            resolve({
                                code: 0,
                                message: 'ok',
                                data: this.response
                            });
                        }
                        else {
                            resolve({
                                code: this.status,
                                message: this.response
                            });
                        }
                    }
                });
                xhr.addEventListener('error', function (error) {
                    reject(error);
                });
            });
        }
        setHttpHeader(xhr, headers) {
            var key;
            for (key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
        convertParamsToSearchString(params) {
            if (typeof params == 'object') {
                var paramsArray = [];
                for (var key in params) {
                    var value = params[key];
                    paramsArray.push(key + "=" + value);
                }
                return paramsArray.join('&');
            }
            else {
                return params;
            }
        }
    }
    exports.BaseServer = BaseServer;
});
