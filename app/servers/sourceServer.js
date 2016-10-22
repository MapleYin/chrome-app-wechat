define(["require", "exports", './coreServer'], function (require, exports, coreServer_1) {
    "use strict";
    let sourceCache = {};
    class SourceServer extends coreServer_1.CoreServer {
        fetchSource(url) {
            if (url in sourceCache) {
                return new Promise((resolve, reject) => {
                    console.log('Get Source From Cache!');
                    resolve(sourceCache[url]);
                });
            }
            else {
                return this.get(url, null, {
                    responseType: 'blob'
                }).then(response => {
                    return response.blob().then(function (data) {
                        let objURL = URL.createObjectURL(data);
                        console.log('Get Source Done');
                        sourceCache[url] = objURL;
                        return objURL;
                    });
                });
            }
        }
    }
    exports.sourceServer = new SourceServer();
});
