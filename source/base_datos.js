const mysql =require("mysql");
const promisify = require("util").promisify;
const database=require("./conexion").database;

const pool=mysql.createPool(database);
pool.getConnection((err, connection)=>{
    if(err) throw err;
    if(connection){
        connection.release();
        console.log("La base de datos está conectado");
        return;
    }
});
pool.query=promisify(pool.query);

module.exports=pool;