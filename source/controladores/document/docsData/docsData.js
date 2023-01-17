const pool = require("../../../base_datos");
const querys = async (req, res) => {
  try {
    //parametros
    const id = req.params.id;
    const {
      firstSurname,
      lastSurname,
      name,
      doc_number,
      documentid,
      personid,
      name_type,
      typeid,
    } = req.body;

    let lists = {
      //*DOCUMENTS
      //documento por id
      documents_ById: await pool.query("call get_documents_ById(?)", [id]),
      //documento por numero de documento
      documents_ByNumDoc: await pool.query("call get_documents_ByNumDoc(?)", [
        doc_number,
      ]),
      //documento por type documento
      documents_ByTypeid: await pool.query("call get_documents_ByTypeid(?)", [
        typeid,
      ]),
      //lista de documentos por numero de documentos pero diferente id
      documents_ByDocNum_but_differentId: await pool.query(
        "call get_documents_ByDocNum_but_differentId(?,?)",
        [doc_number, id]
      ),
      //lista de roles
      documents: await pool.query("call get_documents()"),

      //*TYPES
      //type por id
      types_ById: await pool.query("call get_types_ById(?)", [id]),
      //type por nombre
      types_ByName: await pool.query("call get_types_ByName(?)", [name_type]),
      //type por nombre
      types_ByName_but_differentId: await pool.query(
        "call get_types_ByName_but_differentId(?,?)",
        [name_type, id]
      ),
      //types
      types: await pool.query("call get_types()"),

      //PERSONS
      //personas por id
      persons_ById: await pool.query("call get_persons_ById(?)", [id]),
      //personas por dni
      persons_ByNames: await pool.query("call get_persons_ByNames(?,?,?)", [
        firstSurname,
        lastSurname,
        name,
      ]),
      //personas por dni pero diferente id
      persons_ByNames_but_differentId: await pool.query(
        "call get_persons_ByNames_but_differentId(?, ?,?,?)",
        [firstSurname, lastSurname, name, id]
      ),
      //lista de personas
      persons: await pool.query("call get_persons()"),

      //DOCUMENT_PERSON
      //document_person por id
      doc_persons_ById: await pool.query("call get_doc_persons_ById(?)", [id]),
      //document_person por documentid
      doc_persons_ByDocumentId: await pool.query(
        "call get_doc_persons_ByDocumentId(?)",
        [documentid]
      ),
      //document_person por personid
      doc_persons_ByPersonId: await pool.query(
        "call get_doc_persons_ByPersonId(?)",
        [personid]
      ),
      //document_person por documentid y personid
      doc_persons_ByDocumentId_and_ByPersonId: await pool.query(
        " call get_doc_persons_ByDocumentId_and_ByPersonId(?, ?)",
        [documentid, personid]
      ),
      //document_person por documentid, personid y id
      doc_persons_ByDocumentId_and_ByPersonId_but_differentId: await pool.query(
        " call get_doc_persons_ByDocumentId_and_ByPersonId_but_differentId(?, ?, ?)",
        [documentid, personid, id]
      ),
      //lista de doc_persons
      doc_persons_ByDocNumber_and_PersonFullname: await pool.query(
        "call get_doc_persons_ByDocNumber_and_PersonFullname()"
      ),
      //lista de doc_persons
      doc_persons: await pool.query("call get_doc_persons()"),
    };
    //este objeto lists lo usaremos en el frontend
    return res.status(200).send({
      lists: lists,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { querys };
