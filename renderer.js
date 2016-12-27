//'use strict';

//carrega a classe dotenv para leitura das configurações
//e lê automaticamente o arquivo .ENV nessa mesma pasta
require('dotenv').config();

//classes principais
const { ipcRenderer, remote, shell } = require('electron');

//classe de gestão de dialogos
const { dialog } = remote;

const path = require('path');

const fs = require('fs');

//classe de manipulação de impressoras
const printer = require('node-printer');

//classe de acesso a base de dados MySql
const db = require('mysql');

//classe para manipulação de datas
const moment = require('moment');

const nanotimer = require('nanotimer');

//classe para manipulação dos campos de formulário
const form = document.querySelector('form');

//campos do formulário
const inputs = {
    numop: form.querySelector('input[name="numop"]'),
    op: form.querySelector('input[name="op"]'),
    code: form.querySelector('input[name="code"]'),
    desc: form.querySelector('input[name="desc"]'),
    numbob: form.querySelector('input[name="numbob"]'),
    pesoBruto: form.querySelector('input[name="pesoBruto"]'),
    tara: form.querySelector('input[name="tara"]'),
    pesoliq: form.querySelector('input[name="pesoLiquido"]'),
};

//botões do formulário
const buttons = {
    btnGetOP: document.getElementById('btnGetOP'),
    submit: form.querySelector('button[type="submit"]'),
};

inputs.pesoBruto.addEventListener('change', () => {
    calcula();
});

inputs.tara.addEventListener('change', () => {
    calcula();
});

function calcula() {
    inputs.pesoliq.value = inputs.pesoBruto.value - inputs.tara.value;
}

//classe de acesso a portas seriais, para leitura de peso
//var sp = require("serialport");

//console.log(process.env.BASIC)

ipcRenderer.on('did-finish-load', () => {
    //procura por zebra e habilita somente se encontrar
    if (printer.match('newZebra')) {
        //document.querySelector('button[type="submit"]').disabled = false;
    } else {
        document.getElementById('alertaPrinter').style.display = 'block';
    }
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
    getOP(function(rows) {
        if (rows == '') {
            document.querySelector('button[type="submit"]').disabled = true;
            return;
        }
        if (document.getElementById('alertaPrinter').style.display == 'none') {
            document.querySelector('button[type="submit"]').disabled = false;
        }
        inputs.code.value = rows[0].code;     
        inputs.desc.value = rows[0].description;
        inputs.op.value = rows[0].id ;
        inputs.numbob.value = rows[0].seq + 1;
        readPeso();
    });
});
let count = 99;
let dataHora;
let timer;
function readPeso() {
    timer = new nanotimer();
    timer.setInterval(countDown, '', '2s');
    //timer.setTimeout(liftOff, [timer], '15s');
}

function countDown() {
    console.log('T - ' + count);
    count--;
    //aqui executar a leitura do peso da balança
    inputs.pesoBruto.value = "121."+count;
    calcula();
}
 
function liftOff(timer){
    timer.clearInterval();
    console.log('And we have liftoff!');
}

/*
buttons.submit.addEventListener('click', () => {
    saveBobina();
});
*/

//quando o botão submit for acionado 
//gravar os dados na base
//enviar a etiqueta para a impressora
//se sucesso, limpar os dados para a proxima
//se fracasso, avisar o operador 
form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Acionado');
    liftOff(timer);
    saveBobina();
    printLabel(); 
    ipcRenderer.send('did-submit-form', {
        sucesso: true,
    });
});

function clearFields() {
    inputs.code.value = '';     
    inputs.desc.value = '';
    inputs.op.value = '';
    inputs.numbob.value = '';
    inputs.pesoliq.value = '';
    inputs.tara.value = '';
    inputs.pesoBruto.value = '';
}

//executa a query na base de dados
function getOP(callback) {
    clearFields();
    let connection = db.createConnection({
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
    $query = "SELECT ord.id, ord.code, ord.description, ext.seq FROM orders ord LEFT JOIN extruders ext ON ext.orders_id = ord.id WHERE ord.id='" + inputs.numop.value + "'";
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

function saveBobina() {
    let connection = db.createConnection({
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
    //let data = new Date().toISOString().slice(0, 19).replace('T', ' ');
    dataHora = moment().format('YYYY-MM-DD HH:mm:ss');
    $query = "INSERT INTO extruders (orders_id, seq, pliq, pbruto, data) VALUES ('"
        + inputs.numop.value 
        + "','"
        + inputs.numbob.value
        + "','"
        + inputs.pesoliq.value
        + "','"
        + inputs.pesoBruto.value
        + "','" 
        +  dataHora
        + "')";
    console.log($query);    
    /*
    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        callback(rows);
        //return rows;
        console.log("Query succesfully executed");
     });
     */
     // Close the connection
     connection.end(function(){
        // The connection has been closed
     });    
}

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

function printLabel() {
    let layoutPath = path.join(__dirname, 'label_layout_epl2.dat');
    fs.readFile(layoutPath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        let id = inputs.op.value.lpad('0',7)+''+inputs.numbob.value.lpad('0',3);

        data = data.replace('{lote}', inputs.op.value);
        data = data.replace('{cod}', inputs.code.value);
        data = data.replace('{peca}', inputs.numbob.value);
        data = data.replace('{pbruto}', inputs.pesoBruto.value);
        data = data.replace('{pliq}', inputs.pesoliq.value);
        data = data.replace('{id}', id);
        data = data.replace('{datahora}', dataHora);
        console.log(data);    
    });
    
}


