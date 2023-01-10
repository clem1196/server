const pool= require("../../../base_datos");
const querys=async (req, res) => {
    try {
        const id=req.params.id;
        const dni=req.body.dni;
        const doc_number=req.body.doc_number;
        const documentid=req.body.idusuario;
        const personid=req.body.idroles;
        let lists={
            //*DOCUMENTS
            //documento por id
            documents_ById: await pool.query('call get_documents_ById(?)', [id]), 
            //documento por numero de documento         
            documents_ByNumDoc : await pool.query('call get_documents_ByNumDoc(?)', [doc_number]),
            //lista de documentos por dni
            //documents_ByDni : await pool.query('call get_documents_ByDni(?)', [dni]),
            //lista de roles por el nombre rol pero diferente id
            documents_ByDocNum_but_differentId: await pool.query("call get_documents_ByDocNum_but_differentId(?,?)",
            [doc_number, id]),
            //lista de roles
            documents: await pool.query('call get_documents()'),

            //PERSONS
            //personas por id
            persons_ById: await pool.query('call get_persons_ById(?)', [id]),
            //personas por dni
            persons_ByDni : await pool.query('call get_persons_ByDni(?)', [dni]),
            //personas por dni pero diferente id
            persons_ByDni_but_differentId : await pool.query('call get_persons_ByDni_but_differentId(?, ?)', [dni, id]),
            //lista de personas
            persons: await pool.query('call get_persons()'),

            //DOCUMENT_PERSON
            //document_person por id            
            doc_persons_ById: await pool.query('call get_doc_persons_ById(?)', [id]),
            //document_person por documentid            
            doc_persons_ByDocumentId : await pool.query('call get_doc_persons_ByDocumentId(?)', [documentid]), 
            //document_person por personid           
            doc_persons_ByPersonId : await pool.query('call get_doc_persons_ByPersonId(?)', [personid]),
            //document_person por documentid y personid
            doc_persons_ByDocumentId_and_ByPersonId : await pool.query(' call get_doc_persons_ByDocumentId_and_ByPersonId(?, ?)', [documentid, personid]),
            //document_person por documentid, personid y id
            doc_persons_ByDocumentId_and_ByPersonId_but_differentId : await pool.query(' call get_doc_persons_ByDocumentId_and_ByPersonId_but_differentId(?, ?, ?)', [documentid, personid, id]),
             //lista de doc_persons            
            doc_persons_ByDocNumber_and_PersonFullname: await pool.query('call get_doc_persons_ByDocNumber_and_PersonFullname()'),
            //lista de doc_persons            
            doc_persons: await pool.query('call get_doc_persons()')
        }
        //este objeto lists lo usaremos en el frontend            
        return res.status(200).send({
            lists:lists
        })
    } catch (error) {
        console.log(error)
    }
};
module.exports={querys}