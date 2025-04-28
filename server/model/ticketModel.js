const pgsdb = require('../library/pgsdb');
const db = new pgsdb();

const createTicket = async (data) => {
    const ticketTable = `service.ticket`;
    let results = await db.insert(ticketTable, data);
    return results;
}

const getTicket = async (id) => {
    const query = `SELECT t.*,
    TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date,
    TO_CHAR(t.plan_in_time, 'DD-MON-YYYY HH:MI') AS plan_in_date,
    TO_CHAR(t.act_in_time, 'DD-MON-YYYY HH:MI') AS act_in_date,
    TO_CHAR(t.act_out_time, 'DD-MON-YYYY HH:MI') AS act_out_date,
     u.username as contact_person_name FROM service.ticket AS t
 INNER JOIN public.users AS u ON t.contact_person = u.userid
 Where t.sr_id = ${id}`;
    const result = await db.raw(query);
    return result[0];
}

const getAllTickets = async (user) => {
    let query;
    if (user.role === "Admin"){
     query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date, u.username as contact_person_name,
     a.username as assigned_to_name,m.username as assigned_by_name FROM service.ticket AS t
 INNER JOIN public.users AS u ON t.contact_person = u.userid
 LEFT JOIN public.users AS a ON t.assigned_to = a.userid 
 LEFT JOIN public.users AS m ON t.assigned_by = m.userid 
 ORDER BY reported_date DESC`;
    }else if (user.role === "Manager"){
        query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date, u.username as contact_person_name,a.username as assigned_to_name,m.username as assigned_by_name FROM service.ticket AS t
    INNER JOIN public.users AS u ON t.contact_person = u.userid
    LEFT JOIN public.users AS a ON t.assigned_to = a.userid
     LEFT JOIN public.users AS m ON t.assigned_by = m.userid  Where t.assigned_by = ${user.id} OR t.created_by = ${user.id} ORDER BY reported_date DESC`;
       }else if (user.role === "Employee"){
        query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date, u.username as contact_person_name,a.username as assigned_to_name,m.username as assigned_by_name FROM service.ticket AS t
    INNER JOIN public.users AS u ON t.contact_person = u.userid
    LEFT JOIN public.users AS a ON t.assigned_to = a.userid
     LEFT JOIN public.users AS m ON t.assigned_by = m.userid  Where t.assigned_to = ${user.id} OR t.created_by = ${user.id} ORDER BY reported_date DESC`;
       }
    const results = await db.raw(query);
    return results;
}



const getCustomerTickets = async (id) => {
    const query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date, u.username as assigned_to_name FROM service.ticket AS t
 LEFT JOIN public.users AS u 
 ON t.assigned_to = u.userid 
 WHERE  t.contact_person = ${id}  ORDER BY reported_date DESC`;
    const results = await db.raw(query);
    return results;
}

const getAssignTickets = async () => {
    const query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date, u.username as contact_person_name,a.username as assigned_to_name,
    m.username as assigned_by_name FROM service.ticket AS t
 LEFT JOIN public.users AS u ON t.contact_person = u.userid 
 LEFT JOIN public.users AS a ON t.assigned_to = a.userid
 LEFT JOIN public.users AS m ON t.assigned_by = m.userid
 WHERE  t.assigned_to IS NULL OR sr_status IN ('P','X')    ORDER BY reported_date DESC`;
    const results = await db.raw(query);
    return results;
}

const getAssignedTickets = async (id,role) => {
    let query;
    if(role == "Admin"){
        query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date ,TO_CHAR(t.plan_in_time, 'DD-MON-YYYY HH:MM') AS plan_in_date, u.username as contact_person_name,
        a.username as assigned_to_name,m.username as assigned_by_name FROM service.ticket AS t
 LEFT JOIN public.users AS u ON t.contact_person = u.userid 
 LEFT JOIN public.users AS a ON t.assigned_to = a.userid
 LEFT JOIN public.users AS m ON t.assigned_by = m.userid
 Where t.sr_status NOT IN ('X')
 AND (
        t.sr_status != 'Z'
        OR (t.sr_status = 'Z' AND DATE(t.closed_at) = CURRENT_DATE) 
    )
 ORDER BY reported_date DESC`;
    }else if(role == "Manager"){
        // console.log(id,role);
        query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date, u.username as contact_person_name,
        a.username as assigned_to_name,m.username as assigned_by_name FROM service.ticket AS t
    LEFT JOIN public.users AS u ON t.contact_person = u.userid
    LEFT JOIN public.users AS a ON t.assigned_to = a.userid
    LEFT JOIN public.users AS m ON t.assigned_by = m.userid 
    WHERE  t.assigned_by = ${id} AND t.sr_status NOT IN ('X') 
     AND (
        t.sr_status != 'Z'
        OR (t.sr_status = 'Z' AND DATE(t.closed_at) = CURRENT_DATE) 
    )
         ORDER BY reported_date DESC`;
       }else{
     query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date, u.username as contact_person_name,
     a.username as assigned_to_name,m.username as assigned_by_name FROM service.ticket AS t
 LEFT JOIN public.users AS u ON t.contact_person = u.userid
 LEFT JOIN public.users AS a ON t.assigned_to = a.userid
 LEFT JOIN public.users AS m ON t.assigned_by = m.userid
 WHERE  t.assigned_to = ${id} 
  AND (
        t.sr_status != 'Z'
        OR (t.sr_status = 'Z' AND DATE(t.closed_at) = CURRENT_DATE) 
    )  
        ORDER BY reported_date DESC`;}

    const results = await db.raw(query);
    return results;
}

const getCloseTickets = async (id,role) => {
    let query;
    // console.log(id,role);
    if(role == "Admin"){
        query = `SELECT 
    t.*,
    TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date,
    TO_CHAR(t.act_in_time, 'DD-MON-YYYY HH:MI') AS actf_in_time,
    TO_CHAR(t.act_out_time, 'DD-MON-YYYY HH:MI') AS actf_out_time,
    TO_CHAR(t.customer_in_time, 'DD-MON-YYYY HH:MI') AS customerf_in_time,
    TO_CHAR(t.customer_out_time, 'DD-MON-YYYY HH:MI') AS customerf_out_time,
    a.username AS assigned_to_name,
	u.username AS contact_person_name,
	c.company_name,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'solution_id', s.solution_id,
                'problem', s.problem,
                'actions', s.actions,
                'status', s.service_status,
                'completion_date', TO_CHAR(s.status_date, 'DD-MON-YYYY'),
                'status_remark', s.status_remark,
                'customer_remark', s.customer_feedback
            )
        ) FILTER (WHERE s.solution_id IS NOT NULL), 
        '[]' -- If no solutions exist, return an empty array
    ) AS solutions
FROM service.ticket AS t
LEFT JOIN public.users AS a ON t.assigned_to = a.userid
LEFT JOIN public.users AS u ON t.contact_person = u.userid
LEFT JOIN public.company AS c ON t.company_id = c.company_id
LEFT JOIN service.solution AS s ON t.sr_id = s.sr_id
Where t.sr_status IN ('Z')
GROUP BY t.sr_id, a.username,u.username,c.company_name`;
    }else if(role == "Manager"){
        // console.log(id,role);
        query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date, u.username as contact_person_name FROM service.ticket AS t
    LEFT JOIN public.users AS u 
    ON t.contact_person = u.userid 
    WHERE  t.assigned_by = ${id}  ORDER BY reported_date DESC`;
       }else{
     query = `SELECT t.*,TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date, u.username as contact_person_name FROM service.ticket AS t
 LEFT JOIN public.users AS u 
 ON t.contact_person = u.userid 
 WHERE  t.assigned_to = ${id}  ORDER BY reported_date DESC`;
    }
    const results = await db.raw(query);
    return results;
}

const getReport = async (id) => {
       const query = `SELECT 
    t.*,
    TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date,
    TO_CHAR(t.act_in_time, 'DD-MON-YYYY HH:MI') AS actf_in_time,
    TO_CHAR(t.act_out_time, 'DD-MON-YYYY HH:MI') AS actf_out_time,
    TO_CHAR(t.customer_in_time, 'DD-MON-YYYY HH:MI') AS customerf_in_time,
    TO_CHAR(t.customer_out_time, 'DD-MON-YYYY HH:MI') AS customerf_out_time,
    a.username AS assigned_to_name,
    a.email AS assigned_to_email,
    m.email AS assigned_by_email,
	u.username AS contact_person_name,
    u.email AS customer_email,
	c.company_name,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'solution_id', s.solution_id,
                'problem', s.problem,
                'actions', s.actions,
                'status', s.service_status,
                'completion_date', TO_CHAR(s.status_date, 'DD-MON-YYYY'),
                'status_remark', s.status_remark,
                'customer_remark', s.customer_feedback
            )
        ) FILTER (WHERE s.solution_id IS NOT NULL), 
        '[]' -- If no solutions exist, return an empty array
    ) AS solutions
FROM service.ticket AS t
LEFT JOIN public.users AS a ON t.assigned_to = a.userid
LEFT JOIN public.users AS u ON t.contact_person = u.userid
LEFT JOIN public.users AS m ON t.assigned_by = m.userid
LEFT JOIN public.company AS c ON t.company_id = c.company_id
LEFT JOIN service.solution AS s ON t.sr_id = s.sr_id
Where t.sr_status IN ('C','Y','Z') and t.sr_id = ${id}
GROUP BY t.sr_id, a.username,u.username,c.company_name,a.email,u.email,m.email`;
   
    const results = await db.raw(query);
    return results;
}

const getTicketsReport = async (data,user) => {
    let query;
    console.log(user);
        query = `SELECT 
    t.*,
    TO_CHAR(t.sr_date, 'DD-MON-YYYY') AS srf_date,
    TO_CHAR(t.act_in_time, 'DD-MON-YYYY HH:MI') AS actf_in_time,
    TO_CHAR(t.act_out_time, 'DD-MON-YYYY HH:MI') AS actf_out_time,
    TO_CHAR(t.customer_in_time, 'DD-MON-YYYY HH:MI') AS customerf_in_time,
    TO_CHAR(t.customer_out_time, 'DD-MON-YYYY HH:MI') AS customerf_out_time,
    a.username AS assigned_to_name,
	u.username AS contact_person_name,
	c.company_name,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'solution_id', s.solution_id,
                'problem', s.problem,
                'actions', s.actions,
                'status', s.service_status,
                'completion_date', TO_CHAR(s.status_date, 'DD-MON-YYYY'),
                'status_remark', s.status_remark,
                'customer_remark', s.customer_feedback
            )
        ) FILTER (WHERE s.solution_id IS NOT NULL), 
        '[]' -- If no solutions exist, return an empty array
    ) AS solutions
FROM service.ticket AS t
LEFT JOIN public.users AS a ON t.assigned_to = a.userid
LEFT JOIN public.users AS u ON t.contact_person = u.userid
LEFT JOIN public.company AS c ON t.company_id = c.company_id
LEFT JOIN service.solution AS s ON t.sr_id = s.sr_id
Where t.sr_status IN ('Z')  ${user.role == "Admin" ? "" : user.role == "Manager" ? `AND t.assigned_by =$3` : `AND t.assigned_to = $3`}
AND t.sr_date BETWEEN $1 AND $2   GROUP BY t.sr_id, a.username,u.username,c.company_name`;
    const results = await db.raw(query,[data.from_date,data.to_date,user.id]);
    return results;
}



const deleteTicket = async (id) => {
    const ticketTable = `service.ticket`;
    const result = await db.delete(ticketTable, [`sr_id = '${id}'`]);
    return result;
}


const updateTicket = async (data,id) => {
    const ticketTable = `service.ticket`;
    const result = await db.update(ticketTable,data, [`sr_id = '${id}'`]);
    return result;
}



module.exports = {
    createTicket,
    getAllTickets,
    getTicket,
    getCustomerTickets,
    getAssignTickets,
    getAssignedTickets,
    getCloseTickets,
    getReport,
    getTicketsReport,
    deleteTicket,
    updateTicket
    
}