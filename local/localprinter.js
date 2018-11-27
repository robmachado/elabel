//'use strict';

//classe de manipulação de impressoras
const printer = require('printer');

let localPrinterName = undefined;

//function exists(name) {
//    return printer.match(name);
//}

//function set(name) {
 //   localPrinterName = name;
//}

function print(layout) {
    
    //let zebra = new printer(localPrinterName);
    //let jobFromText = zebra.printText(layout);
}

module.exports.exists = exists;
module.exports.set = set;
module.exports.print = print;
