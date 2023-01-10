const pool = require("../../base_datos");

//Registro de documentos
const crearDoc = async (req, res) => {
  const { doc_type, doc_number, file } = req.body;
  const token = req.headers.authorization;
  const userId = JSON.parse(atob(token.split(".")[1])).userId;
  try {
    const result = await pool.query("call get_documents_ByNumDoc(?)", [
      doc_number,
    ]);

    if (result[0].length > 0) {
      return res.status(409).send({ Message: "It already exists" });
    }
    // caso contrario insertamos un nuevo documento
    await pool.query(
      "call insert_documents(?, ?, ?, ?, ?, ?)",
      [
        userId,
        doc_type,
        doc_number,
        file,
        /*created*/ new Date(Date.now()),
        /*state*/ 0,
      ],
      (error, results, fields) => {
        if (error) throw error;
        return res
          .status(201)
          .send({ Message: "successfully created", results, fields });
      }
    );
  } catch (error) {
    console.error(error);
  }
};

//Listar Documentos
const listarDoc = async (req, res) => {
  try {
    const result = await pool.query("call get_documents()");
    if (result[0].length > 0) {
      return res.status(200).send({ Documentos: result[0] });
    }
    res.status(404).send({ Message: "the list is empty" });
    console.log(result[0]);
  } catch (error) {
    console.error(error);
  }
};
//Obtener un usuario
const obtenerUnDoc = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("call get_documents_ById(?)", [id]);
    console.log(result[0]);
    if (result[0].length > 0)
      return res.status(200).send({ documento: result[0] });
    res.status(404).send({ Message: "Does not exist" });
  } catch (error) {
    console.error(error);
  }
};

//editar usuario
const editDoc = async (req, res) => {
  const { id } = req.params;
  //comprobamos que el documento a editar ya exista
  const result = await pool.query("call get_documents_ById(?)", [id]);
  try {
    if (result[0].length > 0) {
      const { userid, doc_type, doc_number, file, state } = req.body;
      //si la longitud del resultado es mayor que cero verificamos que el numero de documento no se se repita
      const result1 = await pool.query(
        "call get_documents_ByDocNum_but_differentId(?,?)",
        [doc_number, id]
      );
      if (result1[0].length > 0)
        return res
          .status(409)
          .send({ Message: "The document number already exists" });
      if (
        userid == result[0][0].userid &&
        doc_type == result[0][0].doc_type &&
        doc_number == result[0][0].doc_number &&
        file == result[0][0].file &&
        state == result[0][0].state
      )
        return res.status(400).send({ Message: "Modifique algo" });
      await pool.query(
        "call update_documents_ById(?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          userid,
          doc_type,
          doc_number,
          file,
          /*updated*/ new Date(Date.now()),
          state,
        ],
        (error, results, fields) => {
          if (error) throw error;
          return res.status(201).send({
            Message: "It was updated successfully",
            results,
            fields,
          });
        }
      );
    } else {
      res.status(404).send({ Message: "Does not exist" });
    }
  } catch (error) {
    console.log(error);
  }
};
//eliminar documento
const deleteDoc = async (req, res) => {
  const { id } = req.params;
  //comprobamos que el documento a eliminar exista
  const result = await pool.query("call get_documents_ById(?)", [id]);
  console.log(result[0]);
  try {
    if (result[0].length > 0) {
      //si el resultado es mayor que cero consultamos si el documento a eliminar está relacionado
      //con alguna persona
      const consultarRelacion = await pool.query(
        "call get_doc_persons_ByDocumentId(?)",
        [id]
      );
      if (consultarRelacion[0].length > 0) {
        //si el resultado es mayor que cero eliminamos primero esa o relación
        //luego eliminamos el usuario
        await pool.query("call delete_doc_persons_ByDocumentId(?)", [id]);
        await pool.query("call delete_documents(?)", [id]);
        return res.status(200).send({
          Message: "Se eliminó la relacion y el documento correctamente",
        });
      } else {
        //caso conmtrario eliminamos solo al documento
        await pool.query("call delete_documents(?)", [id]);
        return res
          .status(200)
          .send({ Message: "Se eliminó el documento correctamente" });
      }
    } else {
      res.status(404).send({ Message: "El documento no existe" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  crearDoc,
  listarDoc,
  obtenerUnDoc,
  editDoc,
  deleteDoc,
};
