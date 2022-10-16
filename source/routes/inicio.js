const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    res.json({Message: "Este es Inicio"});
});

module.exports=router;