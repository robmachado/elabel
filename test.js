var serialport = require('serialport');

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

//myPort.open(function (err) {
//    if(err) {
//	return console.log("Error opening port", err.message);
//    }
//    myPort.on('data', function (data) {
//       console.log('Data: ' + data);
//    });
//});


//serport.list(function (err, ports) {
//    ports.forEach(function(port) {
//        console.log(port.comName);
//    });
//});

//var name = process.argv[2];
//console.log("Alo, e benvindo ao node, " + name);



