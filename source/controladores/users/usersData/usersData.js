const pool= require("../../../base_datos");
const querys=async (req, res) => {
    try {
        const id=req.params.id;
        const nombre_rol=req.body.nombre_rol;
        const nombre_usuario=req.body.nombre_usuario;
        const idusuario=req.body.idusuario;
        const idroles=req.body.idroles;
        let lists={
            //*ROLES
            //lista de roles por id
            roles_ById: await pool.query('call get_roles_ById(?)', [id]), 
            //lista de roles por nombre_rol         
            roles_ByRolName : await pool.query('call get_roles_ByRolName(?)', [nombre_rol]),
            //lista de roles por nombre_usuario
            roles_ByUserName : await pool.query('call get_roles_ByUserName(?)', [nombre_usuario]),
            //lista de roles por el nombre rol pero diferente id
            roles_ByRolName_but_differentId: await pool.query('call get_roles_ByRolName_but_differentId(?, ?)', [id, nombre_rol]),
            //lista de roles
            roles: await pool.query('call get_roles()'),

            //USUARIOS
            //lista de usuarios por id
            users_ById: await pool.query('call get_users_ById(?)', [id]),
            //lista de usuarios por nombre_rol
            users_ByUserName : await pool.query('call get_users_ByUserName(?)', [nombre_rol]),
            //lista de usuarios por nombre_usuario pero diferente id
            users_ByUserName_but_differentId : await pool.query('call get_users_ByUserName_but_differentId(?, ?)', [nombre_usuario, id]),
            //lista de usuarios activos
            usersid_and_usersnames: await pool.query('call get_usersid_and_usersnames()'),
            //lista de usuarios
            users: await pool.query('call get_users()'),
            //USUARIOS_ROLES
            //lista de usuarios_roles por id            
            users_roles_ById: await pool.query('call get_users_roles_ById(?)', [id]),
            //lista de usuarios_roles por idroles            
            users_roles_ByIdRol : await pool.query('call get_users_roles_ByIdRol(?)', [idroles]), 
            //lista de usuarios_roles por idusuario           
            users_roles_byIdUser : await pool.query('call get_users_roles_byIdUser(?)', [idusuario]),
            //lista de usuarios_roles por idroles y idusuario
            users_roles_ByIdUser_and_ByIdRol : await pool.query(' call get_users_roles_ByIdUser_and_ByIdRol(?, ?)', [idusuario, idroles]),
            //lista de usuarios_roles por idusuario, idroles y id
            users_roles_ByIdUser_and_ByIdRol_but_differentId : await pool.query(' call get_users_roles_ByIdUser_and_ByIdRol_but_differentId(?, ?, ?)', [idusuario, idroles, id]),
            //lista de usuarios_roles con nombre_usuario, nombre_rol por id
            usersNames_rolesNames_ById: await pool.query('call get_usersNames_rolesNames_ById(?)', [id]),
            //lista de nombre_usuario y nombre_rol
            usersNames_rolesNames: await pool.query('call get_usersNames_rolesNames()'),
            //lista de usuarios_roles
            users_roles: await pool.query('call get_users_roles()')
        }
        //estas listas lo usaremos en el frontend            
        return res.status(200).send({
            //*roles
            roles_ById: lists.roles_ById[0],           
            roles_ByRolName : lists.roles_ByRolName[0],
            roles_ByUserName : lists.roles_ByUserName[0],
            roles_ByRolName_but_differentId: lists.roles_ByRolName_but_differentId[0],
            roles: lists.roles[0],
            //usuarios
            users_ById: lists.users_ById[0],
            users_ByUserName : lists.users_ByUserName[0],
            users_ByUserName_but_differentId : lists.users_ByUserName_but_differentId[0],
            usersid_and_usersnames: lists.usersid_and_usersnames[0],
            users: lists.users[0],
            //usuarios_roles            
            users_roles_ById: lists.users_roles_ById[0],            
            users_roles_ByIdRol : lists.users_roles_ByIdRol[0],            
            users_roles_byIdUser : lists.users_roles_byIdUser[0],
            users_roles_ByIdUser_and_ByIdRol : lists.users_roles_ByIdUser_and_ByIdRol[0],
            users_roles_ByIdUser_and_ByIdRol_but_differentId : lists.users_roles_ByIdUser_and_ByIdRol_but_differentId[0],
            usersNames_rolesNames_ById: lists.usersNames_rolesNames_ById[0],
            usersNames_rolesNames: lists.usersNames_rolesNames[0],
            users_roles: lists.users_roles[0]
        })
    } catch (error) {
        console.log(error)
    }
};
module.exports={querys}