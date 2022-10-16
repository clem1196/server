const database ={
    connectionLimit:10,
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "c1l2e3m1196",
    database: process.env.DATABASE_NAME || "dbaplication",  
}
module.exports={database}