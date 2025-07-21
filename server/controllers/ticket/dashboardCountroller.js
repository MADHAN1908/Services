const dashboardModel = require('../../model/dashboardModel');


const getPriorityByStatus = async (req, res) => {
    const PriorityByStatus = await dashboardModel.getPriorityByStatus();
    if (PriorityByStatus) {
        return res.status(200).json({ 'response': 'Success', 'PriorityByStatus': PriorityByStatus });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const getCompanyByStatus = async (req, res) => {
    const CompanyByStatus = await dashboardModel.getCompanyByStatus();
    if (CompanyByStatus) {
        return res.status(200).json({ 'response': 'Success', 'CompanyByStatus': CompanyByStatus });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}






module.exports = {
   getPriorityByStatus,
   getCompanyByStatus,
}