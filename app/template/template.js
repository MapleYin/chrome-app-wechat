System.register(['../servers/sourceServer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var sourceServer_1;
    var templateUniqueId, Template;
    return {
        setters:[
            function (sourceServer_1_1) {
                sourceServer_1 = sourceServer_1_1;
            }],
        execute: function() {
            templateUniqueId = 0;
            Template = class Template {
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
                        sourceServer_1.sourceServer.fetchUserHeadImage('https://wx.qq.com' + url).then((localUrl) => {
                            $image.attr('src', localUrl);
                        }).catch(reason => {
                            console.log(reason);
                        });
                    }
                }
            };
            exports_1("Template", Template);
        }
    }
});
