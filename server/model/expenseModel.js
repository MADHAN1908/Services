const pgsdb = require('../library/pgsdb');
const db = new pgsdb();

const createExpense = async (data) => {
    const expenseTable = `service.expenses`;
    let result = await db.insert(expenseTable, data);
    return result;
}

const getExpenses = async (id) => {
    const query = `SELECT * from service.expenses Where sr_id = ${id}`;
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
    deleteExpense
    
}