define(["require", "exports", './baseManager', '../models/wxInterface'], function (require, exports, baseManager_1, wxInterface_1) {
    "use strict";
    class EmoticonManager extends baseManager_1.BaseManager {
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
    }
    exports.EmoticonManager = EmoticonManager;
    exports.emoticonManager = new EmoticonManager();
});
