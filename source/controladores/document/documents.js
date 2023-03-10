const pool = require("../../base_datos");

//Registro de documento
const createDocument = async (req, res) => {
  try {
    const {
      doc_number,
      doc_type,
      firstSurname,
      lastSurname,
      name,
      file,
    } = req.body;
    const fullname = firstSurname + " " + lastSurname + " " + name;
    await pool.query(
      "call get_documents_ByDocNum_and_ByFullname(?, ?)",
      [doc_number, fullname],
      (error, results) => {
        if (error) throw error;
        if (results[0].length > 0) {
          return res.status(409).send({ Message: "It already exists" });
        }
        // caso contrario insertamos la persona
        pool.query(
          "call insert_documents(?, ?, ?, ?, ?, ?, ?, ?)",
          [
            doc_number,
            doc_type,
            firstSurname,
            lastSurname,
            name,
            file,
            /*created*/ new Date(Date.now()),
            /*state*/ "Pendiente",
          ],
          (error, results) => {
            if (error) throw error;
            return res
              .status(201)
              .send({ Message: "successfully created", results });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
  }
};

//Listar Personas
const listDocument = async (req, res) => {
  try {
    await pool.query("call get_documents()", (error, results) => {
      if (error) throw error;
      if (results[0].length > 0) {
        pool.query("call get_lastDocument()", (error, results1) => {
          if (error) throw error;
          //console.log(results1[0])
          return res.status(200).send({ Documentos: results[0], Ultimo_documento: results1[0] });
        });
      }
       else{
        res.status(404).send({ Message: "the list is empty" });
       }
    });
    //console.log(result[0]);
  } catch (error) {
    console.error(error);
  }
};
//Obtener una persona
const listOneDocument = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("call get_documents_ById(?)", [id], (error, results) => {
      if (error) throw error;
      if (results[0].length > 0)
        return res.status(200).send({ Documentos: results[0] });
      res.status(404).send({ Message: "Does not exist" });
    });
  } catch (error) {
    console.error(error);
  }
};

//editar persona
const editDocument = async (req, res) => {
  const { id } = req.params;
  try {
    //comprobamos que la persona a editar exista
    await pool.query("call get_documents_ById(?)", [id], (error, results) => {
      if (error) throw error;
      if (results[0].length > 0) {
        const {
          doc_number,
          doc_type,
          firstSurname,
          lastSurname,
          name,
          file,
          state,
        } = req.body;
        const fullname = firstSurname + " " + lastSurname + " " + name;
        //si la longitud del resultado es mayor que cero verificamos que el numero de documento
        pool.query(
          "call get_documents_ByDocNum_and_ByFullname_but_differentId(?,?,?)",
          [doc_number, fullname, id],
          (error, results1) => {
            if (error) throw error;
            if (results1[0].length > 0)
              return res
                .status(409)
                .send({ Message: "The document already exists" });
            //comparamos los cambios
            console.log(results[0][0]);
            if (
              doc_number == results[0][0].doc_number &&
              doc_type == results[0][0].doc_type &&
              firstSurname == results[0][0].firstSurname &&
              lastSurname == results[0][0].lastSurname &&
              name == results[0][0].name &&
              file == results[0][0].file &&
              state == results[0][0].state
            )
              return res.status(400).send({ Message: "Modifique algo" });
            pool.query(
              "call update_documents(?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                id,
                doc_number,
                doc_type,
                firstSurname,
                lastSurname,
                name,
                file,
                /*updated*/ new Date(Date.now()),
                state,
              ],
              (error, results2) => {
                if (error) throw error;
                return res.status(201).send({
                  Message: "It was updated successfully",
                  results2,
                });
              }
            );
          }
        );
      } else {
        res.status(404).send({ Message: "Does not exist" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//eliminar documento
const deleteDocument = async (req, res) => {
  const { id } = req.params;
  try {
    //comprobamos que el documento a eliminar exista
    await pool.query("call get_documents_ById(?)", [id], (error, results) => {
      if (error) throw error;
      if (results[0].length > 0) {
        pool.query("call delete_documents(?)", [id], (error, results1) => {
          if (error) throw error;
          res.status(200).send({ Message: "Deleted!" });
        });
      } else {
        res.status(404).send({ Message: "Does not exist" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createDocument,
  listDocument,
  listOneDocument,
  editDocument,
  deleteDocument,
};
