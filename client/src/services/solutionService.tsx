import {POST_CALL_AUTH , GET_CALL_AUTH ,UPDATE_CALL_AUTH ,DELETE_CALL_AUTH,UPLOAD_UPDATE_CALL_AUTH,UPLOAD_POST_CALL_AUTH} from "./index";

export const solutionService = {
  getTicketSolution,
  createSolution,
  addSolution,
  updateSolution,
  uploadAttachment,
  deleteSolution,
};

function getTicketSolution(id:number) {
  return GET_CALL_AUTH("/solutions/"+id);
}

function createSolution(id:number,data: any) {
  return UPLOAD_POST_CALL_AUTH("/solutions/create/"+id , data);
}

function addSolution(data: any) {
  return POST_CALL_AUTH("/solutions/add/", data);
}

function updateSolution(data: any,id : number) {
  return UPDATE_CALL_AUTH("/solutions/edit/"+id, data);
}

function uploadAttachment(data: any,id : number) {
  return UPLOAD_UPDATE_CALL_AUTH("/solutions/attachment/"+id, data);
}

function deleteSolution(id : number) {
  return DELETE_CALL_AUTH("/solutions/delete/"+id);
}

