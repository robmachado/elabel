//'use strict';

const path = require('path');
const fs = require('fs');
const String = require('string');

function render(op, code, codcli, numbob, pl, pb, dateh) {
    let id = String(op).padLeft(9,'0') + String(numbob).padLeft(3,'0');
    let layout = path.join(__dirname, '/../assets/layouts/default_correto.dat');
    let data = fs.readFileSync(layout, 'utf8');
    data = data.replace('{lote}', op);
    data = data.replace('{cod}', code);
    data = data.replace('{peca}', String(numbob).padLeft(3, '0'));
    data = data.replace('{pbruto}', pb);
    data = data.replace('{pliq}', pl);
    data = data.replace('{id}', id);
    data = data.replace('{datahora}', dateh);
    data = data.replace('{codcli}', codcli);
    return data;
}

module.exports.render = render;