//const uploadFiles = require("../../middlewares/upload");
const uploadFile = require("../../middlewares/uploadSingular");
const fs = require("fs");
const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    let Files = req.files;
    //console.log(Files);
    //si Files es undefined significa que en middlewares/upload no lo deja pasar por tener extención diferente
    if (Files == undefined || !Files.length || Files.length > 1) {
      return res.status(400).send({
        Message:
          "Seleccione al menos un archivo con formato pdf, jpg, jpeg o png",
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
  const directoryPath = "G:\\Mi unidad\\uploadSingular/";
  const baseUrl = `http://${req.headers.host}/api/files/download/`;
  fs.readdir(directoryPath, function (err, files) {
    if (err) throw err;
    if (files.length > 0) {
      let fileInfos = [];
      //console.log(files);
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        let semiDate = parseInt(file.split("__")[1].split(".")[0]);
        let date = new Date(semiDate).toLocaleString("es-PE");
        //console.log(date);
        fileInfos.push({
          name: file,
          url: baseUrl + file,
          created: date,
        });
      }
      //console.log(fileInfos)
      return res.status(200).send(fileInfos);
    }
    res.status(404).send({ Message: "No hay archivos que mostrar" });
  });
};
//obtener un file
const getOneFile = (req, res) => {
  let fileName = req.params.name;
  const directoryPath =
    "G:\\Mi unidad\\uploadSingular/"; /*__basedir + "/resources/uploads/"*/
  const baseUrl = `http://${req.headers.host}/api/files/download/`;

  fs.readdir(directoryPath, function (err, files) {
    if (err) throw err;
    if (files.length > 0) {
      let fileInfos = [];
      //console.log(files);
      files.forEach((file) => {
        if (file == fileName) {
          let date = new Date(parseInt(file.split("__")[1])).toLocaleString(
            "es-PE"
          );
          fileInfos.push({
            name: file,
            url: baseUrl + file,
            created: date,
          });
        }
      });
      return res.status(200).send(fileInfos[0].url);
    }
    res.status(404).send({ Message: "No hay archivos que mostrar" });
  });
};
//obtener un file
const mostrarFile = (req, res) => {
  let fileName = req.params.name;
  const directoryPath =
    "G:\\Mi unidad\\uploadSingular/" +
    fileName; /*__basedir + "/resources/uploads/"*/
  //const baseUrl = `http://${req.headers.host}/api/files/`;
  fs.readFile(directoryPath, "utf8", function (err, data) {
    if (err) throw err;
    if (data) {
      console.log(data);
      res.status(200).send(data);
    }
  });
};
//descargar
const descargar = (req, res) => {
  let fileName = req.params.name;
  //console.log(fileName)
  let directoryPath = "G:\\Mi unidad\\uploadSingular/" + fileName;
  res.download(directoryPath, fileName, (err) => {
    if (err)
      return res
        .status(500)
        .send({ Message: "El archivo no existe o fue eliminado" });  
  })
};
const deleteFile = (req, res) => {
  const fileName = req.params.name;
  let directoryPath =
    "G:\\Mi unidad\\uploadSingular/"; /*__basedir + "/resources/uploads/"*/
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
  upload,
  getFiles,
  getOneFile,
  mostrarFile,
  descargar,
  deleteFile,
};
