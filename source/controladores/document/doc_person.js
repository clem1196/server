const pool = require("../../base_datos");

//Registro de doc_person
const addDoc_person = async (req, res) => {
  const { documentid, personid, attended_by } = req.body;
  try {
    const doc = await pool.query("call get_documents_ById(?)", [documentid]);
    const pers = await pool.query("call get_persons_ById(?)", [personid]);
    if (doc[0].length > 0 && pers[0].length > 0) {
      const result = await pool.query(
        "call get_doc_persons_ByDocumentId_and_ByPersonId(?, ?)",
        [documentid, personid]
      );
      if (result[0].length > 0) {
        return res.status(409).send({ Message: "It already exists" });
      }
      // caso contrario insertamos una nueva relación document_person
      await pool.query(
        "call insert_doc_persons(?, ?, ?, ?)",
        [documentid, personid, /*created*/ new Date(Date.now()), attended_by],
        (error, results) => {
          if (error) throw error;
          return res
            .status(201)
            .send({ Message: "successfully created", results });
        }
      );
    }
    res.status(404).send({Message:" el documentid o personid no son validos"})
  } catch (error) {
    console.error(error);
  }
};

//obtener toda las relaciones usuarios_roles
const listDoc_person = async (req, res) => {
  try {
    //traemos a todas las relaciones
    const result = await pool.query("call get_doc_persons()");
    if (result[0].length > 0)
      //si esto es verdad que me muestre el result[0]
      return res.status(200).send({ result: result[0] });
    //caso contrario
    res.status(404).send({
      Message: "No hay ninguna relacion document_persons que mostrar",
    });
  } catch (error) {
    console.log(error);
  }
};

//obtener una relacion usuarios_roles

const listOneDoc_person = async (req, res) => {
  const { id } = req.params;
  try {
    //traemos solo una relacion a traves de su id
    const result = await pool.query("call get_doc_persons_ById(?)", [id]);
    if (result[0].length > 0)
      //si la longitud del resultado es mayor que 0 que me muestra el user_rol[0]
      return res.status(200).send({ result: result[0] });
    //caso contrario
    res.status(404).send({ Message: "La relación no existe" });
  } catch (error) {
    console.log(error);
  }
};

//editar document_person
const editDoc_person = async (req, res) => {
  const { id } = req.params;
  const { documentid, personid, attended_by, state } = req.body;
  try {
    //obtenemos una relacion mediante su id
    const result = await pool.query("call get_doc_persons_ById(?)", [id]);
    //si el id existe
    if (result[0].length > 0) {
      const doc = await pool.query("call get_documents_ById(?)", [documentid]);
      const pers = await pool.query("call get_persons_ById(?)", [personid]);
      //si doc y pers es mayor que cero
      if (doc[0].length > 0 && pers[0].length > 0) {
        const result1 = await pool.query(
          "call get_doc_persons_ByDocumentId_and_ByPersonId_but_differentId(?,?,?)",
          [documentid, personid, id]
        );
        //si documentid y personid existen en la tabla document_person
        if (result1[0].length > 0)
          return res
            .status(400)
            .send({ Message: "la relacion doc_person ya existe" });
        //si documentid, personid, attended_by de la relacion es igual al del req.body
        if (
          documentid == result[0][0].documentid &&
          personid == result[0][0].personid &&
          attended_by == result[0][0].attended_by&
          state == result[0][0].state
        )
          return res.status(400).send({ Message: "debe modificar algo" });

        //actualizamos la relacion
        await pool.query(
          "call update_doc_persons(?,?,?,?,?,?)",
          [
            documentid,
            personid,
            /*updated*/ new Date(Date.now()),
            attended_by,
            state,
            id,
          ],
          (error, results) => {
            if (error) throw error;
            return res.status(201).send({
              Message: "La relación se actualizó correctamente",
              results,
            });
          }
        );
      } else {
        //si idusuario y idroles no son válidos
        res
          .status(404)
          .send({ Message: "El documentid o personid no son validos" });
      }
    } else {
      //si la relacion no existe
      return res
        .status(404)
        .send({ Message: "La relacion document_person no existe" });
    }
  } catch (error) {
    console.log(error);
  }
};

//eliminar document_person

const deleteDoc_person = async (req, res) => {
  const { id } = req.params;
  try {
    //traemos la relacion que vamos eliminar
    const result = await pool.query("call get_doc_persons_ById(?)", [id]);
    if (result[0].length > 0) {
      //si la relacion existe
      await pool.query("call delete_doc_persons(?)", [id]);
      return res.status(200).send({
        Message: "La relacion se elimió correctamente",
      });
    } else {
      res.status(404).send({ Message: "La relación no existe" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addDoc_person,
  listDoc_person,
  listOneDoc_person,
  editDoc_person,
  deleteDoc_person,
};
