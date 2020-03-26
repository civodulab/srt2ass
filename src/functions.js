const monLog = require("./monLog");
const compileAss = require("ass-compiler").compile;
const fs = require("fs");
const path = require("path");
let scriptInfo = {};
let v4Styles = {};
let optionsDialogues = { defaultStyle: "" };
let srt_config;

function _options() {
  if (fs.existsSync("./.srt2assrc")) {
    srt_config = fs.readFileSync("./.srt2assrc", "utf8");
    srt_config = srt_config && JSON.parse(srt_config);
  } else {
    srt_config = require("./ass.config.default.json");
    console.log(srt_config);
  }
  scriptInfo = (srt_config.scriptInfo && srt_config.scriptInfo) || scriptInfo;
  v4Styles = (srt_config.v4Styles && srt_config.v4Styles) || v4Styles;
  optionsDialogues =
    (srt_config.optionsDialogues && srt_config.optionsDialogues) ||
    optionsDialogues;
}

module.exports = {
  options: function() {
    _options();
    return {
      scriptInfo: scriptInfo,
      v4Styles: v4Styles,
      optionsDialogues: optionsDialogues
    };
  },
  timeASS: function(t) {
    const s = t.split(":");
    t = t.substring(0, 11);
    s && s[0] === "00" && (t = t.substring(1, 11));
    return t;
  },

  writeLigne: function(objet) {
    return "Style:" + Object.values(objet).join(",");
  },
  init: function(assfile) {
    _options();
    let chemin = process.cwd();
    const rcPath = path.format({
      dir: chemin,
      base: ".srt2assrc"
    });
    // _writeInit(assfile);
    fs.writeFileSync(rcPath, JSON.stringify(_writeInit(assfile),null,2), "utf8");
    monLog.log("ass2vtt", rcPath, "généré");
  },
  recupProcessArgv: function(argv) {
    let erreur = false;
    let file_in = "";
    let file_out = "";
    switch (argv._.length) {
      case 0:
        monLog.error("Vous devez entrer au moins le nom du fichier SRT.");
        erreur = true;
        break;
      case 1:
        file_in = argv._[0];
        file_out = file_in.split(".")[0] + ".ass";
        break;
      case 2:
        file_in = argv._[0];
        file_out = argv._[1];
        break;
      default:
        monLog.error(
          "Vous ne pouvez entrer que 2 arguments max (File_in et/ou File_out)."
        );
        erreur = true;
        break;
    }
    return {
      file_in: file_in,
      file_out: file_out,
      erreur: erreur
    };
  }
};

function _writeInit(assfile) {
  const data = fs.readFileSync(assfile, "utf8");
  const parse = compileAss(data);
  v4Styles = Object.values(parse.styles).map(s => s.style);
  scriptInfo = parse.info;
  return {
    scriptInfo: scriptInfo,
    v4Styles: v4Styles,
    optionsDialogues: optionsDialogues
  };
}
