const express = require('express');
const router = express.Router();
const dashboardCountroller = require('../controllers/ticket/dashboardCountroller');
const auth = require('../middleware/auth');

router.get("/PriorityByStatus", dashboardCountroller.getPriorityByStatus);
router.get("/CompanyByStatus", dashboardCountroller.getCompanyByStatus);


module.exports = router;