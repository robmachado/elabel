'use strict';

const SerialPort = require("serialport");
//const sp = serialport.serialport;

SerialPort.list((err, ports) => {
    ports.forEach((port) => {
        console.log(port.comName);
    });
});

/*
const sp = new SerialPort("/dev/ttyS0", {
    baudrate: 9600,
    parser: 
});
*/