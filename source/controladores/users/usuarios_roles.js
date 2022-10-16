const pool = require("../../base_datos");

//agregar relación usuarios_roles
const addUsuarios_roles = async (req, res) => {
    const { idusuario, idroles } = req.body;
    try {
        //verificamos que el idusuario y idroles existan
        const usuario = await pool.query("call get_users_ById(?)", [idusuario]);
        const rol = await pool.query("call get_roles_ById(?)", [idroles]);
        if (usuario[0].length > 0 && rol[0].length > 0) {
            //verificamos que la relacion usuarios_roles que vamos a agregar no se duplique
            const result = await pool.query("call get_users_roles_ByIdUser_and_ByIdRol(?,?)", [idusuario, idroles]);
            if (result[0].length > 0)
                return res.status(400).send({ Message: "La relacion usuarios_roles ya existe" });
            //caso contrario creamos nuevos campos para insertar  
            const newUsuarios_roles = { idusuario, idroles, registrado: new Date(Date.now()) };
            await pool.query("call insert_users_roles(?,?,?)", [newUsuarios_roles.idusuario, newUsuarios_roles.idroles, newUsuarios_roles.registrado]);
            return res.status(201).send({ Message: "Se creó una relacion correctamente" });
        } else {
            res.status(404).send({ Message: "El idusuario o el idroles no son válidos" });
        }
    } catch (error) {
        console.log(error);
    }
};

//obtener toda las relaciones usuarios_roles
const getUsuarios_roles = async (req, res) => {
    try {
        //traemos a todas las relaciones 
        const users_roles = await pool.query("call get_users_roles()");
        if (users_roles[0].length > 0)
            //si la longitud del resultado es mayor que 0 que me muestra el result[0]
            return res.status(200).send({ users_roles: users_roles[0] });
        //caso contrario
        res.status(404).send({ Message: "No hay ninguna relacion usuarios_roles que mostrar" });

    } catch (error) {
        console.log(error);
    }
};

//obtener una relacion usuarios_roles

const getUsuario_rol = async (req, res) => {
    const { id } = req.params;
    try {
        //traemos solo una relacion a traves de su id
        const user_rol = await pool.query("call get_users_roles_ById(?)", [id]);
        if (user_rol[0].length > 0)
            //si la longitud del resultado es mayor que 0 que me muestra el user_rol[0]
            return res.status(200).send({ user_rol: user_rol[0] });
        //caso contrario
        res.status(404).send({ Message: "La relación usuarios_roles no existe" });
    } catch (error) {
        console.log(error);
    }
};

//editar usuarios_roles
const editUsuarios_roles = async (req, res) => {
    const { id } = req.params;
    const { idusuario, idroles } = req.body;
    try {
        //obtenemos un usuario_rol
        const user_rol = await pool.query("call get_users_roles_ById(?)", [id]);
        //si el id existe
        if (user_rol[0].length > 0) {
            const usuario = await pool.query("call get_users_ById(?)", [idusuario]);
            const rol = await pool.query("call get_roles_ById(?)", [idroles]);
            //si idusuario y idroles existen
            if (usuario[0].length > 0 && rol[0].length > 0) {
                const result = await pool.query("call get_users_roles_ByIdUser_and_ByIdRol_but_differentId(?,?,?)", [idusuario, idroles, id]);
                //si idusuario y idroles existen en el idusuarios_roles
                if (result[0].length > 0)
                    return res.status(400).send({ Message: "la relacion usuarios_roles ya existe" });
                //si idusuario y idroles de la relacion es igual al del req.body
                if (idusuario == user_rol[0][0].idusuario && idroles == user_rol[0][0].idroles)
                    return res.status(400).send({ Message: "No hubo modificaciones" });
                //si el usuario es admin
                const result1 = await pool.query("call get_usersNames_RolesNames_ById(?)", [id]);
                //creamos los nuevos campos para enviar
                const newUsuarios_roles = { idusuario, idroles, actualizado: new Date(Date.now()) };
                if (result1[0][0].nombre_rol === "admin") {
                    const resultName = result1[0][0].nombre_usuario;
                    let token = req.headers.authorization;
                    //decodificamos el token con buffer.from(), analizamos con JSON.parse
                    //y obtenemos el nombre del usuario
                    const tokenName = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("ascii")).username;
                    //si los nombres son iguales editamos y cerramos sesión
                    if (resultName === tokenName) {
                        await pool.query("call update_users_roles(?,?,?,?)", [newUsuarios_roles.idusuario, newUsuarios_roles.idroles, newUsuarios_roles.actualizado, id]);
                        return res.status(201).send({ Message: "La relacion se actualizo correctamente debe iniciar sesión nuevamente", Reset: true });

                    } else {
                        //si la relacion es admin
                        await pool.query("call update_users_roles(?,?,?,?)", [newUsuarios_roles.idusuario, newUsuarios_roles.idroles, newUsuarios_roles.actualizado, id]);
                        return res.status(201).send({ Message: "La relación admin se actualizó correctamente", Reset: false });
                    }
                } else {
                    //si la relacion no es admin
                    await pool.query("call update_users_roles(?,?,?,?)", [newUsuarios_roles.idusuario, newUsuarios_roles.idroles, newUsuarios_roles.actualizado, id]);
                    return res.status(201).send({ Message: "La relación se actualizó correctamente", Reset: false });
                }
            }
            //si idusuario y idroles no son válidos
            res.status(404).send({ Message: "El idusuario o idroles no son validos" });
        } else {
            //si la relacion no existe
            return res.status(404).send({ Message: "La relacion usuarios_roles no existe" });
        }
    } catch (error) {
        console.log(error);
    }
};

//eliminar usuarios_roles

const deleteUsuarios_roles = async(req, res)=> {
    const { id } = req.params;
    try {
        //traemos la relacion que vamos eliminar
        const result = await pool.query("call get_usersNames_rolesNames_ById(?)", [id]);       
        if (result[0].length > 0) {
            //comprobamos que la relacion tiene el nombre_rol "admin"
            if (result[0][0].nombre_rol === "admin") {
                const resultName = result[0][0].nombre_usuario
                let token = req.headers.authorization;
                //decodificamos el token con buffer.from(), analizamos con JSON.parse
                //y obtenemos el nombre del usuario
                const tokenName = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("ascii")).username;
                //si los nombres son iguales eliminamos y cerramos sesión                
                if (resultName === tokenName) {
                    await pool.query("call delete_users_roles(?)", [id]);
                    return res.status(200).send({ Message: "La relacion se eliminó correctamnete debe iniciar sesión nuevamente", Reset: true});

                } else {
                    //si la relacion es admin
                    await pool.query("call delete_users_roles(?)", [id]);
                    return res.status(200).send({ Message: "La relacion admin se elimió correctamente", Reset: false });
                }
            } else {
                //si la relacion no es admin
                await pool.query("call delete_users_roles(?)", [id]);
                return res.status(200).send({ Message: "La relacion se elimió correctamente", Reset: false });
            }
        } else {
            res.status(404).send({ Message: "La relación no existe" });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    addUsuarios_roles,
    getUsuarios_roles,
    getUsuario_rol,
    editUsuarios_roles,
    deleteUsuarios_roles
};