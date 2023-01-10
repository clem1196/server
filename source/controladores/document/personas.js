const pool = require("../../base_datos");

//Registro de personas
const createPerson = async (req, res) => {
  const { dni, firstSurname, lastSurname, name } = req.body;
  try {
    const duplicateInDni = await pool.query("call get_persons_ByDni(?)", [dni]);
    console.log(duplicateInDni[0]);
    console.log(firstSurname, lastSurname, name);
    if (duplicateInDni[0].length > 0) {
      return res.status(409).send({ Message: "It already exists" });
    }
    // caso contrario insertamos la persona
    await pool.query(
      "call insert_person(?, ?, ?, ?, ?, ?)",
      [
        dni,
        firstSurname,
        lastSurname,
        name,
        /*created*/ new Date(Date.now()),
        /*state*/ 0,
      ],
      (error, results) => {
        if (error) throw error;
        return res
          .status(201)
          .send({ Message: "successfully created", results });
      }
    );
  } catch (error) {
    console.error(error);
  }
};

//Listar Personas
const listPerson = async (req, res) => {
  try {
    const result = await pool.query("call get_persons()");
    if (result[0].length > 0) {
      return res.status(200).send({ Personas: result[0] });
    }
    res.status(404).send({ Message: "the list is empty" });
    console.log(result[0]);
  } catch (error) {
    console.error(error);
  }
};
//Obtener una persona
const listOnePerson = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("call get_persons_ById(?)", [id]);
    console.log(result[0]);
    if (result[0].length > 0)
      return res.status(200).send({ Persona: result[0] });
    res.status(404).send({ Message: "Does not exist" });
  } catch (error) {
    console.error(error);
  }
};

//editar persona
const editPerson = async (req, res) => {
  const { id } = req.params;
  //comprobamos que la persona a editar exista
  const result = await pool.query("call get_persons_ById(?)", [id]);
  try {
    if (result[0].length > 0) {
      const { dni, firstSurname, lastSurname, name, state } = req.body;
      //si la longitud del resultado es mayor que cero verificamos que el numero de dni no se se repita
      const result1 = await pool.query(
        "call get_persons_ByDni_but_differentId(?,?)",
        [id, dni]
      );
      if (result1[0].length > 0)
        return res.status(409).send({ Message: "The person already exists" });
      //comparamos los cambios
      if (
        dni == result[0][0].dni &&
        firstSurname == result[0][0].firstSurname &&
        lastSurname == result[0][0].lastSurname &&
        name == result[0][0].name &&
        state == result[0][0].state
      )
        return res.status(400).send({ Message: "Modifique algo" });
      await pool.query(
        "call update_persons_ById(?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          dni,
          firstSurname,
          lastSurname,
          name,
          /*updated*/ new Date(Date.now()),
          state,
        ],
        (error, results) => {
          if (error) throw error;
          return res.status(201).send({
            Message: "It was updated successfully",
            results,
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

const deletePerson = async (req, res) => {
  const { id } = req.params;
  //comprobamos que el documento a eliminar exista
  const result = await pool.query("call get_persons_ById(?)", [id]);
  console.log(result[0]);
  try {
    if (result[0].length > 0) {
      //si el resultado es mayor que cero consultamos si la persona a eliminar está relacionado
      //con algun documento
      const consultarRelacion = await pool.query(
        "call get_doc_persons_ByPersonId(?)",
        [id]
      );
      if (consultarRelacion[0].length > 0) {
        //si el resultado es mayor que cero eliminamos primero esa o relación
        //luego eliminamos el la persona
        await pool.query("call delete_doc_persons_ByPersonId(?)", [id]);
        await pool.query("call delete_persons(?)", [id]);
        return res.status(200).send({
          Message: "Se eliminó la relacion y la persona correctamente",
        });
      } else {
        //caso contrario eliminamos solo a la persona
        await pool.query("call delete_persons(?)", [id]);
        return res
          .status(200)
          .send({ Message: "Se eliminó a la persona correctamente" });
      }
    } else {
      res.status(404).send({ Message: "Does not exist" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createPerson,
  listPerson,
  listOnePerson,
  editPerson,
  deletePerson,
};
