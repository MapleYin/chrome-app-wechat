define(["require", "exports", './coreServer'], function (require, exports, coreServer_1) {
    "use strict";
    let UserHeadImageCache = {};
    class SourceServer extends coreServer_1.CoreServer {
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
                }).then(response => {
                    return response.blob().then(function (data) {
                        let objURL = URL.createObjectURL(data);
                        console.log('Get UserHead Image');
                        UserHeadImageCache[url] = objURL;
                        return objURL;
                    });
                });
            }
        }
    }
    exports.sourceServer = new SourceServer();
});
