'use strict';

//classe de acesso a portas seriais, para leitura de peso
const serport = require("serialport");

let conn;

function connect(port) {
    conn = new serport(
        port, {
            baudRate: 9600,
            dataBits: 8,
            stopBits: 2,
            parity: "none",
            autoOpen: false
        }
    );
    conn.on('error', function(err) {
        console.log('Error: ', err.message);
    });
}

function read(port,baud,dtBits,spBits,par,callback) {
    if (!conn) {
        connect(port);
    }
    conn.open(function (err) {
        if (err) {
            console.log("pos 2 : "+err);
            return;
        }
        console.log('open');
        conn.on('data', function(data) {
            console.log('data received: ' + data);
        });  
    });
    let dados = [200, 2]; 
    callback(null, dados);
    conn.close();
    conn = null;
}

module.exports.read = read;
