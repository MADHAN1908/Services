
const checkInModel = require('../../model/checkInModel');
const fs = require("fs");
const path = require("path");


  const createCheckIn = async (req, res) => {
    const user = req.user;
    const id = parseInt(req.params.id);
    console.log(req.body);
    const filePaths = req.file ?  `/uploads/${req.file.filename}` : null;

    const newCheckIn = {
        sr_id: id,
        user_id : user.id,
        check_type: req.body.check_type,
        latitude : req.body.latitude,
        longitude : req.body.longitude,
        image_path: JSON.stringify(filePaths),
    }
    const results = await checkInModel.createCheckIn(newCheckIn);
        if(results){
        console.log(results);    
        return res.status(200).json({ 'response': 'Success' });
        }else{
            return res.status(400).json({ 'response': 'Failure', "message": 'error in creating' });
        }
    
}

const getCheckIn = async (req, res) => {
    const id = parseInt(req.params.id);
    const checkIns = await checkInModel.getCheckIn(id);
    if (checkIns) {
        return res.status(200).json({ 'response': 'Success', 'checkIns': checkIns });
    }
    else {
        return res.status(400).json({ 'response': 'Success', "message": 'Not found' });
    }
}




module.exports = {
    createCheckIn,
    getCheckIn
   
}