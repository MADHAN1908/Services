import {POST_CALL_AUTH , GET_CALL_AUTH ,UPDATE_CALL_AUTH ,DELETE_CALL_AUTH,UPLOAD_UPDATE_CALL_AUTH,UPLOAD_POST_CALL_AUTH} from "./index";

export const expenseService = {
  getExpenses,
  createExpense,
  deleteExpense,
};

function getExpenses(id:number) {
  return GET_CALL_AUTH("/expenses/"+id);
}

function createExpense(data: any) {
  return UPLOAD_POST_CALL_AUTH("/expenses/create/", data);
}


function deleteExpense(id : number) {
  return DELETE_CALL_AUTH("/expenses/delete/"+id);
}

