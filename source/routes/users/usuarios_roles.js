const express=require("express");
const router=express.Router();
const user_rolesMiddlewares=require("../../middlewares/middlewares");
const user_rolesControllers=require("../../controladores/users/usuarios_roles");

//add user_roles
router.post("/u_roles/crear",
user_rolesMiddlewares.isLoggedIn,
user_rolesMiddlewares.isAdmin,
user_rolesMiddlewares.validarUsuarios_roles,
user_rolesControllers.addUsuarios_roles
);
//listar users_roles
router.get("/u_roles",
user_rolesMiddlewares.isLoggedIn,
user_rolesMiddlewares.isAuditor,
user_rolesControllers.getUsuarios_roles

);

//one user_rol
router.get("/u_roles/:id",
user_rolesMiddlewares.isLoggedIn,
user_rolesMiddlewares.isAuditor,
user_rolesControllers.getUsuario_rol

);

//edit user_rol
router.put("/u_roles/:id",
user_rolesMiddlewares.isLoggedIn,
user_rolesMiddlewares.isAdmin,
user_rolesMiddlewares.validarUsuarios_roles,
user_rolesMiddlewares.doNotRemoveUserAdmin,
user_rolesControllers.editUsuarios_roles

);

//delete users_roles
router.delete("/u_roles/:id",
user_rolesMiddlewares.isLoggedIn,
user_rolesMiddlewares.isAdmin,
user_rolesMiddlewares.doNotRemoveUserAdmin,
user_rolesControllers.deleteUsuarios_roles

);

module.exports= router;