'use strict';

var SerialPort = require('serialport');

let conn;

if(!conn) {
   connect();
}

if (conn.isOpen) {
   conn.on('data', function (data) {
        var buf = Buffer.from(data);
   	console.log(buf.toString('ascii'));		
   });
   //console.log(conn.read(50)); 	

}

function connect()
{
    conn = new SerialPort("/home/administrador/dev/ttyS41", {
            lock: true, 
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: "none",
            autoOpen: true,
        }, function (err) {
    	if(err) {
	    return console.log("Error: ", err.message);
    	}
    }); 		
}
