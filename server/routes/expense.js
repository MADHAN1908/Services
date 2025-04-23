const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/ticket/expenseController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post("/create/",auth.verifyToken,upload.array('attachments',10), expenseController.createExpense);
router.get("/all",auth.verifyToken, expenseController.getAllExpenses);
router.get("/:id", expenseController.getExpenses);
router.delete("/delete/:id", expenseController.deleteExpense);

module.exports = router;