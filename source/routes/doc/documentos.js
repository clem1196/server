// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const documentosMiddleware = require('../../middlewares/middlewares');
const documentosControlador = require('../../controladores/document/documentos')

//Registro de un nuevo documento
router.post('/documentos',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpleado,
    //documentosMiddleware.validarDoc,
    documentosControlador.crearDoc
);

//Gestion de documentos: solo pueden gestionar los usuarios autenticados y autorizados

//Listar documentos
router.get('/documentos',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpAudAdm,    
    documentosControlador.listarDoc
);
//obtener un documento
router.get('/documentos/:id',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpAudAdm,    
    documentosControlador.obtenerUnDoc
);

//Editar un documento
router.put('/documentos/:id',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpleado,
    documentosControlador.editDoc
);
//Eliminar un documento
router.delete('/documentos/:id',
    documentosMiddleware.isLoggedIn,
    documentosMiddleware.isEmpleado,
    documentosControlador.deleteDoc
);

module.exports = router;