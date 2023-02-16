const uploadFiles = require("../../middlewares/upload");
const fs = require("fs");

const uploads = async (req, res) => {
  try {
    await uploadFiles(req, res);
    let Files = req.files;
    //si Files es undefined significa que en middlewares/upload no lo deja pasar por tener extención diferente
    if (Files == undefined || !Files.length || Files.length > 12) {
      return res.status(400).send({
        Message:
          "Seleccione archivos no mayor que 12 con formato pdf, jpg, jpeg o doc",
      });
    } else {
      res.status(201).send({ Message: "successfull" });
    }
  } catch (error) {
    console.log(error);
  }
};
//listar files
const getFiles = (req, res) => {
  const directoryPath =
    "D:\\Doc_registro\\uploads/"; /*__basedir + "/resources/uploads/"*/
  const baseUrl = `http://${req.headers.host}/api/files/download/`;

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({ Message: "No hay archivos que mostrar" });
    }
    let fileInfos = [];
    console.log(files);

    files.forEach((file) => {
      console.log(file);
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};
//obtener un file
const getOneFile = (req, res) => {
  let fileName = req.params.name;
  const directoryPath =
    "D:\\Doc_registro\\uploads/"; /*__basedir + "/resources/uploads/"*/
  const baseUrl = `http://${req.headers.host}/api/files/`;

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({ Message: "No hay archivos que mostrar" });
    }
    let fileInfos = [];
    //console.log(files);
    files.forEach((file) => {
      if (file == fileName) {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      }
    });
    res.status(200).send(fileInfos[0].url);
  });
};
//descargar
const descargar = (req, res) => {
  let fileName = req.params.name;
  //console.log(fileName)
  let directoryPath = "D:\\Doc_registro\\uploads/" + fileName;
  res.download(directoryPath, fileName, (err) => {
    if (err)
      return res
        .status(500)
        .send({ Message: "El archivo no existe o fue eliminado" });
  });
};

const deleteFile = (req, res) => {
  const fileName = req.params.name;
  let directoryPath =
    "D:\\Doc_registro\\uploads/"; /*__basedir + "/resources/uploads/"*/
  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      return res.status(500).send({
        Message:
          "No se puede eliminar puede que el archivo ya no exista " + err,
      });
    } else {
      res.status(200).send({ Message: "Eliminado" });
    }
  });
};
module.exports = {
  uploads,
  getFiles,
  getOneFile,  
  descargar,
  deleteFile  
};
