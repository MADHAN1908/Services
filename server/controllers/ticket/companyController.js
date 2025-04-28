const companyModel = require('../../model/companyModel');


const createCompany = async (req, res) => {
    try {
        const user = req.user;
        console.log(req.body);

        const existingCompany = await companyModel.findCompanyByName(req.body);
        console.log(existingCompany);
        if (existingCompany) {
            return res.status(400).json({ response: 'Error', message: 'Company Name or Email or Phone Number already exists' });
        }

        const newCompany = {
            company_name: req.body.company_name,
            email: req.body.email,
            phone_no: req.body.phone_no,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            postal_code: req.body.postal_code,
            created_by: user.id,
        };

        let result = await companyModel.createCompany(newCompany);

        return res.status(200).json({ response: 'Success', Company: result });
    } catch (error) {
        console.error("Error creating company:", error);

        // Handle unique constraint violation
        if (error.code === '23505') { // PostgreSQL unique violation error code
            return res.status(400).json({ response: 'Error', message: 'Company name must be unique' });
        }

        return res.status(500).json({ response: 'Error', message: 'Internal Server Error' });
    }
};



const getCompany = async (req, res) => {
    const id = parseInt(req.params.id);
    const getCompany = await companyModel.getCompany(id);
    if (getCompany) {
        return res.status(200).json({ 'response': 'Success', 'Company': getCompany[0] });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const getCompanies = async (req, res) => {
    const Company = await companyModel.getCompanies();
    if (Company) {
        return res.status(200).json({ 'response': 'Success', 'CompanyList': Company });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const updateCompany = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.user;
    var UpdateArray = {};
    UpdateArray.company_name = req.body.company_name;
    UpdateArray.email = req.body.email;
    UpdateArray.phone_no= req.body.phone_no;
    UpdateArray.address= req.body.address;
    UpdateArray.city= req.body.city;
    UpdateArray.state= req.body.state;
    UpdateArray.country= req.body.country;
    UpdateArray.postal_code= req.body.postal_code;

        const updateCompany = await companyModel.updateCompany( UpdateArray, id);
        if (updateCompany){
            return res.status(200).json({ 'response': 'Success','Company':updateCompany });
    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}

const deleteCompany = async (req, res) => {
    const id = parseInt(req.params.id);
    const deleteCompany = await companyModel.deleteCompany(id);
    if (deleteCompany){
        return res.status(200).json({ 'response': 'Success', 'message': 'Record Deleted Successfully' });
    }else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}



module.exports = {
    createCompany,
    getCompany,
    getCompanies,
    updateCompany,
    deleteCompany
}