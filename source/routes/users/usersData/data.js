const express=require("express");
const router=express.Router();
const listDataMiddlewares=require("../../../middlewares/middlewares");
const listDataControllers=require("../../../controladores/users/usersData/usersData");

//lists
router.get("/data",
listDataMiddlewares.isLoggedIn,
listDataMiddlewares.isAuditor,
listDataControllers.querys

);
//list
router.get("/data/:id",
listDataMiddlewares.isLoggedIn,
listDataMiddlewares.isAuditor,
listDataControllers.querys
);


module.exports=router;