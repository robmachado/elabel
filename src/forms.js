'use strict';

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

