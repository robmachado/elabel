const { ipcRenderer, remote, shell } = require('electron');
const { dialog } = remote;

const Printer = require('node-printer');
const BD = require('mysql');

const form = document.querySelector('form');

const inputs = {
    numop: form.querySelector('input[name="numop"]'),
    code: form.querySelector('input[name="code"]'),
    desc: form.querySelector('input[name="desc"]'),
    numbob: form.querySelector('input[name="numbob"]'),
    maquina: form.querySelector('input[name="maquina"]'),
    operador: form.querySelector('input[name="operador"]'),
    pesoBruto: form.querySelector('input[name="pesoBruto"]'),
    tara: form.querySelector('input[name="tara"]'),
    pesoliq: form.querySelector('input[name="pesoLiquido"]'),
};

const buttons = {
    chooseOP: document.getElementById('chooseOP'),
    submit: form.querySelector('button[type="submit"]'),
};

ipcRenderer.on('did-finish-load', () => {
    //carregar nomas das impressoras instaladas e escolher a que contém zebra
    console.log(Printer.list());
});

//chamado qunado o processo realizado com sucesso
ipcRenderer.on('processing-did-succeed', (event, html) => {
    
});

//chamado quando o processamento falha 
ipcRenderer.on('processing-did-fail', (event, error) => {
    console.error(error);
    alert('Failed :\'(');
});

//qunado o botão de escolha da OP for acionado
buttons.chooseOP.addEventListener('click', () => {
    console.log('Esse é o numero: '+inputs.numop.value);
    //chamar o busca de dados na base e retornar os dados para o html
    inputs.code.value = 'PEBD-S1234';
    inputs.desc.value = 'Teste de carregamento de dados';
});

//quando o botão submit for acionado 
//gravar os dados na base
//enviar a etiqueta para a impressora
//se sucesso, limpar os dados para a proxima
//se fracasso, avisar o operador 
form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Acionado');
    ipcRenderer.send('did-submit-form', {
        sucesso: true,
    });
});


/*
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
function el(selector) {
    return document.getElementById(selector);
}

el('action-btn').addEventListener('click', function() {
    console.log("Botão acionado\n");
    
    getOP(function(rows) {
        
        rows.forEach(function(row){
            console.log(row);
         });
    });

},false);

el('printers-btn').addEventListener('click', function() {
    console.log("Botão Printers acionado\n");
    let num = el('numop').nodeValue;
    console.log("NUM:" + num);
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
        host     : 'localhost',
        user     : 'etiqueta',
        password : 'forever',
        database : 'blabel'
    });
    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    let num = 67515;
    console.log("NUM :" + num);
    // Perform a query
    $query = "SELECT * FROM `orders` WHERE id='" + num + "'";
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
*/

