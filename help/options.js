"use strict";
var optionator = require("optionator");

module.exports = optionator({
  prepend: "Usage: srt2ass [options] file_in.srt [file_out.ass]",
  options: [
    {
      heading: "Basic"
    },
    {
      option: "help",
      alias: "h",
      type: "Boolean",
      description: "displays help"
    },
    {
      option: "version",
      alias: "v",
      type: "Boolean",
      description: "Output the version number"
    },
    {
      heading: "Options"
    },
    {
      option: "init",
      type: "String",
      description: "Creates the config file .srt2assrc",
      example: "srt2ass --init test.ass"
    },
    {
      option: "dir",
      alias: "d",
      type: "Boolean",
      description: "Process all the srt files in the directory"
    }
  ]
});
