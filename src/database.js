'use strict';

//carrega a classe dotenv para leitura das configurações
//e lê automaticamente o arquivo .ENV nessa mesma pasta
require('dotenv').config();

//classe de acesso a base de dados MySql
const db = require('mysql');

//executa a query na base de dados
function getOP(numop, callback) {
    //cria a conexão com a base de dados
    let connection = db.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME
    });
    // connecta com o mysql
    connection.connect(function(err) {
        // em caso de erro
        if(err){
            callback(new Error(err.message), null);
            //console.log(err.code);
            //console.log(err.fatal);
            return;
        }
    });
    //monta a query
    let $query = "SELECT ord.id,ord.code,ord.description,max(ext.seq) as num FROM orders ord LEFT JOIN extruders ext ON ext.orders_id = ord.id WHERE ord.id='" + numop + "'";
    //console.log($query);
//callback(new Error('Forcei um erro'), null);
    connection.query($query, function(err, rows, fields) {
        if(err){
            callback(new Error(err.message), null);
            //console.log("An error ocurred performing the query.");
            //console.log(err);
            return;
        }
        callback(null, rows);
        console.log("Query succesfully executed");
     });
     // Close the connection
     connection.end(function(){
        // The connection has been closed
        console.log("The connection has been closed");
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
    //dataHora = moment().format('YYYY-MM-DD HH:mm:ss');
    var pl = inputs.pesoliq.value;
    var pb = inputs.pesoBruto.value;
    pl = pl.replace(',', '.');
    pb = pb.replace(',', '.');
    let $query = "INSERT INTO extruders (orders_id, seq, pliq, pbruto, data) VALUES ('"
        + inputs.op.value 
        + "','"
        + inputs.numbob.value
        + "','"
        + pl
        + "','"
        + pb
        + "','" 
        +  dataHora
        + "')";
    console.log($query);
    //let id = inputs.op.value.lpad('0',7)+''+inputs.numbob.value.lpad('0',3);
    //printLabel(id,inputs.op.value,inputs.code.value,inputs.numbob.value,pl,pb,dataHora);
    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        //callback(rows);
        //return rows;
        console.log("Query succesfully executed");
     });
     
     // Close the connection
     connection.end(function() {
        // The connection has been closed
     });    
    
}

module.exports.getOP = getOP;
module.exports.saveBobina = saveBobina;