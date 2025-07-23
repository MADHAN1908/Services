const pgsdb = require('../library/pgsdb');
const db = new pgsdb();

const createCheckIn = async (data) => {
    const checkInTable = `service.sr_checkins`;
    let result = await db.insert(checkInTable, data);
    return result;
}


const getCheckIn = async (id) => {
    const query = `SELECT c.*,TO_CHAR(c.date_time, 'DD-MON-YYYY HH24:MI') AS formated_date, u.username as check_in_name FROM service.sr_checkins AS c
 LEFT JOIN public.users AS u 
 ON c.user_id = u.userid 
 WHERE  c.sr_id = ${id}  ORDER BY c.id desc `;
 const results = await db.raw(query);
 return results;
}


module.exports = {
    createCheckIn,
    getCheckIn
}