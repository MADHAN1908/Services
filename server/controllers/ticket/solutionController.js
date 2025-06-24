
const solutionModel = require('../../model/solutionModel');
const fs = require("fs");
const path = require("path");


  const createSolution = async (req, res) => {
    const user = req.user;
    const id = parseInt(req.params.id);
    const filePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const newSolution = {
        sr_id: id,
        problem: req.body.problem,
        before_attachments: JSON.stringify(filePaths),
        created_by:user.id
    }
    const results = await solutionModel.createSolution(newSolution);
        if(results){
        return res.status(200).json({ 'response': 'Success' });
        }else{
            return res.status(400).json({ 'response': 'Failure', "message": 'error in creating' });
        }
    
}

const addSolution = async (req, res) => {
    const user = req.user;
    const newSolution = {};
    if (req.body.sr_id)
        newSolution.sr_id = req.body.sr_id;
    if (req.body.problem)
        newSolution.problem = req.body.problem;
    if (req.body.actions)
        newSolution.actions = req.body.actions;
    if (req.body.service_status) {
        console.log(req.body.service_status);
        newSolution.service_status = req.body.service_status;
    }
    if (req.body.status_remark) {
        newSolution.status_remark = req.body.status_remark;
    }
    if (req.body.responsibility) {
        newSolution.responsibility = req.body.responsibility;
    }
    if (req.body.status_date) {
        newSolution.status_date = req.body.status_date;
    }
    if (req.body.customer_acceptance) {
        newSolution.customer_acceptance = req.body.customer_acceptance;
    }
    if (req.body.customer_feedback) {
        newSolution.customer_feedback = req.body.customer_feedback;
    }
    newSolution.created_by = user.id;

    const results = await solutionModel.addSolution(newSolution);
        if(results){
        return res.status(200).json({ 'response': 'Success','solution': results });
        }else{
            return res.status(400).json({ 'response': 'Failure', "message": 'error in creating' });
        }
    
}

const getTicketSolutions = async (req, res) => {
    const id = parseInt(req.params.id);
    const ticketSolutions = await solutionModel.getTicketSolutions(id);
    if (ticketSolutions) {
        return res.status(200).json({ 'response': 'Success', 'TicketSolutions': ticketSolutions });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}

const deleteSolution = async (req, res) => {
    const id = parseInt(req.params.id);
        try {
            const deleteSolution = await solutionModel.deleteSolution(id);
            if (deleteSolution)
                return res.status(200).json({ 'response': 'Success', 'DeleteSolution':deleteSolution });
        } catch (error) {
            return res.status(400).json({ 'response': 'Failed', "message": 'Could Not Delete This Solution' });
        }
    
}

const updateSolution = async (req, res) => {
    const id = parseInt(req.params.id);
    var UpdateArray = {};
    if (req.body.problem)
        UpdateArray.problem = req.body.problem;
    if (req.body.actions)
        UpdateArray.actions = req.body.actions;
    if (req.body.service_status) {
        UpdateArray.service_status = req.body.service_status;
    }
    if (req.body.status_remark) {
        UpdateArray.status_remark = req.body.status_remark;
    }
    if (req.body.responsibility) {
        UpdateArray.responsibility = req.body.responsibility;
    }
    if (req.body.status_date) {
        UpdateArray.status_date = req.body.status_date;
    }
       if (req.body.customer_acceptance == true || req.body.customer_acceptance== false) {
           UpdateArray.customer_acceptance = req.body.customer_acceptance;
       }
    if (req.body.customer_feedback) {
        UpdateArray.customer_feedback = req.body.customer_feedback;
    }

    
        const updateSolution = await solutionModel.updateSolution(id, UpdateArray);
        if (updateSolution){
            return res.status(200).json({ 'response': 'Success', 'solution':updateSolution });
    }
    else {
        return res.status(400).json({ 'response': 'Failed', "message": 'Not found' });
    }
}

const uploadAttachment = async (req, res) => {
    const id = parseInt(req.params.id);
    const updateSolution = {};
    // console.log(req.body);
    if (req.body.before_attachment_upload){
    const existingPhotos = req.body.before_attachments ? (Array.isArray(req.body.before_attachments) ? req.body.before_attachments : [req.body.before_attachments]) : [];
    const uploadedFile = req.file ? `/uploads/${req.file.filename}` : null;
    // console.log(existingPhotos,uploadedFile)
    updateSolution.before_attachments = JSON.stringify(uploadedFile ? [...existingPhotos, uploadedFile] : existingPhotos); 
    }
    if (req.body.after_attachment_upload){
        const existingPhotos = req.body.after_attachments ? (Array.isArray(req.body.after_attachments) ? req.body.after_attachments : [req.body.after_attachments]) : [];
        const uploadedFile = req.file ? `/uploads/${req.file.filename}` : null;
        updateSolution.after_attachments = JSON.stringify(uploadedFile ? [...existingPhotos, uploadedFile] : existingPhotos); 
        }
   
        let results = await solutionModel.uploadAttachment(id, updateSolution);
        if(results){
        return res.status(200).json({ 'response': 'Success','solution':results[0] });
        }else{
            return res.status(400).json({ 'response': 'Failure', "message": 'error in creating' });
        }
}

const deleteAttachment = async (req, res) => {
    const id = parseInt(req.params.id);
    // console.log(req.body);
    const updateSolution = {};
    if (req.body.field == "before_attachments"){
        updateSolution.before_attachments = JSON.stringify(req.body.updatedAttachments ?  req.body.updatedAttachments  : []); 
    }
    if (req.body.field == "after_attachments"){
        updateSolution.after_attachments = JSON.stringify(req.body.updatedAttachments ?  req.body.updatedAttachments : []);
    }
        const filePath = path.join(__dirname, "../../uploads", path.basename(req.body.image_path));
        // console.log("Attempting to delete:", filePath);
        if (fs.existsSync(filePath)) {
            console.log(1);
            fs.unlinkSync(filePath); 
        }
    
   
        let results = await solutionModel.uploadAttachment(id, updateSolution);
        if(results){
        return res.status(200).json({ 'response': 'Success','solution':results[0] });
        }else{
            return res.status(400).json({ 'response': 'Failure', "message": 'error in creating' });
        }
}

module.exports = {
    createSolution,
    addSolution,
    getTicketSolutions,
    deleteSolution,
    updateSolution,
    uploadAttachment,
    deleteAttachment
}