const util = require("util");
const multer = require("multer");

//const maxSize = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "G:\\Mi unidad\\uploadSingular");
  },
  filename: (req, file, cb) => {
    const uploadFile = Date.now()
    let name=file.originalname.split(".")[0];
    let formato=file.originalname.split(".")[1];
    cb(null, name + '__' + uploadFile+"."+formato)   
  }, 
});
let filter = (req, file, cb) => {  
  const extname = /pdf|jpg|jpeg|png/;
  const mimetype =
    extname.test(file.mimetype.split("/")[1]) ||
    extname.test(file.originalname.split(".")[1]);
    console.log(mimetype)
  if (extname && mimetype) {   
    return cb(null, true);
  }
  cb(null, false);
};

let uploadFiles = multer({
  storage: storage,
  limits: { fileSize: Infinity },
  fileFilter: filter,
}).array("files", 1);

let uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;






/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "D:\\Doc_registro\\uploadSingular");
  },
  filename: (req, file, cb) => {
    const uploadFile = Date.now()
    let name=file.originalname.split(".")[0];
    let formato=file.originalname.split(".")[1];
    cb(null, name + '__' + uploadFile+"."+formato)   
  }, 
});
let filter = (req, file, cb) => {  
  const extname = /pdf|jpg|jpeg|png/;
  const mimetype =
    extname.test(file.mimetype.split("/")[1]) ||
    extname.test(file.originalname.split(".")[1]);
    console.log(mimetype)
  if (extname && mimetype) {   
    return cb(null, true);
  }
  cb(null, false);
};

let uploadFiles = multer({
  storage: storage,
  limits: { fileSize: Infinity },
  fileFilter: filter,
}).single("uploaded_files");

let uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
*/
