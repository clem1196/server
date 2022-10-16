const pool = require("../../base_datos");
//Agregar Rol
const addRol = async (req, res) => {
    const { nombre_rol } = req.body;
    try {
        //obtenemos un rol mediante su nombre
        const result = await pool.query("call get_roles_ByRolName(?)", [nombre_rol]);
        if (result[0].length > 0)
            //si la longitud del resultado es mayor que cero
            return res.status(409).send({ Message: "El rol ya existe" });
        //creamos los nuevos campos para enviar con el método toLowerCase()
        const newRol = { nombre_rol, registrado: new Date(Date.now()) };
        await pool.query("call insert_roles(?,?)", [newRol.nombre_rol.toLowerCase(), newRol.registrado]);
        return res.status(201).send({ Message: "Se creó correctamente" });

    } catch (error) {
        console.log(error);
    }
};

//obtener roles

const getRoles = async (req, res) => {
    try {
        //traemos toda la lista de roles
        const result = await pool.query("call get_roles()");
        if (result[0].length > 0)
            //si la longitud del resultado es mayor que cero
            return res.status(200).send({ roles: result[0] });
        res.status(404).send({ Message: "No hay roles que mostrar" });

    } catch (error) {
        console.log(error);
    }
};

//obtener un rol

const getRol = async (req, res) => {
    const { id } = req.params;
    try {
        //consultamos a la bd a traves del id para saber si ya existe el rol
        const result = await pool.query("call get_roles_ById(?)", [id]);
        if (result[0].length > 0)
            //si la ongitud del resultado es mayor que cero devolvemos el rol.
            return res.status(200).send({ rol: result[0] });
        res.status(404).send({ Message: "El rol no existe" });
    } catch (error) {
        console.log(error);
    }
};

//editar un rol

const editRol = async (req, res) => {
    const { id } = req.params;
    try {
        //consultamos a la bd a traves de su id para saber si el rol ya existe
        const result = await pool.query("call get_roles_ById(?)", [id]);
        if (result[0].length > 0) {
            const { nombre_rol } = req.body;
            //traemos un rol a traves de su nombre pero diferente al id
            const resultRol = await pool.query("call get_roles_ByRolName_but_differentId(?,?)", [id, nombre_rol]);
            if (resultRol[0].length > 0)
                //si la longitud del resultado es mayor que cero
                return res.status(409).send({ Message: "El rol ya existe" });
            //caso contrario
            if (result[0][0].nombre_rol === nombre_rol)
                //si el nombre del rol a editar es identico al nombre que estamos ingresando por req.body
                return res.status(409).send({ Message: "No hubo modificaciones" });
            //caso contrario
            const newRol = { nombre_rol, actualizado: new Date(Date.now()) };
            //actualizamos el rol utilizando el método toLowercase() para convertir a minúsculas
            await pool.query("call update_roles(?,?,?)", [newRol.nombre_rol.toLowerCase(), newRol.actualizado, id]);
            res.status(201).send({ Message: " Actualizado correctamente" });
        } else {
            res.status(404).send({ Message: "El rol no existe" });
        }
    } catch (error) {
        console.log(error);
    }
};

//eliminar un rol
const deleteRol = async (req, res) => {
    const { id } = req.params;
    try {
        //consultamos a la bd a traves de su id para saber si existe 
        const result = await pool.query("call get_roles_ById(?)", [id]);
        if (result[0].length > 0) {
            //consultamos que dicho rol se encuentra asignado a algun usuario
            const consultarRelacion = await pool.query("call get_users_roles_ByIdRol(?)", [id]);
            if (consultarRelacion[0].length > 0) {
                //si la longitud del resultado es mayor que cero eliminamos la relacion y el rol
                await pool.query("call delete_users_roles_ByIdRol(?)", [id]);
                await pool.query("call delete_roles(?)", [id]);
                return res.status(200).send({ Message: "Se eliminó la relacion y el rol correctamente" });

            } else {
                //eliminamos solo el rol
                await pool.query("call delete_roles(?)", [id]);
                return res.status(200).send({ Message: "Se eliminó el rol correctamente" });
            }
        } else {
            res.status(404).send({ Message: "el rol no existe" });
        }
    } catch (error) {

    }
};

module.exports = {
    addRol,
    getRoles,
    getRol,
    editRol,
    deleteRol
};
