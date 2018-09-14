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
        var pB = res[1].replace(/[^0-9.,]+/g, "");
        pB.replace(',', '.');
        //console.log(pB)
        callback(pB)
    })
}

module.exports.conn = conn;
module.exports.read = read;