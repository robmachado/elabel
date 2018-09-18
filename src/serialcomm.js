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
            var pB = res[1].replace(/[^0-9.,]+/g, "");
            var bruto = parseFloat(pB.replace(',', '.'));
            //console.log(bruto);
            callback(bruto);
        }
    })
}

module.exports.conn = conn;
module.exports.read = read;