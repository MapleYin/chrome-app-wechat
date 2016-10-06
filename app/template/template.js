define(["require", "exports", '../tools/chromeTools'], function (require, exports, chromeTools_1) {
    "use strict";
    var templateUniqueId = 0;
    class Template {
        constructor(templateString) {
            this.templateId = 0;
            this.templateString = templateString;
        }
        render(data) {
            this.templateId = templateUniqueId++;
            var templateString = this.templateString;
            let replaceKeyArray = templateString.match(/{{.*?}}/g);
            for (var i = 0, count = replaceKeyArray.length; i < count; i++) {
                let key = replaceKeyArray[i];
                let reg = new RegExp(key, 'g');
                let value = data[key.slice(2, -2)] || '';
                templateString = templateString.replace(reg, value);
            }
            this.$element = $(templateString);
            this.loadImage(this.$element);
        }
        loadImage($element) {
            let $image = $element.find('img');
            let url = $image.data('src');
            if (url && url.search(/chrome-extension/) == -1) {
                chromeTools_1.fetchRemoteImage('https://wx.qq.com' + url, function (localUrl) {
                    $image.attr('src', localUrl);
                });
            }
        }
    }
    exports.Template = Template;
});
