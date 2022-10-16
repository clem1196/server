const express=require("express");
const router=express.Router();
const userMiddlewares=require("../../middlewares/middlewares");
const userControllers=require("../../controladores/users/usuarios");

//add user
router.post("/registro",
userMiddlewares.isLoggedIn,
userMiddlewares.isAdmin,
userMiddlewares.validarAddUser,
userControllers.addUser
);
//listar users
router.get("/usuarios",
userMiddlewares.isLoggedIn,
userMiddlewares.isAuditor,
userControllers.getUsers
);

//one user
router.get("/usuarios/:id",
userMiddlewares.isLoggedIn,
userMiddlewares.isAuditor,
userControllers.getUser
);

//edit user
router.put("/usuarios/:id",
userMiddlewares.isLoggedIn,
userMiddlewares.isAdmin,
userControllers.editUser,
userMiddlewares.validarEditUser,
);

//delete users
router.delete("/usuarios/:id",
userMiddlewares.isLoggedIn,
userMiddlewares.isAdmin,
userControllers.deleteUser
);

module.exports= router;
