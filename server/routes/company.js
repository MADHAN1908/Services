const express = require('express');
const router = express.Router();
const companyController = require('../controllers/ticket/companyController');
const auth = require('../middleware/auth');

router.post("/add/",auth.verifyToken, companyController.createCompany);
router.get("/All",auth.verifyToken, companyController.getCompanies);
router.put("/update/:id",auth.verifyToken, companyController.updateCompany);
router.delete("/delete/:id",auth.verifyToken, companyController.deleteCompany);
router.get("/:id",auth.verifyToken,companyController.getCompany);

module.exports = router;