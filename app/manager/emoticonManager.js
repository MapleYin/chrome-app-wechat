System.register(['./baseManager', '../models/wxInterface'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var baseManager_1, wxInterface_1;
    var EmoticonManager, emoticonManager;
    return {
        setters:[
            function (baseManager_1_1) {
                baseManager_1 = baseManager_1_1;
            },
            function (wxInterface_1_1) {
                wxInterface_1 = wxInterface_1_1;
            }],
        execute: function() {
            EmoticonManager = class EmoticonManager extends baseManager_1.BaseManager {
                transformSpanToImg(text) {
                    if (text) {
                        text = text.replace(/<span.*?class="emoji emoji(.*?)"><\/span>/g, (str, substring) => {
                            let emoji = wxInterface_1.EmojiCodeMap[substring];
                            return emoji;
                        });
                    }
                    return text;
                }
                emoticonFormat(text) {
                    return text;
                }
            };
            exports_1("EmoticonManager", EmoticonManager);
            exports_1("emoticonManager", emoticonManager = new EmoticonManager());
        }
    }
});
