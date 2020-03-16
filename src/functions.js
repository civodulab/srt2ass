const monLog = require('./monLog');

module.exports = {
    timeASS: function (t) {
        const s = t.split(':');
        t = t.substring(0, 11);
        (s && s[0] === '00') && (t = t.substring(1, 11));
        return t;
    },

    writeLigne: function (objet) {
        return 'Style:' + Object.values(objet).join(',');
    },

    recupProcessArgv: function (argv) {
        let erreur = false;
        let file_in = '';
        let file_out = '';
        switch (argv._.length) {
            case 0:
                monLog.error('Vous devez entrer au moins le nom du fichier SRT.');
                erreur = true;
                break;
            case 1:
                file_in = argv._[0];
                file_out = file_in.split('.')[0] + '.ass';
                break;
            case 2:
                file_in = argv._[0];
                file_out = argv._[1];
                break;
            default:
                monLog.error('Vous ne pouvez entrer que 2 arguments max (File_in et/ou File_out).');
                erreur = true;
                break;
        }
        return {
            'file_in': file_in,
            'file_out': file_out,
            'erreur': erreur
        }
    }
}