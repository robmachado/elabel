'use strict';

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

let port;
let parser;

function conn(portdef) {
    port = new SerialPort(portdef);
    parser = port.pipe(new Readline({ delimiter: '\n' }));
}

function read(callback) {
    parser.on('data', (data) => {
        var res = data.split(" ");
        if (res[0] !== '**:') {
            if (res.length == 4) {
                var pB = res[1].replace(/[^0-9.,]+/g, "");
                var bruto = parseFloat(pB.replace(',', '.'));
                console.log(res);
            
                var pt = res[3].replace(/[^0-9.,]+/g, "");
                var tara = parseFloat(pt.replace(',', '.'));
                callback(bruto, tara);
            }
        }
    })
}

module.exports.conn = conn;
module.exports.read = read;