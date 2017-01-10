'use strict';

const path = require('path');
const fs = require('fs');
const String = require('string');

function label(id, op, code, numbob, pl, pb, datahora) {
    let layoutPath = path.join(__dirname, '/assets/layouts/default_epl2.dat');
    fs.readFile(layoutPath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        data = data.replace('{lote}', op);
        data = data.replace('{cod}', code);
        data = data.replace('{peca}', String(numbob).padLeft(3, '0'));
        data = data.replace('{pbruto}', pb);
        data = data.replace('{pliq}', pl);
        data = data.replace('{id}', id);
        data = data.replace('{datahora}', dataHora);
        return data;
    });
}

module.exports.label = label;