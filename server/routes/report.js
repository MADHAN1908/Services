const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ticket/reportController');
const auth = require('../middleware/auth');

router.get("/:id",auth.verifyToken, reportController.getReport);

module.exports = router;