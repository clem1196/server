const jwt = require("jsonwebtoken");
const pool = require("../base_datos");

module.exports = {
    validarAddUser: (req, res, next) => {
        if (!req.body.nombre_usuario || req.body.nombre_usuario.length < 3) {
            return res.status(400).send({ Message: "Por favor ingrese un nombre mínimo 3 caracteres" });
        }
        if (!req.body.contraseña || req.body.contraseña.length < 6) {
            return res.status(400).send({ Message: "Por favor ingrese contraseña mínimo 6 caracteres" });
        }
        //repite_contraaseña es solo para comprobar que la contraseña sea correcta 
        if (!req.body.repite_contraseña || req.body.repite_contraseña != req.body.contraseña) {
            return res.status(400).send({ Message: "Las contraseñas no coinciden" });
        }
        //caso contrario
        next();
    },
    validarEditUser: (req, res, next) => {
        if (!req.body.nombre_usuario || req.body.nombre_usuario.length < 3) {
            return res.status(400).send({ Message: "Por favor ingrese un nombre mínimo 3 caracteres" });
        }
        if (!req.body.contraseña || req.body.contraseña.length < 6) {
            return res.status(400).send({ Message: "Por favor ingrese contraseña mínimo 6 caracteres" });
        }
        //caso contrario
        next();
    },
    validarRoles: (req, res, next) => {
        if (!req.body.nombre_rol || req.body.nombre_rol.length < 3) {
            return res.status(400).send({ Message: "Por favor ingrese un nombre mínimo 3 caracteres" });
        }
        //caso contrario
        next();
    },
    validarUsuarios_roles: (req, res, next) => {
        if (!req.body.idusuario || !req.body.idusuario > 0 || !Number.isInteger(parseInt(req.body.idusuario))) {
            return res.status(400).send({ Message: "Ingrese un numero entero mayor que cero" });
        }
        if (!req.body.idroles || !req.body.idroles > 0 || !Number.isInteger(parseInt(req.body.idroles))) {
            return res.status(400).send({ Message: "Ingrese un numero entero mayor que cero" });
        }
        //caso contrario
        next();
    },
    //Authentication
    isLoggedIn: (req, res, next) => {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({ ok: false, Message: "El token no es válido o no existe" })
        } else {
            token = token.split(' ');
            if (token.length > 1) {
                token = token[1]
                jwt.verify(token, "clemente", (err, token) => {
                    if (err)
                        res.status(401).send({ ok: false, Message: "No se pudo comprobar el token" });
                    req.token = token;
                    next();
                })
            } else {
                token = token[0]
                jwt.verify(token, "clemente", (err, token) => {
                    if (err)
                        res.status(401).send({ ok: false, Message: "No se pudo comprobar el token" });
                    req.token = token;
                    next();
                })
            }
        }
    },
    //Authorization
    //El admin tine acceso a todas las rutas del sistema y puede hacer modificaciones
    isAdmin: (req, res, next) => {
        const rolAdmin = req.token.rol.filter((element) => (element.nombre_rol === "admin"));
        if (rolAdmin.length > 0)
            return next();
        res.status(401).send({ Message: "usted no tien permiso" });
    },
    //el auditor tiene acceso a todo el sistema pero no puede hacer modificaciones
    isAuditor: (req, res, next) => {
        const rolAuditor = req.token.rol.filter((element) => (element.nombre_rol === "auditor" || element.nombre_rol === "admin"));
        if (rolAuditor.length > 0)
            return next();
        res.status(401).send({ Message: "usted no tien permiso" });
    },
    //al modulo ventas tiene acceso el vendedor, el auditor y el admin
    isVendedor: (req, res, next) => {
        const rolVendedor = req.token.rol.filter((element) => (element.nombre_rol === "vendedor" || element.nombre_rol === "auditor" || element.nombre_rol === "admin"));
        if (rolVendedor.length > 0)
            return next();
        res.status(401).send({ Message: "usted no tien permiso" });
    },
    //al modulo contabilidad tiene acceso el contador, el auditor y el admin
    isContador: (req, res, next) => {
        const rolContador = req.token.rol.filter((element) => (element.nombre_rol === "contador" || element.nombre_rol === "auditor" || element.nombre_rol === "admin"));
        if (rolContador.length > 0)
            return next();
        res.status(401).send({ Message: "usted no tien permiso" });
    },

    //El sistema necesita siempre del rol "admin", por lo que no se debe eliminar ni editar al rol admin
    doNotRemoveRolAdmin: async (req, res, next) => {
        const id = req.params.id;
        const roles = await pool.query("call get_roles_ById(?)", [id]);
        console.log(roles[0])
        if (roles[0].length > 0) {
            if (roles[0][0].nombre_rol != "admin")
                return next();
            //caso contrario
            res.status(401).send({ Message: "No debe eliminar ni editar al rol admin" });
        }
        else {
            res.status(404).send({ Message: "El rol no existe" });
        }

    },

    //El sistema necesita siempre minimo de un usuario "admin"
    //por lo que no se debe eliminar a la relación usuarios_roles que contiene rol admin
    doNotRemoveUserAdmin: async (req, res, next) => {
        const id = req.params.id;
        //consultamos a la bd con el id de la relacion para serciorarnos que exista
        const usuarioRol = await pool.query("call get_usersNames_rolesNames_ById(?)", [id]);
        if (usuarioRol[0].length > 0) {
            //si la longitud del resultado es mayor que cero decimos lo siguiente
            if (usuarioRol[0][0].nombre_rol === "admin") {
                //si la relacion contiene al rol admin traemos todas
                const usuariosRoles = await pool.query("call get_usersNames_rolesNames()");
                //y filtramos por el nombre_rol===admin
                const rolAdmin = usuariosRoles[0].filter(element => element.nombre_rol === "admin");
                if (rolAdmin.length > 1) {
                    //si la longitud del resultado es mayor que 1 significa hay varios relaciones
                    // que contiene al rol admin
                    return next();
                } else {
                    //caso contrario solo hay una relacíon admin
                    res.status(401).send({ Message: "No debe eliminar ni editar a la relacion admin" });
                }
            } else {
                //significa que la relacion no es admin
                next();
            }
        } else {
            return res.status(400).send({ Message: "La relación no existe" });
        }

    }
}