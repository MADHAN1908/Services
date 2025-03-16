
const ticketModel = require('../../model/ticketModel');

const createTicket = async (req, res) => {
 const user = req.user;
    const newTicket = {
        sr_desc: req.body.sr_desc,
        sr_date: req.body.reported_date,
        machine: req.body.machine,
        sr_status: req.body.sr_status,
        priority: req.body.priority,
        service_type: req.body.service_type,
        company_id:req.body.company_id,
        contact_person: req.body.contact_person,
        mode_of_communication: req.body.MOC,
        created_by:user.id,
        reported_date: new Date(),
        expected_date:req.body.expected_date,
    }
    
    let results = await ticketModel.createTicket(newTicket);
    return res.status(200).json({ 'response': 'Success', 'Ticket': results });
    
}

const addTicket = async (req, res) => {
    const user = req.user;
       const newTicket = {
           sr_desc: req.body.sr_desc,
           sr_date: req.body.reported_date,
           machine: req.body.machine,
           sr_status: req.body.sr_status,
           priority: req.body.priority,
           service_type: req.body.service_type,
           company_id:req.body.company_id,
           contact_person: req.body.contact_person,
           mode_of_communication: req.body.MOC,
           created_by:user.id,
           reported_date: new Date(),
           expected_date: req.body.expected_date,
           assigned_to : req.body.assigned_to,
           assigned_by : req.body.assigned_by,
           assigned_date : req.body.assigned_date,
           plan_in_time: req.body.in_time,
           act_in_time : req.body.in_time,
           act_out_time : req.body.out_time,
           customer_in_time : req.body.in_time,
           customer_out_time : req.body.out_time,
       }
       let results = await ticketModel.createTicket(newTicket);
       return res.status(200).json({ 'response': 'Success', 'Ticket': results });
       
   }

const getTicket = async (req, res) => {
    const id = parseInt(req.params.id);
    const getTicket = await ticketModel.getTicket(id);
    if (getTicket) {
        return res.status(200).json({ 'response': 'Success', 'TicketDetails': getTicket });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const getAllTickets = async (req, res) => {
    const getAllTickets = await ticketModel.getAllTickets();
    if (getAllTickets) {
        return res.status(200).json({ 'response': 'Success', 'TicketDetails': getAllTickets });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}



const getCustomerTickets = async (req, res) => {
    const user = req.user;
    const getCustomerTickets = await ticketModel.getCustomerTickets(user.id);
    if (getCustomerTickets) {
        return res.status(200).json({ 'response': 'Success', 'CustomerTickets': getCustomerTickets });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}
const getAssignTickets = async (req, res) => {
    const getAssignTickets = await ticketModel.getAssignTickets();
    if (getAssignTickets) {
        return res.status(200).json({ 'response': 'Success', 'AssignTickets': getAssignTickets });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const getAssignedTickets = async (req, res) => {
    const user = req.user;
    const AssignedTickets = await ticketModel.getAssignedTickets(user.id,user.role);
    if (AssignedTickets) {
        return res.status(200).json({ 'response': 'Success', 'AssignedTickets': AssignedTickets });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const getCloseTickets = async (req, res) => {
    const user = req.user;
    const CloseTickets = await ticketModel.getCloseTickets(user.id,user.role);
    if (CloseTickets) {
        return res.status(200).json({ 'response': 'Success', 'CloseTickets': CloseTickets });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const getTicketsReport = async (req, res) => {
    const user = req.user;
    var UpdateArray ={};
    if (req.body.from_date)
        UpdateArray.from_date =`'${new Date(req.body.from_date).toISOString().split('T')[0]}'`;
    if(req.body.to_date)
        UpdateArray.to_date = `'${new Date(req.body.to_date).toISOString().split('T')[0]}'`;
    const TicketsReport = await ticketModel.getTicketsReport(UpdateArray);
    if (TicketsReport) {
        return res.status(200).json({ 'response': 'Success', 'TicketsReport': TicketsReport });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
} 


const deleteTicket = async (req, res) => {
    const id = parseInt(req.params.id);
    const deleteTicket = await ticketModel.deleteTicket(id);
    if (deleteTicket){
        return res.status(200).json({ 'response': 'Success', 'message': 'Record Deleted Successfully' });
    }else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}


const updateTicket = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.user;
    var UpdateArray = {};
    if (req.body.assign){
        UpdateArray.assigned_to = req.body.assign;
        UpdateArray.assigned_by = user.id;
        UpdateArray.assigned_date = new Date().toISOString();
    }
    if (req.body.status)
        UpdateArray.sr_status = req.body.status;
    if(req.body.date)
        UpdateArray.plan_in_time = req.body.date;
    if (req.body.act_in_time)
        UpdateArray.act_in_time = new Date().toISOString();
    if(req.body.act_out_time)
        UpdateArray.act_out_time = new Date().toISOString();
    if (req.body.customer_in_time)
        UpdateArray.customer_in_time = req.body.customer_in_time;
    if(req.body.customer_out_time)
        UpdateArray.customer_out_time = req.body.customer_out_time;
    if (req.body.customer_rating)
        UpdateArray.customer_rating = req.body.customer_rating;
    if(req.body.customer_comment)
        UpdateArray.customer_comment = req.body.customer_comment;

        const updateTicket = await ticketModel.updateTicket( UpdateArray, id);
        if (updateTicket){
            return res.status(200).json({ 'response': 'Success','ticket':updateTicket });
    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}



module.exports = {
    createTicket,
    addTicket,
    getAllTickets,
    getTicket,
    getCustomerTickets,
    getAssignTickets,
    getAssignedTickets,
    getCloseTickets,
    getTicketsReport,
    deleteTicket,
    updateTicket
    
}