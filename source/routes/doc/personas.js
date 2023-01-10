// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const personsMiddleware = require('../../middlewares/middlewares');
const personsControlador = require('../../controladores/document/personas')

//Registro de una nueva persona
router.post('/personas',
    personsMiddleware.isLoggedIn,
    personsMiddleware.isEmpleado,
    //documentosMiddleware.validarDoc,
    personsControlador.createPerson
);
//Listar personas
router.get('/personas',
personsMiddleware.isLoggedIn,
personsMiddleware.isEmpAudAdm,
personsControlador.listPerson
);
//obtener un documento
router.get('/personas/:id',
personsMiddleware.isLoggedIn,
personsMiddleware.isEmpAudAdm,
personsControlador.listOnePerson
);

//Editar un documento
router.put('/personas/:id',
personsMiddleware.isLoggedIn,
personsMiddleware.isEmpleado,
personsControlador.editPerson
);
//Eliminar un documento
router.delete('/personas/:id',
personsMiddleware.isLoggedIn,
personsMiddleware.isEmpleado,
personsControlador.deletePerson
);

module.exports = router;