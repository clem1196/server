const bcrypt=require("bcryptjs");
const pool=require("../../base_datos");
const jwt=require("jsonwebtoken");

//Iniciar sesión

const Ingreso= async(req, res)=>{
    const {nombre_usuario, contraseña}=req.body;
    try {
        //obtenmos un usuario a traves de su nombre
        const result=await pool.query("call get_users_ByUsername(?)", [nombre_usuario]);
        if(!result[0].length>0)
        return res.status(404).send({Message: "El usuario no existe"});
        //comparamos la contraseña que ingresamos con lo que existe en la bd
        const compararContraseña=await bcrypt.compare(contraseña, result[0][0].contraseña);
        if(!compararContraseña==true)
        return res.status(404).send({Message: "La contraseña no es correcta"});
        //comprobamos que el usuario tenga al menos un rol
        const roles=await pool.query("call get_roles_ByUserName(?)", [result[0][0].nombre_usuario]);
        if(!roles[0].length>0)
        return res.status(400).send({Message:"Para iniciar sesión debes tener al menos un rol"});
        //creamos un token y la firmamos
        const token =jwt.sign(
            {
                username: result[0][0].nombre_usuario,
                userId: result[0][0].idusuario,
                rol:roles[0]
            },
            "clemente",
            {
                expiresIn:"1d"
            }
        );
        let ultimo_acceso=new Date(Date.now());
        //actualizamos el campo ultimo_acceso
        await pool.query("call update_users_ultimo_acceso_ById(?,?)", [ultimo_acceso, result[0][0].idusuario]);
        res.status(200).send({Message:"Logged In", token, user:result[0]});

    } catch (error) {
        console.log(error);
    }
};
module.exports={
    Ingreso
}