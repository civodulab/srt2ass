"use strict";
var optionator = require('optionator');

module.exports = optionator({
    prepend: 'Usage: srt2ass file_in.srt [file_out.ass]',
    options: [{
        option: 'help',
        alias: 'h',
        type: 'Boolean',
        description: 'displays help'
    }, {
        option: "version",
        alias: "v",
        type: "Boolean",
        description: "Output the version number"
    }]
});
