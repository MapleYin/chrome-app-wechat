System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EXEC_COOKIE_REG, BaseServer;
    return {
        setters:[],
        execute: function() {
            EXEC_COOKIE_REG = /<(\w+)>(?!<)(.+?)</g;
            BaseServer = class BaseServer {
                get(originUrl, params, headers, options) {
                    let message = {
                        url: originUrl,
                        method: 'GET',
                        headers: headers || {
                            'responseType': 'json'
                        },
                        query: params
                    };
                    return new Promise((resolve, reject) => {
                        chrome.runtime.sendMessage(message, (response) => {
                            if (response.status == 0) {
                                resolve(response.data);
                            }
                            else {
                                reject(response.message);
                            }
                        });
                    });
                }
                post(originUrl, params, postData, headers, options) {
                    let message = {
                        url: originUrl,
                        method: 'POST',
                        headers: headers || {
                            'responseType': 'json'
                        },
                        body: postData && JSON.stringify(postData),
                        query: params
                    };
                    return new Promise((resolve, reject) => {
                        chrome.runtime.sendMessage(message, (response) => {
                            if (response.status == 0) {
                                resolve(response.data);
                            }
                            else {
                                reject(response.message);
                            }
                        });
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
            };
            exports_1("BaseServer", BaseServer);
        }
    }
});
