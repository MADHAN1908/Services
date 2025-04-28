import { POST_CALL_AUTH , GET_CALL_AUTH ,UPDATE_CALL_AUTH ,DELETE_CALL_AUTH } from "./index";

export const companyService = {
  getCompanies,
  getCompany,
  updateCompany,
  addCompany,
  deleteCompany,
};

function getCompanies() {
  return GET_CALL_AUTH("/company/All");
}

function getCompany(id : number) {
  return GET_CALL_AUTH("/company/"+id);
}

function addCompany(data: any) {
  return POST_CALL_AUTH("/company/add", data);
}

function updateCompany(data: any,id : number) {
    return UPDATE_CALL_AUTH("/company/update/"+id, data);
}
function deleteCompany(id : number) {
  return DELETE_CALL_AUTH("/company/delete/"+id);
}

