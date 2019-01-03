const { promisify } = require('util');
const mysql = require('mysql');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, conexion) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST' ){
            console.log('CONEXION A LA DB CERRADA');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.log('DATABASE TIENE MAS CONEXIONES');
        }
        if(err.code === 'ECONNREFUSED'){
            console.log('LA CONEXION A LA DB FUE DENEGADA');
        }
    }

    if(conexion) conexion.release();
    console.log('La DB está en línea');
    return;
});

// Convertimos los query que son callbacks a promesas con utils de node
pool.query = promisify(pool.query);

module.exports = pool;