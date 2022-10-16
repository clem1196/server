const bcrypt = require("bcryptjs");
const pool = require("../../base_datos");

//Agregar usuario
const addUser = async (req, res) => {
    const { nombre_usuario, contraseña } = req.body;
    try {
        //consultamos a la base de datos para ver si el usuario ya existe
        const result = await pool.query("call get_users_ByUserName(?)", [nombre_usuario]);
        if (result[0].length > 0)
            //si la longitud del resultado es mayor que 0 devolvemos un mensaje
            return res.status(409).send({ Message: "El usuario ya existe!" });
        //caso contrario ciframos la contraseña y creamos los nuevos datos o campos del usuario
        const hash = await bcrypt.hash(contraseña, 10);
        const newUsuario = { nombre_usuario, contraseña: hash, registrado: new Date(Date.now()) };
        await pool.query("call insert_users(?,?,?)", [newUsuario.nombre_usuario, newUsuario.contraseña, newUsuario.registrado]);
        return res.status(201).send({ Message: "Se creó correctamente" });

    } catch (error) {
        console.log(error);
    }
};
//obtener todo los usaurios
const getUsers = async (req, res) => {
    try {
        //obtenemos los usuarios
        const users = await pool.query("call get_users()");
        if (users[0].length > 0)
            //si la longitud del resultado(users) es mayor que 0 devolvemos dicho resultado
            return res.status(200).send({ users: users[0] });
        //caso contrario
        res.status(404).send({ Message: "No hay usuarios que mostrar" });

    } catch (error) {
        console.log(error);
    }
};
//obtener un usuario
const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        //obtenemos un usuario a travez de su id
        const user = await pool.query("call get_users_ById(?)", [id]);
        if (user[0].length > 0)
            //si la longitud del resultado es mayor que 0 devolvemos dicho resultado
            return res.status(200).send({ user: user[0] });
        //caso contrario
        res.status(404).send({ Message: "El usuario no existe" });

    } catch (error) {
        console.log(error)
    }
};
//editar usuario
const editUser = async (req, res) => {
    const { id } = req.params;
    //comprobamos que el usuario a editar exista
    const result = await pool.query("call get_users_ById(?)", [id]);
    try {
        if (result[0].length > 0) {
            const { nombre_usuario } = req.body;
            //si la longitud del resultado es mayor que cero verificamos que no se se repita
            const user = await pool.query("call get_users_ByUsername_but_differentId(?,?)", [nombre_usuario, id]);
            if (user[0].length > 0)
                return res.status(409).send({ Message: "El usaurio ya existe" });
            //caso contrario agarramos la contraseña del req.body, el nombre y la contraseña
            //del usuario registrado en la bd. luego primero comparamos las dos contraseñas luego 
            //los nombres
            const { contraseña } = req.body;
            const name = result[0][0].nombre_usuario;
            const password = result[0][0].contraseña;
            console.log({ name: name, password: password });
            const trueFalse = await bcrypt.compare(contraseña, password);
            if (name === nombre_usuario && trueFalse === true)
                //si las contraseñas y nombres son iguales
                return res.status(400).send({ Message: "No hubo modificaciones" });
            //caso contrario ciframos la contraseña y creamos nuevos datos o campos del usuario
            const hash = await bcrypt.hash(contraseña, 10);
            const newUser = { nombre_usuario, contraseña: hash, ultimo_acceso: new Date(Date.now()) };
            await pool.query("call update_users(?, ?, ?, ?)", [newUser.nombre_usuario, newUser.contraseña, newUser.ultimo_acceso, id]);
            res.status(201).send({ Message: "Actualizado correctamente" });

        } else {
            res.status(404).send({ Message: "El usuario no existe" });
        }
    } catch (error) {
        console.log(error);

    }
};
//eliminar usuario

const deleteUser = async (req, res) => {
    const { id } = req.params;
    //comprobamos que el usuario a editar exista
    const result = await pool.query("call get_users_ById(?)", [id]);
    console.log(result[0]);
    try {
        if (result[0].length > 0) {
            //si el resultado es mayor que cero consultamos si el usuario a eliminar está relacionado 
            //con algun rol
            const consultarRelacion = await pool.query("call get_users_roles_ByIdUser(?)", [id]);
            if (consultarRelacion[0].length > 0) {
                //si el resultado es mayor que cero eliminamos primero esa o relación
                //luego eliminamos el usuario
                await pool.query("call delete_users_roles_ByIdUser(?)", [id]);
                await pool.query("call delete_users(?)", [id]);
                return res.status(201).send({ Message: "Se eliminó la relacion y el usuario correctamente" });
            } else {
                //caso conmtrario eliminamos solo al usaurio
                await pool.query("call delete_users(?)", [id]);
                return res.status(201).send({ Message: "Se eliminó el usuario correctamente" });
            }


        } else {
            res.status(404).send({ Message: "El usuario no existe" });
        }
    } catch (error) {
        console.log(error);
    }

};

module.exports = {
    addUser,
    getUsers,
    getUser,
    editUser,
    deleteUser
}



