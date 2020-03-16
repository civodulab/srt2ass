'use strict';
/**Couleur pour la console (juste pour faire beau :) )
 * monLog.log('nomEntreCrochet', nomDuFichier, 'texte');
 * exemple :  monLog.log('ass2vtt', vttFileAccessible.split('\\').pop(), 'généré')
 * sortie console : [ass2vtt] Fichier LM_LA_PULSE.vtt généré
 * 
 */

const colors=require('colors');

function log(txtCrochet, fichier, etat) {
    console.log('[' + colors.red(txtCrochet) + ']', 'Fichier ' + colors.cyan(fichier)+' '+colors.green(etat));
}

function error(txt) {
    console.log('\u26A0  '+colors.red(txt)+'  \u26A0');
}

module.exports = {
    log,
    error
}