'use strict';

//classe de acesso a portas seriais, para leitura de peso
const serport = require("serialport");

let conn = null;

exports.connect = function(port, baudRate, dataBits, stopBits, parity, callback) {
    conn = new serport(port, {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 2,
        parity: "none",
    });
    conn.open(function (err) {
        if (err) {
            callback(err.message, '');
        }
    });
}

exports.read = function(callback) {
    conn.open(function (err) {
        if (err) {
            callback(err.message, '');
        }
    });
    port.on('data', (data) => {
        console.log('Received: \t', data);
        //separar os dados recebidos e carregar
        let dados = [200, 2]; 
        callback('', dados);
    });
    close();
}

exports.close = function() {
    port.close();
}