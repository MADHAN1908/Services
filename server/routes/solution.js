const express = require('express');
const router = express.Router();
const solutionController = require('../controllers/ticket/solutionController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post("/create/:id",auth.verifyToken,upload.array('attachments',10), solutionController.createSolution);
router.post("/add/",auth.verifyToken, solutionController.addSolution);
router.get("/:id",auth.verifyToken, solutionController.getTicketSolutions);
router.get("/sid/:id" ,auth.verifyToken, solutionController.getSolution);
router.put("/edit/:id" ,auth.verifyToken,solutionController.updateSolution);
router.put("/attachment/:id",auth.verifyToken,upload.single('image'), solutionController.uploadAttachment);
router.put("/delete-attachment/:id",auth.verifyToken, solutionController.deleteAttachment);
router.delete("/delete/:id",auth.verifyToken, solutionController.deleteSolution);

module.exports = router;