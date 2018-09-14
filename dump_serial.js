'use strict';

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort('/dev/pts/19');
const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', (data) => {
    var res = data.split(" ");
    var pB = res[1].replace(/[^0-9.,]+/g, "");
    console.log(pB)
})