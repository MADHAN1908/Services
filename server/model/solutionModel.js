const pgsdb = require('../library/pgsdb');
const db = new pgsdb();


  const createSolution = async (data) => {
    const solutionTable =`service.solution`;
        let result = await db.insert(solutionTable,data);
        return result;
    
}

const addSolution = async (data) => {
    const solutionTable =`service.solution`;
    let result = await db.insert(solutionTable, data);
    return result;
    
}

const getTicketSolutions = async (id) => {
    const query = `SELECT s.*,TO_CHAR(s.status_date, 'DD-MON-YYYY') AS formated_date, u.username as responsibility_name FROM service.solution AS s
 LEFT JOIN public.users AS u 
 ON s.responsibility = u.userid 
 WHERE  s.sr_id = ${id}  ORDER BY s.solution_id ASC`;
 const results = await db.raw(query);
 return results;
}


const deleteSolution = async (id) => {
    const solutionTable = `service.solution`;
    const result = await db.delete(solutionTable, [`solution_id = '${id}'`]);
    return result;
}

const updateSolution = async (id,data) => {
    const solutionTable = `service.solution`;
    const result = await db.update(solutionTable, data, [`solution_id = '${id}'`]);
    return result[0];
}

const uploadAttachment = async (id,data) => {
    const solutionTable = `service.solution`;
    const results = await db.update(solutionTable, data, [`solution_id = '${id}'`]);
    return  results;   
}


module.exports = {
    createSolution,
    addSolution,
    getTicketSolutions,
    deleteSolution,
    updateSolution,
    uploadAttachment
    
}