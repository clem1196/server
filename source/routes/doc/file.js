const express = require("express");
const router = express.Router();
const fileMiddleware = require('../../middlewares/middlewares')
//const fileMiddlewareUpload = require('../../middlewares/upload')
const controladorFile = require("../../controladores/document/file");

//upload multiple files
router.post('/uploads',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpleado,    
    controladorFile.uploads,
    
);
//Listar files
router.get('/files',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpAudAdm,   
    controladorFile.getListFiles
);
//descargar one file
router.get('/files/download/:name',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpAudAdm,
    controladorFile.descargar
);
//Eliminar multiples files
router.delete('/files/:name',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpleado,
    controladorFile.deleteFile
);

module.exports = router;
