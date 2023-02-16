const express = require("express");
const router = express.Router();
const fileMiddleware = require('../../middlewares/middlewares');
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
    controladorFile.getFiles
);
//obtener un file
router.get('/files/:name',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpAudAdm,   
    controladorFile.getOneFile
);
//descargar one file
router.get('/files/download/:name',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpAudAdm,
    controladorFile.descargar
);
//Eliminar files
router.delete('/files/:name',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpleado,
    controladorFile.deleteFile
);

module.exports = router;
