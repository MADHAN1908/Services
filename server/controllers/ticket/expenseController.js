
const expenseModel = require('../../model/expenseModel');

const createExpense = async (req, res) => {
 const user = req.user;
 let expenseDate = new Date(req.body.expense_date);
let formattedDate = expenseDate.toISOString().split('T')[0];
 const filePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
 console.log(req.body);
    const newExpense = {
        sr_id: req.body.sr_id,
        expense_type: req.body.expense_type,
        expense_date: formattedDate,
        description: req.body.description,
        amount: req.body.amount,
        attachments: JSON.stringify(filePaths),
        created_by:user.id,
    }
    
    let result = await expenseModel.createExpense(newExpense);
    return res.status(200).json({ 'response': 'Success', 'Expense': result });
    
}


const getExpenses = async (req, res) => {
    const id = parseInt(req.params.id);
    const getExpenses = await expenseModel.getExpenses(id);
    if (getExpenses) {
        return res.status(200).json({ 'response': 'Success', 'Expenses': getExpenses });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const deleteExpense = async (req, res) => {
    const id = parseInt(req.params.id);
    const deleteExpense = await expenseModel.deleteExpense(id);
    if (deleteExpense){
        return res.status(200).json({ 'response': 'Success', 'message': 'Record Deleted Successfully' });
    }else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}



module.exports = {
    createExpense,
    getExpenses,
    deleteExpense
}