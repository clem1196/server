// src/routes/usuarios.js
const express = require("express");
const router = express.Router();
const doc_personMiddleware = require("../../middlewares/middlewares");
const doc_personControlador = require("../../controladores/document/doc_person");

//Registro de un nuevo doc-person
router.post(
  "/doc-person",
  doc_personMiddleware.isLoggedIn,
  doc_personMiddleware.isEmpleado,
  //documentosMiddleware.validarDoc,
  doc_personControlador.addDoc_person
);

//Gestion de documentos: solo pueden gestionar los usuarios autenticados y autorizados

//Listar documentos
router.get(
  "/doc-person",
  doc_personMiddleware.isLoggedIn,
  doc_personMiddleware.isEmpAudAdm,  
  doc_personControlador.listDoc_person
);
//obtener un documento
router.get(
  "/doc-person/:id",
  doc_personMiddleware.isLoggedIn,
  doc_personMiddleware.isEmpAudAdm,  
  doc_personControlador.listOneDoc_person
);

//Editar un documento
router.put(
  "/doc-person/:id",
  doc_personMiddleware.isLoggedIn,
  doc_personMiddleware.isEmpleado,
  doc_personControlador.editDoc_person
);
//Eliminar un documento
router.delete(
  "/doc-person/:id",
  doc_personMiddleware.isLoggedIn,
  doc_personMiddleware.isEmpleado,
  doc_personControlador.deleteDoc_person
);

module.exports = router;
