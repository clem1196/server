const util = require("util");
const multer = require("multer");
//const maxSize = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "D:\\Doc_registro\\uploads"  /*__basedir + "/resources/uploads/"*/);       
  },
 
  filename: (req, file, cb) => {
    cb(null, file.originalname);
    console.log(file)    
  }
});
let filter = (req, file, cb) => {
  const extname = /doc|pdf|jpg|jpeg/
  const mimetype = extname.test(file.mimetype.split('/')[1]) ||extname.test(file.originalname.split('.')[1]);
  if (extname && mimetype) {    
    return cb(null, true)
  }  
  cb(null, false)
};

let uploadFiles = multer({
  storage: storage,
  limits: { fileSize: Infinity },
  fileFilter: filter
}).array("files", 12);

//let uploadFileMiddleware = util.promisify(uploadFile);
let uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
