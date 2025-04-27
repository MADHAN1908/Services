const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ticket/reportController');
const auth = require('../middleware/auth');

router.get("/:id", reportController.getReport);

module.exports = router;