
//carrega a classe dotenv para leitura das configurações
//e lê automaticamente o arquivo .ENV nessa mesma pasta
require('dotenv').config();

//classes principais do electron
const { ipcRenderer, remote, shell } = require('electron');

//classe de gestão de dialogos
const { dialog } = remote;

//classe de montagem de paths
const path = require('path');

//classe de acesso ao disco
const fs = require('fs');

//classe de manipulação de impressoras
//const printer = require('./src/localprinter');
const printer = require('printer');

//classe de manipulação das etiquetas
const label = require('./src/label');

//classe de acesso a portas seriais, para leitura de peso
const serial = require("./src/serialcomm");

//classe de acesso a base de dados MySql
const mydb = require('./src/database');

//classe para manipulação de datas
const moment = require('moment');

//classe de controle de tempo
const nanotimer = require('nanotimer');

//classe para manipulação dos campos de formulário
const form = document.querySelector('form');

//define os campos do formulário
const inputs = {
    numop: form.querySelector('input[name="numop"]'),
    op: form.querySelector('input[name="op"]'),
    code: form.querySelector('input[name="code"]'),
    desc: form.querySelector('input[name="desc"]'),
    numbob: form.querySelector('input[name="numbob"]'),
    pesoBruto: form.querySelector('input[name="pesoBruto"]'),
    tara: form.querySelector('input[name="tara"]'),
    pesoliq: form.querySelector('input[name="pesoLiquido"]')
};

//define os botões do formulário
const buttons = {
    btnGetOP: document.getElementById('btnGetOP'),
    submit: form.querySelector('button[type="submit"]'),
};

//entrada 
ipcRenderer.on('did-finish-load', () => {
    //procura por zebra e habilita somente se encontrar
    //if (printer.exists(process.env.PRINTER) || process.env.PRINTER == "file") {
        document.querySelector('button[type="submit"]').disabled = false;
        //printer.set(process.env.PRINTER);
    //} else {
    //    document.getElementById('alertaPrinter').style.display = 'block';
    //}
    //põe foco na entrada da OP
    inputs.numop.focus();
});

//quando o peso bruto é modificado
inputs.pesoBruto.addEventListener('change', () => {
    calcula();
});

//qunado a tara é modificada
inputs.tara.addEventListener('change', () => {
    calcula();
});

//calcula o peso liquido
function calcula() {
    var num = inputs.pesoBruto.value - inputs.tara.value;
    inputs.pesoliq.value = num.toFixed(2);
}

//chamado quando o processo foi realizado com sucesso
ipcRenderer.on('processing-did-succeed', (event, html) => {
    
});

//chamado quando o processamento falha 
ipcRenderer.on('processing-did-fail', (event, error) => {
    console.error(error);
    alert('Failed :\'(');
});

//quando o numero da OP estiver em foco e o ENTER for acionado
inputs.numop.addEventListener('keydown', function(event) {
    if (`${event.code}` == 'NumpadEnter' || `${event.code}` == 'Enter')  {
        opclick();    
    }
});

//quando o botão de escolha da OP for acionado
buttons.btnGetOP.addEventListener('click', () => {
    opclick();
});

//evento click no botão de busca da OP foi acionado
function opclick() {
    //usa a classe mydb para buscar os dados da OP
    mydb.getOP(inputs.numop.value, function(err, rows) {
        if (err) {
            console.log("Capturou o erro ... "+err);
            return;
        }
        if (rows == '') {
            document.querySelector('button[type="submit"]').disabled = true;
            return;
        }
        if (document.getElementById('alertaPrinter').style.display == 'none') {
            document.querySelector('button[type="submit"]').disabled = false;
        }
        let num = rows[0].num+1;
        inputs.code.value = rows[0].code;     
        inputs.desc.value = rows[0].description;
        inputs.op.value = rows[0].id ;
        inputs.numbob.value = num;
        inputs.tara.value = '0.6';
        buttons.submit.focus();
        readPeso();
    });
}


let count = 100;
let timer;

//inicia o cronometro para ler a porta serial a cada 2 seg

function readPeso() {
    serial.conn(process.env.SERIAL_PORT);
    serial.read((pB) => {
        inputs.pesoBruto.value = pB;
        calcula();
    })
    //timer = new nanotimer();
    //timer.setInterval(countDown, '', '2s');
}



/*
//inicia o cronometro
function countDown() {
    count--; //decrementa
    serial.read((pB) => {
        inputs.pesoBruto.value = pB;
        inputs.tara.value = 1;
        calcula();
    }) 
    
    serial.read(
        process.env.SERIAL_PORT,
        process.env.SERIAL_BAUD,
        process.env.SERIAL_DATABITS,
        process.env.SERIAL_STOPBITS,
        process.env.SERIAL_PARITY,
        function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            inputs.pesoBruto.value = data[0];
            inputs.tara.value = data[1];
            calcula();
        }
    );
    
}*/
/*
//paraliza o cronometro 
function liftOff() {
    timer.clearInterval();
}
*/
//quando o botão submit for acionado 
//gravar os dados na base
//enviar a etiqueta para a impressora
//se sucesso, limpar os dados para a proxima
//se fracasso, avisar o operador 
form.addEventListener('submit', (event) => {
    event.preventDefault();
    //liftOff();
    let dateh = moment().format('YYYY-MM-DD HH:mm:ss');
    var codigo = inputs.code.value;
    var code = codigo.trim();
    var pl = inputs.pesoliq.value;
    var pb = inputs.pesoBruto.value;
    var order_id = inputs.op.value;
    var seq = inputs.numbob.value;
    //pl = pl.replace(',', '.');
    //pb = pb.replace(',', '.');    
    mydb.save(order_id, seq, pl, pb, dateh);
    let layout = label.render(order_id,code,seq,pl,pb,dateh);
    console.log('default printer name: ' + (printer.getDefaultPrinterName() || 'is not defined on your computer'));
    console.log(layout);
    //printer.print(layout);
    printer.printDirect({
        data: layout,
		type: "RAW",
		success: function(){
			console.log("printed: "+barcode_text);
		},
		error: function(err){console.log(err);}
    });
    ipcRenderer.send('did-submit-form', {
        sucesso: true,
    });
    form.reset();
    inputs.numop.focus();
});