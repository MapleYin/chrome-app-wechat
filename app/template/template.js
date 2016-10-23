define(["require", "exports", '../servers/sourceServer'], function (require, exports, sourceServer_1) {
    "use strict";
    var templateUniqueId = 0;
    class Template {
        constructor() {
            this.templateId = 0;
        }
        render(templateString, data) {
            this.templateId = templateUniqueId++;
            let replaceKeyArray = templateString.match(/{{.*?}}/g);
            for (var i = 0, count = replaceKeyArray.length; i < count; i++) {
                let key = replaceKeyArray[i];
                let reg = new RegExp(key, 'g');
                let value = data[key.slice(2, -2)] || '';
                templateString = templateString.replace(reg, value);
            }
            this.$element = $(templateString);
            this.loadSource(this.$element.find('img'));
        }
        loadSource($elements) {
            $elements.each((index, elem) => {
                let url = $(elem).data('src');
                if (url && url.search(/chrome-extension/) == -1) {
                    sourceServer_1.sourceServer.fetchSource(url).then((localUrl) => {
                        $(elem).attr('src', localUrl);
                    }).catch(reason => {
                        console.log(reason);
                    });
                }
            });
        }
    }
    exports.Template = Template;
});
