System.register(['./coreServer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var coreServer_1;
    var UserHeadImageCache, SourceServer, sourceServer;
    return {
        setters:[
            function (coreServer_1_1) {
                coreServer_1 = coreServer_1_1;
            }],
        execute: function() {
            UserHeadImageCache = {};
            SourceServer = class SourceServer extends coreServer_1.CoreServer {
                fetchUserHeadImage(url) {
                    if (url in UserHeadImageCache) {
                        return new Promise((resolve, reject) => {
                            console.log('Get UserHead Image From Cache!');
                            resolve(UserHeadImageCache[url]);
                        });
                    }
                    else {
                        return this.get(url, null, {
                            responseType: 'blob'
                        }).then(result => {
                            let objURL = URL.createObjectURL(result);
                            console.log('Get UserHead Image');
                            UserHeadImageCache[url] = objURL;
                            return objURL;
                        });
                    }
                }
            };
            exports_1("sourceServer", sourceServer = new SourceServer());
        }
    }
});
