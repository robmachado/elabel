// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
function el(selector) {
    return document.getElementById(selector);
}

el('action-btn').addEventListener('click', function() {
    console.log("Botão acionado\n");
    getOP(function(rows){
        var html = '';
        rows.forEach(function(row){
            console.log(row);
         });
    });

},false);

el('printers-btn').addEventListener('click', function() {
    console.log("Botão Printers acionado\n");
    //Printer com letra maiuscula é a classe
    var Printer = require('node-printer');
    console.log(Printer.list());
    //com printer list carregar as opções no menu
    //ao selecionar a impressora alterar a variavel de ambiente e 
    //salvar a escolha em um json no disco
    //e ao carregar a aplicação, verificar se existe a configuração da 
    //impressora e se existir carregar essa opeção automaticamente como
    //forma de lembrar a escolha 
    //pinter com letra minuscula é a impressora

    //var printer = new Printer('EPSON_SX510');
    //ler o arquivo label_layout.dat e substituir os marcadores antes 
    //de enviar para a impressora
    var layout = 'Print text directly, when needed: e.g. barcode printers';
    var text = layout.replace('text','TROCADO');
    console.log(text);
    //var jobFromText = printer.printText(text);
    
    // Listen events from job
    //jobFromText.once('sent', function() {
    //    jobFromText.on('completed', function() {
    //        console.log('Job ' + jobFromText.identifier + 'has been printed');
    //        jobFromText.removeAllListeners();
    //    });
    //});    

},false);

el('fs-btn').addEventListener('click', function() {
    console.log("Botão FS acionado\n");
    //Printer com letra maiuscula é a classe
    var fs = require('fs');
    var stream = fs.createWriteStream("printer.json");
    stream.once('open', function(fd) {
        stream.write("{\n    \"name\":\"zebra\"\n}");
        stream.end();
    });   

},false);

function getOP(callback){
    var mysql = require('mysql');
    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host     : '192.168.1.4',
        user     : 'etiqueta',
        password : 'forever',
        database : 'opmigrate'
    });
    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    // Perform a query
    $query = "SELECT * FROM OP WHERE numop='68295'";
    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        callback(rows);
        console.log("Query succesfully executed");
     });
     // Close the connection
     connection.end(function(){
        // The connection has been closed
     });

}


