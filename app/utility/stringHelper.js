define(["require", "exports"], function (require, exports) {
    "use strict";
    let REG_EMOJI_ENCODE = /<span class="(emoji emoji[a-zA-Z0-9]+)"><\/span>/g;
    let REG_EMOJI_DECODE = /###__EMOJI__(emoji emoji[a-zA-Z0-9]+)__###/g;
    exports.htmlDecode = (text) => {
        return text && 0 != text.length ? text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&") : "";
    };
    exports.htmlEncode = (text) => {
        return typeof text == 'string' ? text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
    };
    let x2js = new X2JS();
    exports.xml2Json = (text) => {
        text = text.replace(/<(\w*)\s*\/>\s*/g, '');
        let resault = x2js.xml_str2json(text);
        return resault;
    };
    exports.encodeEmoji = (text) => {
        text = text || "";
        text = text.replace(REG_EMOJI_ENCODE, '###__EMOJI__$1__###');
        return text;
    };
    exports.decodeEmoji = (text) => {
        text = text || "";
        text = text.replace(REG_EMOJI_DECODE, '<span class="$1"></span>');
        return text;
    };
    exports.formatNum = (num, fixed) => {
        var numString = (isNaN(num) ? 0 : num).toString(), appendCount = fixed - numString.length;
        return appendCount > 0 ? [new Array(appendCount + 1).join("0"), numString].join("") : numString;
    };
});
