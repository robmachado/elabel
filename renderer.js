
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
//const printer = require('printer');
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
    shelflife: form.querySelector('input[name="shelflife"]'),
    numop: form.querySelector('input[name="numop"]'),
    op: form.querySelector('input[name="op"]'),
    code: form.querySelector('input[name="code"]'),
    codcli: form.querySelector('input[name="codcli"]'),
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
    document.querySelector('button[type="submit"]').disabled = false;
    inputs.numop.focus();
});

//quando o peso bruto é modificado
inputs.pesoBruto.addEventListener('change', () => {
    calcula();
});
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
        let tara = 0;
        if (rows[0].tara !== null) {
            tara = rows[0].tara;
        }
        tara.toFixed(2); 
        inputs.shelflife.value = rows[0].shelflife;
        inputs.code.value = rows[0].code;
        inputs.codcli.value = rows[0].customercode;
        inputs.desc.value = rows[0].description;
        inputs.op.value = rows[0].id;
        inputs.numbob.value = num;
        inputs.tara.value = tara;
        buttons.submit.focus();
        readPeso();
    });
}

function readPeso() {
    serial.conn(process.env.SERIAL_PORT);
    serial.read((pB, tara) => {
        if (tara > 0) {
            let p = pB + 0;
            let t = tara + 0;
            inputs.pesoliq.value = p.toFixed(2);
            inputs.tara.value = t.toFixed(2);
            let num = pB + tara;
            inputs.pesoBruto.value = num.toFixed(2);
        } else {
            let p = pB + 0;
            inputs.pesoBruto.value = p.toFixed(2);
            calcula();
        }
    })
}


//quando o botão submit for acionado 
//gravar os dados na base
//enviar a etiqueta para a impressora
//se sucesso, limpar os dados para a proxima
//se fracasso, avisar o operador 
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let sl = inputs.shelflife.value;
    let dateh = moment().format('YYYY-MM-DD HH:mm:ss');
    var codigo = inputs.code.value;
    var code = codigo.trim();
    var ccli = inputs.codcli.value;
    var codcli = ccli.trim();
    var pl = inputs.pesoliq.value;
    var pb = inputs.pesoBruto.value;
    var order_id = inputs.op.value;
    var seq = inputs.numbob.value;
    var validade = moment(dateh, "YYYY-MM-DD HH:mm:ss").add(sl, 'days').format('YYYY-MM-DD');
    mydb.save(order_id, seq, pl, pb, dateh);
    let layout = label.render(order_id,code,codcli,seq,pl,pb,dateh,validade);
    console.log('default printer name: ' + (printer.getDefaultPrinterName() || 'is not defined on your computer'));
    console.log(layout);
    printer.printDirect({
        data: layout,
		type: "RAW",
		success: function(){
			console.log("printed: SUCCESS");
		},
		error: function(err){console.log(err);}
    });
    ipcRenderer.send('did-submit-form', {
        sucesso: true,
    });
    form.reset();
    inputs.numop.focus();
});