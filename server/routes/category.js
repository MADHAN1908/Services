const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/ticket/categoryController');
const auth = require('../middleware/auth');

router.post("/add/",auth.verifyToken, categoryController.createCategory);
router.get("/All" ,auth.verifyToken, categoryController.getCategories);

router.put("/update/:id" ,auth.verifyToken, categoryController.updateCategory);
router.delete("/delete/:id",auth.verifyToken, categoryController.deleteCategory);

router.get("/:id",auth.verifyToken, categoryController.getCategory);

module.exports = router;