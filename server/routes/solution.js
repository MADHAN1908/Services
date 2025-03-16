const express = require('express');
const router = express.Router();
const solutionController = require('../controllers/ticket/solutionController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post("/create/:id",auth.verifyToken,upload.array('attachments',10), solutionController.createSolution);
router.post("/add/",auth.verifyToken, solutionController.addSolution);
router.get("/:id", solutionController.getTicketSolutions);
router.put("/edit/:id" ,solutionController.updateSolution);
router.put("/attachment/:id",auth.verifyToken,upload.single('image'), solutionController.uploadAttachment);
router.delete("/delete/:id", solutionController.deleteSolution);

module.exports = router;