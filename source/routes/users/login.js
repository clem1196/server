const express=require("express");
const router=express.Router();
const loginControllers=require("../../controladores/users/login");
 
//login
router.post("/ingreso",
loginControllers.Ingreso,

);

module.exports=router;