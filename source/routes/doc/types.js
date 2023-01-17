// src/routes/types.js
const express = require('express');
const router = express.Router();
const typesMiddleware = require('../../middlewares/middlewares');
const typesControlador = require('../../controladores/document/types');

//Registro de un nuevo type
router.post('/types',
typesMiddleware.isLoggedIn,
typesMiddleware.isEmpleado,
//documentosMiddleware.validarDoc,
typesControlador.createTypes
);
//Listar types
router.get('/types',
typesMiddleware.isLoggedIn,
typesMiddleware.isEmpAudAdm,
typesControlador.listTypes
);
//obtener un type
router.get('/types/:id',
typesMiddleware.isLoggedIn,
typesMiddleware.isEmpAudAdm,
typesControlador.oneTypes
);
//Editar un types
router.put('/types/:id',
typesMiddleware.isLoggedIn,
typesMiddleware.isEmpleado,
typesControlador.editTypes
);
//Eliminar un types
router.delete('/types/:id',
typesMiddleware.isLoggedIn,
typesMiddleware.isEmpleado,
typesControlador.deleteTypes
);

module.exports = router;