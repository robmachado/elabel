//'use strict';

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
            return;
        }
    });
    //monta a query
    //let query = "SELECT ord.id,ord.code,ord.customercode,ord.description,max(ext.seq) as num FROM orders ord LEFT JOIN extruders ext ON ext.orders_id = ord.id WHERE ord.id='" + numop + "'";
    let query = "SELECT ord.id, ord.code, ord.customercode, ord.description, ROUND(ext.pbruto - ext.pliq,2) AS tara, MAX( ext.seq ) AS num FROM orders ord LEFT JOIN extruders ext ON ext.orders_id = ord.id WHERE ord.id='" + numop + "'";
    connection.query(query, function(err, rows, fields) {
        if(err){
            callback(new Error(err.message), null);
            return;
        }
        callback(null, rows);
        console.log("Query succesfully executed");
     });
     // Close the connection
     connection.end(function() {
        // The connection has been closed
        console.log("The connection has been closed");
     });
}

function save(orders_id, seq, pliq, pbruto, data) {
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
    let $query = "INSERT INTO extruders (orders_id, seq, pliq, pbruto, data) VALUES ('"
        + orders_id 
        + "','"
        + seq
        + "','"
        + pliq
        + "','"
        + pbruto
        + "','" 
        +  data
        + "')";
    console.log($query);
    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        console.log("Query succesfully executed");
     });
     
     // Close the connection
     connection.end(function() {
        // The connection has been closed
     });    
    
}

module.exports.getOP = getOP;
module.exports.save = save;