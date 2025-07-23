const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/ticket/checkInController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post("/create/:id",auth.verifyToken,upload.single('image'), checkInController.createCheckIn);
router.get("/srid/:id", checkInController.getCheckIn);


module.exports = router;