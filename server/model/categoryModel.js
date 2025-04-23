const pgsdb = require('../library/pgsdb');
const db = new pgsdb();

const createCategory = async (data) => {
    const categoryTable = `service.categories`;
    let result = await db.insert(categoryTable, data);
    return result;
}

const findCategoryByName = async (name) => {
    const query = `SELECT * FROM service.categories WHERE name = '${name}' `;
    const result = await db.raw(query);
    return result[0]; 
};

const getCategories = async () => {
    const query = `SELECT * from service.categories`;
    const results = await db.raw(query);
    return results;
}

const getCategory = async (id) => {
    const query = `SELECT * from service.categories Where category_id = ${id}`;
    const results = await db.raw(query);
    return results;
}

const updateCategory = async (data,id) => {
    const categoryTable = `service.categories`;
    const result = await db.update(categoryTable,data, [`category_id = '${id}'`]);
    return result;
}


const deleteCategory = async (id) => {
    const categoryTable = `service.categories`;
    const result = await db.delete(categoryTable, [`category_id = '${id}'`]);
    return result;
}





module.exports = {
    createCategory,
    findCategoryByName,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
    
}