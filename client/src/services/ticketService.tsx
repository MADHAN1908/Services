import { POST_CALL, POST_CALL_AUTH , GET_CALL_AUTH ,UPDATE_CALL_AUTH ,DELETE_CALL_AUTH,UPLOAD_POST_CALL} from "./index";

export const ticketService = {
  getTickets,
  getCustomerTickets,
  getAssignTickets,
  getAssignedTickets,
  getCloseTickets,
  getTicketsReport,
  getTicket,
  createTicket,
  updateTicket,
  addTicket,
  assignTicket,
  deleteTicket,
};

function getTickets() {
  return GET_CALL_AUTH("/tickets/All");
}

function getCustomerTickets() {
    return GET_CALL_AUTH("/tickets/customer");
} 

function getAssignTickets() {
    return GET_CALL_AUTH("/tickets/assign");
} 

function getAssignedTickets() {
  return GET_CALL_AUTH("/tickets/assigned");
} 

function getCloseTickets() {
  return GET_CALL_AUTH("/tickets/close");
} 
function getTicketsReport(data: any) {
  return UPDATE_CALL_AUTH("/tickets/report",data);
} 

function getTicket(id : number) {
  return GET_CALL_AUTH("/tickets/"+id);
}

function createTicket(data: any) {
  return POST_CALL_AUTH("/tickets/create", data);
}
function addTicket(data: any) {
  return POST_CALL_AUTH("/tickets/add", data);
}

// function updateTicket(data: any,id : any) {
//   return UPDATE_CALL_AUTH("/tickets/edit/"+id, data);
// }
function updateTicket(data: any,id : number) {
    return UPDATE_CALL_AUTH("/tickets/update/"+id, data);
}
function assignTicket(data: any,id : any) {
    return UPDATE_CALL_AUTH("/tickets/assign/"+id, data);
}

function deleteTicket(id : number) {
  return DELETE_CALL_AUTH("/tickets/delete/"+id);
}

