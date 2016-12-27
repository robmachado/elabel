//carrega a classe dotenv para leitura das configurações
//require('dotenv').config();

//classes principais
const { ipcRenderer, remote, shell } = require('electron');

//classe de gestão de dialogos
const { dialog } = remote;

//classe de manipulação de impressoras
//const printer = require('node-printer');
//classe de acesso a base de dados MySql
//const db = require('mysql');
//classe para manipulação dos campos de formulário
const form = document.querySelector('form');

//campos do formulário
const inputs = {
    numop: form.querySelector('input[name="numop"]'),
    op: form.querySelector('input[name="op"]'),
    code: form.querySelector('input[name="code"]'),
    desc: form.querySelector('input[name="desc"]'),
    numbob: form.querySelector('input[name="numbob"]'),
    maquina: form.querySelector('input[name="maquina"]'),
    operador: form.querySelector('input[name="operador"]'),
    pesoBruto: form.querySelector('input[name="pesoBruto"]'),
    tara: form.querySelector('input[name="tara"]'),
    pesoliq: form.querySelector('input[name="pesoLiquido"]'),
};

//botões do formulário
const buttons = {
    btnGetOP: document.getElementById('btnGetOP'),
    submit: form.querySelector('button[type="submit"]'),
};

//classe de acesso a portas seriais, para leitura de peso
//var sp = require("serialport");


//console.log(process.env.BASIC)


ipcRenderer.on('did-finish-load', () => {
    //carrega nomes das impressoras instaladas e escolher a que contém zebra
    //console.log(printer.list());
});

//chamado quando o processo foi realizado com sucesso
ipcRenderer.on('processing-did-succeed', (event, html) => {
    
});

//chamado quando o processamento falha 
ipcRenderer.on('processing-did-fail', (event, error) => {
    console.error(error);
    alert('Failed :\'(');
});

//quando o botão de escolha da OP for acionado
buttons.btnGetOP.addEventListener('click', () => {
    console.log('Esse é o numero: '+inputs.numop.value);
    //chamar o busca de dados na base e retornar os dados para o html
    //query(function(rows) {
    //    rows.forEach(function(row){
    //        console.log(row);
    //     });
    //});
    inputs.code.value = 'PEBD-S1234';
    inputs.desc.value = 'Teste de carregamento de dados';
    inputs.op.value = process.env.DB_HOST;
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
function query(callback) {
    var connection = db.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME
    });
    // connect to mysql
    connection.connect(function(err) {
        // in case of error
        if(err){
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    $query = "SELECT * FROM `orders` WHERE id='" + inputs.numop.value + "'";
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
