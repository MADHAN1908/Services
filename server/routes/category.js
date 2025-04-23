const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/ticket/categoryController');
const auth = require('../middleware/auth');

router.post("/add/",auth.verifyToken, categoryController.createCategory);
router.get("/All", categoryController.getCategories);

router.put("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

router.get("/:id", categoryController.getCategory);

module.exports = router;