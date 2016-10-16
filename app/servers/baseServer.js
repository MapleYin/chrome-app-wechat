define(["require", "exports"], function (require, exports) {
    "use strict";
    let EXEC_COOKIE_REG = /<(\w+)>(?!<)(.+?)</g;
    class BaseServer {
        constructor() {
        }
        get(originUrl, params, headers, options) {
            let url = new URL(originUrl);
            for (var key in params) {
                url['searchParams'].append(key, params[key]);
            }
            return fetch(url.toString(), {
                credentials: 'include',
                headers: headers
            });
        }
        post(originUrl, params, headers, options) {
            let url = new URL(originUrl);
            for (var key in params) {
                url['searchParams'].append(key, params[key]);
            }
            return fetch(url.toString(), {
                credentials: 'include',
                body: params,
                headers: headers
            });
        }
        convertXMLToJSON(XMLString) {
            var json = {}, result;
            while (result = EXEC_COOKIE_REG.exec(XMLString)) {
                if (result.length == 3) {
                    json[result[1]] = result[2];
                }
            }
            return json;
        }
        getTimeStamp() {
            return +new Date();
        }
    }
    exports.BaseServer = BaseServer;
});
