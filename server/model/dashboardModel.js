const pgsdb = require('../library/pgsdb');
const db = new pgsdb();

const getPriorityByStatus = async () => {
    const query = `select priority , count(sr_id) as ticket_count,COUNT(CASE WHEN sr_status = 'X' THEN 1 END) AS pending,
  COUNT(CASE WHEN sr_status = 'P' THEN 1 END) AS assigned,
  COUNT(CASE WHEN sr_status = 'W' THEN 1 END) AS in_progress,
  COUNT(CASE WHEN sr_status = 'C' THEN 1 END) AS completed,
  COUNT(CASE WHEN sr_status = 'Z' THEN 1 END) AS closed from service.ticket group by priority`;
    const results = await db.raw(query);
    return results;
}

const getCompanyByStatus = async () => {
    const query = `select c.company_name , count(c.company_id) as ticket_count,
COUNT(CASE WHEN t.sr_status = 'X' THEN 1 END) AS pending,
  COUNT(CASE WHEN t.sr_status = 'P' THEN 1 END) AS assigned,
  COUNT(CASE WHEN t.sr_status = 'W' THEN 1 END) AS in_progress,
  COUNT(CASE WHEN t.sr_status = 'C' THEN 1 END) AS completed,
  COUNT(CASE WHEN t.sr_status = 'Z' THEN 1 END) AS closed from company c join service.ticket t on  c.company_id = t.company_id
 group by c.company_id`;
    const results = await db.raw(query);
    return results;
}



module.exports = {
    getPriorityByStatus,
    getCompanyByStatus,
    
}