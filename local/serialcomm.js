'use strict';

//classe de acesso a portas seriais, para leitura de peso
const SerialPort = require("serialport");

let conn;

function connect(port) {
    var conn = new SerialPort("/home/administrador/dev/ttyS41", function (err) {
        if(err) {
	        return console.log("Error: ", err.message);
        }
    }); 
    /*
    conn = new serport(
        port, {
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: "none",
            autoOpen: false
        }, true, function (err) {
            if(err) {
                console.log('Error: ', err.message);  
            }    
        }
    );

    //conn.on('error', function(err) {
    //    console.log('Error: ', err.message);
    //});
    */
    console.log("Sucesso");
}

function read(port,baud,dtBits,spBits,par,callback) {
     if (!conn) {
        connect(port);
     }
     if (conn.isOpen()) {
        //conn.on('data', funcrion(data) {
        //    console.log(data);
        //});
     }
    /*
    var myPort = new serialport("/home/administrador/dev/ttyS41", function (err) {
        if(err) {
	        return console.log("Error: ", err.message);
        }
        myPort.on('data', function (data) {
	        var firstvariable = "B:";
	        var secondvariable = "kg";
	        var regExString = new RegExp("(?:"+firstvariable+")(.*?)(?:"+secondvariable+")", "ig"); //set ig flag for global search and case insensitive
            var brut = regExString.exec(data);
	        if (brut && brut.length > 1) //RegEx has found something and has more than one entry.
	        {  
	            var brut = brut[1].trim();
                var brut = parseFloat(brut.replace(",", ".")).toFixed(2);
	            console.log("Bruto: " + brut); //is the matched group if found
	        }
	        var firstvariable = "T:";
	        var regExString = new RegExp("(?:"+firstvariable+")(.*?)(?:"+secondvariable+")", "ig"); //set ig flag for global search and case insensitive
	        var tara = regExString.exec(data);
	        if (tara && tara.length > 1) //RegEx has found something and has more than one entry.
	        {  
                var tara = tara[1].trim();
	            var tara = tara.replace(",", ".");
	            console.log("Tara: " + tara); //is the matched group if found
	    }
        //console.log('Data:' + data);
    });
});
*/
    /*
    if (!conn) {
        connect(port);
    }
    */
    /*
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
    */
    //let dados = [200, 2]; 
    //callback(null, dados);
    //conn.close();
    //conn = null;
}

module.exports.read = read;
