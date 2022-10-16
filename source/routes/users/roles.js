const express=require("express");
const router=express.Router();
const rolMiddlewares=require("../../middlewares/middlewares");
const rolControllers=require("../../controladores/users/roles");

//add rol
router.post("/roles/crear",
rolMiddlewares.isLoggedIn,
rolMiddlewares.isAdmin,
rolMiddlewares.validarRoles,
rolControllers.addRol

);
//obtener roles
router.get("/roles",
rolMiddlewares.isLoggedIn,
rolMiddlewares.isAuditor,
rolControllers.getRoles,
);
//obtener un rol
router.get("/roles/:id",
rolMiddlewares.isLoggedIn,
rolMiddlewares.isAuditor,
rolControllers.getRol,
);
//editar un rol
router.put("/roles/:id",
rolMiddlewares.isLoggedIn,
rolMiddlewares.isAdmin,
rolMiddlewares.validarRoles,
rolMiddlewares.doNotRemoveRolAdmin,
rolControllers.editRol
);
//eliminar un rol
router.delete("/roles/:id",
rolMiddlewares.isLoggedIn,
rolMiddlewares.isAdmin,
rolMiddlewares.doNotRemoveRolAdmin,
rolControllers.deleteRol
);

module.exports=router;

