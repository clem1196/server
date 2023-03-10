const express = require("express");
const router = express.Router();
const fileMiddleware = require('../../middlewares/middlewares');
const controladorFileMultiple = require("../../controladores/document/fileMultiple");
const controladorFileSingular = require("../../controladores/document/fileSingular");

//UPLOAD
//cargar singular file
router.post('/upload',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpleado,    
    controladorFileSingular.upload,    
);
//cargar multiple files
router.post('/uploads',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpleado,    
    controladorFileMultiple.uploads,    
);

//FILES
//Listar file
router.get('/files',
    fileMiddleware.isLoggedIn,
   fileMiddleware.isEmpAudAdm,   
   controladorFileMultiple.getFiles
);
//obtener un file
router.get('/files/:name',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpAudAdm,   
    controladorFileMultiple.getOneFile
);
//descargar one file
router.get('/files/download/:name',
    //fileMiddleware.isLoggedIn,
    //fileMiddleware.isEmpAudAdm,
    controladorFileMultiple.descargar
);
//Eliminar files
router.delete('/files/:name',
    fileMiddleware.isLoggedIn,
    fileMiddleware.isEmpleado,
    controladorFileMultiple.deleteFile
);

module.exports = router;
