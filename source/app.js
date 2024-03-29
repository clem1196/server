const express = require("express");
const app= express();
const bodyParser=require("body-parser");
const cors= require("cors");

global.__basedir = __dirname;
const PORT=process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());
app.use("/api", ([
    //users
    require("./routes/inicio"),
    require("./routes/users/usuarios"),
    require("./routes/users/roles"),
    require("./routes/users/usuarios_roles"),
    require("./routes/users/login"),
    //documentos   
    require('./routes/doc/documents'),   
    require('./routes/doc/file'),    
    //data
    require("./routes/users/usersData/data")
    
]));

app.listen(PORT, ()=>{
    console.log("El servidor está corriendo en el puerto "+ PORT);
});