const pgsdb = require('../library/pgsdb');
const db = new pgsdb();

const createCompany = async (data) => {
    const companyTable = `public.company`;
    let result = await db.insert(companyTable, data);
    return result;
}

const findCompanyByName = async (data) => {
    const query = `SELECT * FROM public.company WHERE company_name = '${data.company_name}' OR email = '${data.email}' OR phone_no = '${data.phone_no}' `;
    const result = await db.raw(query);
    return result[0]; 
};

const getCompanies = async () => {
    const query = `SELECT * from public.company`;
    const results = await db.raw(query);
    return results;
}

const getCompany = async (id) => {
    const query = `SELECT * from public.company Where company_id = ${id}`;
    const results = await db.raw(query);
    return results;
}

const updateCompany = async (data,id) => {
    const companyTable = `public.company`;
    const result = await db.update(companyTable,data, [`company_id = '${id}'`]);
    return result;
}


const deleteCompany = async (id) => {
    const companyTable = `public.company`;
    const result = await db.delete(companyTable, [`company_id = '${id}'`]);
    return result;
}

module.exports = {
    createCompany,
    findCompanyByName,
    getCompanies,
    getCompany,
    updateCompany,
    deleteCompany
    
}