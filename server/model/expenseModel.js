const pgsdb = require('../library/pgsdb');
const db = new pgsdb();

const createExpense = async (data) => {
    const expenseTable = `service.expenses`;
    let result = await db.insert(expenseTable, data);
    return result;
}

const getAllExpenses = async (user) => {
    let query = `SELECT e.* ,TO_CHAR(e.expense_date, 'DD-Mon-YYYY') AS formatted_expense_date,c.name AS category_name ,u.username AS assigned_to_username
    from service.expenses e LEFT JOIN  service.categories c ON e.expense_type = c.category_id
    LEFT JOIN service.ticket t ON e.sr_id = t.sr_id
    LEFT JOIN public.users u ON t.assigned_to = u.userid `;
    let ticketIds = [];
    if (user.role === 'Manager' || user.role === 'Employee') {
        const Tickets = await db.raw(`
          SELECT sr_id 
          FROM service.ticket 
          WHERE ${user.role == "Manager" ? `assigned_by = ${user.id}` : `assigned_to = ${user.id}` }
        `);
        // console.log(Tickets);
        const ticketRows = Array.isArray(Tickets[0]) ? Tickets[0] : Tickets;
        ticketIds = ticketRows.map(row => row.sr_id);
        console.log(ticketIds);
        if (ticketIds.length === 0) {
          return [];
        }
        query += ` WHERE e.sr_id IN (${ticketIds.map((ticket) =>ticket ).join(',')}) `;
      }
    
      query += ` ORDER BY e.sr_id DESC, e.expense_date `;
    
      const results = await db.raw(query);
    return results;
}


const getExpenses = async (id) => {
    const query = `SELECT e.* ,TO_CHAR(e.expense_date, 'DD-Mon-YYYY') AS formatted_expense_date,c.name AS category_name from service.expenses e LEFT JOIN 
    service.categories c ON e.expense_type = c.category_id  Where sr_id = ${id}`;
    const results = await db.raw(query);
    return results;
}


const deleteExpense = async (id) => {
    const expenseTable = `service.expenses`;
    const result = await db.delete(expenseTable, [`expense_id = '${id}'`]);
    return result;
}





module.exports = {
    createExpense,
    getExpenses,
    getAllExpenses,
    deleteExpense  
}