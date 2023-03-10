// src/routes/usuarios.js
const express = require("express");
const router = express.Router();
const docMiddleware = require("../../middlewares/middlewares");
const docControlador = require("../../controladores/document/documents");

//Registro de un documento
router.post("/documentos",
  docMiddleware.isLoggedIn,
  docMiddleware.isEmpleado,
  docMiddleware.validarDoc,  
  docControlador.createDocument
);
//Listar personas
router.get("/documentos",
  docMiddleware.isLoggedIn,
  docMiddleware.isEmpAudAdm,
  docControlador.listDocument
);
//obtener un documento
router.get("/documentos/:id",
  docMiddleware.isLoggedIn,
  docMiddleware.isEmpAudAdm,
  docControlador.listOneDocument
);
//Editar un documento
router.put("/documentos/:id",
  docMiddleware.isLoggedIn,
  docMiddleware.isEmpleado,
  docMiddleware.validarDoc,
  docControlador.editDocument
);
//Eliminar un documento
router.delete("/documentos/:id",
  docMiddleware.isLoggedIn,
  docMiddleware.isEmpleado,
  docControlador.deleteDocument
);

module.exports = router;
