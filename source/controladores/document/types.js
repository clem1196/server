const pool = require("../../base_datos");

//Registro de types
const createTypes = async (req, res) => {
  const { name_type } = req.body;
  try {
    await pool.query(
      "call get_types_ByName(?)",
      [name_type],
      (err, result, fields) => {
        if (err) return res.status(409).send({ Message: err.sqlMessage });
        if (result[0].length > 0) {
          return res.status(409).send({ Message: "It already exists" });
        }
        // caso contrario insertamos un nuevo type
        pool.query(
          "call insert_types(?, ?, ?)",
          [name_type, /*created*/ new Date(Date.now()), /*state*/ 0],
          (err, results, fields) => {
            if (err) return res.status(409).send({ Message: err.sqlMessage });
            return res
              .status(201)
              .send({ Message: "successfully created", results, fields });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
  }
};

//Listar types
const listTypes = async (req, res) => {
  try {
    await pool.query("call get_types()", (err, result, fields) => {
      if (err) return res.status(409).send({ Message: err.sqlMessage });
      if (result[0].length > 0) {
        return res.status(200).send({ Tipos: result[0] });
      }
      res.status(404).send({ Message: "the list is empty" });
    });
  } catch (error) {
    console.error(error);
  }
};
//Obtener un type
const oneTypes = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("call get_types_ById(?)", [id], (err, result, fields) => {
      if (err) return res.status(409).send({ Message: err.sqlMessage });
      if (result[0].length > 0)
        return res.status(200).send({ tipo: result[0] });
      res.status(404).send({ Message: "Does not exist" });
    });
  } catch (error) {
    console.error(error);
  }
};

//editar type
const editTypes = async (req, res) => {
  try {
    const { id } = req.params;
    //obtenemos los datos del type a editar
    await pool.query("call get_types_ById(?)", [id], (err, result, fields) => {
      if (err) return res.status(409).send({ Message: err.sqlMessage });
      const { name_type, state } = req.body;
      const results = result;
      //console.log(results[0].length);
      if (results[0].length > 0) {
        //comprobamos que el campo único no se duplique
        return pool.query(
          "call get_types_ByName_but_differentId(?,?)",
          [name_type, id],
          (err, result, fields) => {
            if (err)
              //throw err;
              return res.status(409).send({ Message: err.sqlMessage });
            //comprobamos si el usuario ha modificado o no los campos
            if (
              results[0][0].name_type == name_type &&
              results[0][0].state == state
            ) {
              return res
                .status(409)
                .send({ Message: "Modify one of the fields" });
            } else {
              pool.query(
                "call update_types(?, ?, ?,?)",
                [id, name_type, /*updated*/ new Date(Date.now()), state],
                (err, results, fields) => {
                  if (err)
                    return res.status(409).send({ Message: err.sqlMessage });
                  return res.status(201).send({
                    Message: "It was updated successfully",
                    results,
                    fields,
                  });
                }
              );
            }
          }
        );
      } else {
        res.status(404).send({ Message: "The type does not exist" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
//Eliminar Types
const deleteTypes = async (req, res) => {
  try {
    const { id } = req.params;
    //comprobamos que el type a eliminar exista
    await pool.query("call get_types_ById(?)", [id], (err, result, fields) => {
      if (err) return res.status(409).send({ Message: err.sqlMessage });
      console.log(result[0]);
      if (result[0].length > 0) {
        return pool.query(
          "call get_documents_ByTypeid(?)",
          [id],
          (err, result, fields) => {
            if (err) return res.status(409).send({ Message: err.sqlMessage });
            if (result[0].lenth > 0) {
              pool.query(
                "call delete_documents_ByTypeid(?)",
                [id],
                (err, result, fields) => {
                  if (err)
                    return res.status(409).send({ Message: err.sqlMessage });
                  pool.query(
                    "call delete_types(?)",
                    [id],
                    (err, result, fields) => {
                      if (err)
                        return res
                          .status(409)
                          .send({ Message: err.sqlMessage });
                      return res.status(200).send({
                        Message: "Removed Relationship and type successfully",
                      });
                    }
                  );
                }
              );
            }
            pool.query("call delete_types(?)", [id], (err, result, fields) => {
              if (err) return res.status(409).send({ Message: err.sqlMessage });
              return res
                .status(200)
                .send({ Message: "Removed type successfully" });
            });
          }
        );
      }
      res.status(404).send({ Message: "The type does not exist" });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createTypes,
  listTypes,
  oneTypes,
  editTypes,
  deleteTypes,
};
