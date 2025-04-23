const categoryModel = require('../../model/categoryModel');


const createCategory = async (req, res) => {
    try {
        const user = req.user;
        console.log(req.body);

        const existingCategory = await categoryModel.findCategoryByName(req.body.name);
        console.log(existingCategory);
        if (existingCategory) {
            return res.status(400).json({ response: 'Error', message: 'Category already exists' });
        }

        const newCategory = {
            name: req.body.name,
            created_by: user.id,
        };

        let result = await categoryModel.createCategory(newCategory);

        return res.status(200).json({ response: 'Success', Category: result });
    } catch (error) {
        console.error("Error creating category:", error);

        // Handle unique constraint violation
        if (error.code === '23505') { // PostgreSQL unique violation error code
            return res.status(400).json({ response: 'Error', message: 'Category name must be unique' });
        }

        return res.status(500).json({ response: 'Error', message: 'Internal Server Error' });
    }
};



const getCategory = async (req, res) => {
    const id = parseInt(req.params.id);
    const getCategory = await categoryModel.getCategory(id);
    if (getCategory) {
        return res.status(200).json({ 'response': 'Success', 'Category': getCategory[0] });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const getCategories = async (req, res) => {
    const getCategory = await categoryModel.getCategories();
    if (getCategory) {
        return res.status(200).json({ 'response': 'Success', 'CategoryList': getCategory });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const updateCategory = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.user;
    var UpdateArray = {};
    if (req.body.name){
        // console.log(2);
        UpdateArray.name = req.body.name;
        // UpdateArray.updated_at = new Date().toISOString();
    }

        const updateCategory = await categoryModel.updateCategory( UpdateArray, id);
        if (updateCategory){
            return res.status(200).json({ 'response': 'Success','Category':updateCategory });
    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}

const deleteCategory = async (req, res) => {
    const id = parseInt(req.params.id);
    const deleteCategory = await categoryModel.deleteCategory(id);
    if (deleteCategory){
        return res.status(200).json({ 'response': 'Success', 'message': 'Record Deleted Successfully' });
    }else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}



module.exports = {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory
}