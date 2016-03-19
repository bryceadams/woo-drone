'use strict';

exports.stringify = function (string, emitUnicode) {
    var json = JSON.stringify(string);

    return emitUnicode ? json : json.replace(/\//g, function(c) {
        return '\\/';
    }).replace(/[\u003c\u003e]/g, function(c) {
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4).toUpperCase();
    }).replace(/[\u007f-\uffff]/g, function(c) {
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
    });
};
