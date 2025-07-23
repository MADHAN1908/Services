const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/ticket/expenseController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post("/create/",auth.verifyToken,upload.array('attachments',10), expenseController.createExpense);
router.get("/all",auth.verifyToken, expenseController.getAllExpenses);
router.get("/:id",auth.verifyToken,  expenseController.getExpenses);
router.get("/edit/:id",auth.verifyToken,  expenseController.getExpense);
router.put("/update/:id",auth.verifyToken,  expenseController.updateExpense);
router.put("/attachment/:id",auth.verifyToken,upload.single('image'), expenseController.uploadAttachment);
router.put("/delete-attachment/:id",auth.verifyToken, expenseController.deleteAttachment);
router.delete("/delete/:id",auth.verifyToken,  expenseController.deleteExpense);

module.exports = router;