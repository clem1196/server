const express=require("express");
const router=express.Router();
const listDataMiddlewares=require("../../../middlewares/middlewares");
const listDataControllers=require("../../../controladores/document/docsData/docsData");

//lists
router.get("/docs/data",
listDataMiddlewares.isLoggedIn,
listDataMiddlewares.isEmpAudAdm,
listDataControllers.querys

);
//list
router.get("/docs/data/:id",
listDataMiddlewares.isLoggedIn,
listDataMiddlewares.isEmpAudAdm,
listDataControllers.querys
);


module.exports=router;