const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket/ticketController');
const auth = require('../middleware/auth');

router.post("/create",auth.verifyToken, ticketController.createTicket);
router.post("/add",auth.verifyToken, ticketController.addTicket);
router.get("/All", ticketController.getAllTickets);
router.get("/customer",auth.verifyToken, ticketController.getCustomerTickets);
router.get("/assign",auth.verifyToken, ticketController.getAssignTickets);
router.get("/assigned",auth.verifyToken, ticketController.getAssignedTickets);
router.get("/close",auth.verifyToken, ticketController.getCloseTickets);
router.put("/report",auth.verifyToken, ticketController.getTicketsReport);
router.put("/update/:id",auth.verifyToken, ticketController.updateTicket);
// router.put("/edit/:id" ,ticketController.updateTicket);
router.delete("/delete/:id", ticketController.deleteTicket);
router.get("/:id",auth.verifyToken, ticketController.getTicket);



module.exports = router;