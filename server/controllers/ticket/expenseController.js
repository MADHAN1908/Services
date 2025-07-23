
const expenseModel = require('../../model/expenseModel');
const fs = require("fs");
const path = require("path");

const createExpense = async (req, res) => {
 const user = req.user;
let expenseDate = new Date(req.body.expense_date);
  let formattedDate = expenseDate.toLocaleDateString('en-CA');
// console.log(formattedDate);
 const filePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
//  console.log(req.body);
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

const getAllExpenses = async (req, res) => {
    const user = req.user;
    const getExpenses = await expenseModel.getAllExpenses(user);
    if (getExpenses) {
        return res.status(200).json({ 'response': 'Success', 'Expenses': getExpenses });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
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

const getExpense = async (req, res) => {
    const id = parseInt(req.params.id);
    const getExpense = await expenseModel.getExpense(id);
    if (getExpense) {
        return res.status(200).json({ 'response': 'Success', 'Expense': getExpense[0] });
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

const updateExpense = async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(req.body);
    var UpdateArray = {};
    if (req.body.expense_type)
        UpdateArray.expense_type = req.body.expense_type;
    if (req.body.description)
        UpdateArray.description = req.body.description;
    if (req.body.expense_date) {
        UpdateArray.expense_date = req.body.expense_date;
    }
    if (req.body.amount) {
        UpdateArray.amount = req.body.amount;
    }
    
    const updateExpense = await expenseModel.updateExpense(id, UpdateArray);
    if (updateExpense){
        return res.status(200).json({ 'response': 'Success', 'expense':updateExpense });
    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}

const uploadAttachment = async (req, res) => {
    const id = parseInt(req.params.id);
    const updateExpense = {};
    
    const existingPhotos = req.body.attachments ? JSON.parse(req.body.attachments) : [];
    const uploadedFile = req.file ? `/uploads/${req.file.filename}` : null;
    console.log(existingPhotos,uploadedFile)
    updateExpense.attachments = JSON.stringify(uploadedFile ? [...existingPhotos, uploadedFile] : existingPhotos); 
    
   
        let result = await expenseModel.updateExpense(id, updateExpense);
        if(result){
            console.log(result);
        return res.status(200).json({ 'response': 'Success','expense':result });
        }else{
            return res.status(400).json({ 'response': 'Failure', "message": 'error in creating' });
        }
}

const deleteAttachment = async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(req.body);
    const updateExpense = {};
        updateExpense.attachments = JSON.stringify(req.body.updatedAttachments ?  req.body.updatedAttachments  : []); 
   
        const filePath = path.join(__dirname, "../../uploads", path.basename(req.body.image_path));
        console.log("Attempting to delete:", filePath);
        if (fs.existsSync(filePath)) {
            console.log(1);
            fs.unlinkSync(filePath); 
        }
    
   
        let result = await  expenseModel.updateExpense(id, updateExpense);
        if(result){
            console.log(result);
        return res.status(200).json({ 'response': 'Success','expense':result });
        }else{
            return res.status(400).json({ 'response': 'Failure', "message": 'error in creating' });
        }
}



module.exports = {
    createExpense,
    getAllExpenses,
    getExpenses,
    getExpense,
    deleteExpense,
    updateExpense,
    uploadAttachment,
    deleteAttachment
}