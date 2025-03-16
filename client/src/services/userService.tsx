import { POST_CALL, POST_CALL_AUTH , GET_CALL_AUTH ,UPDATE_CALL_AUTH ,DELETE_CALL_AUTH,UPLOAD_POST_CALL} from "./index";

export const userService = {
  login,
  getAdmins,
  getAdmin,
  getUser,
  getCustomers,
  getContactPerson,
  getAssignUsers,
  getAssignedByUsers,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateMailService,
  getMailService,
  sendOtp,
  otpLogin,
  register,
  verifyMailService,
  changePassword
};

function login(data: any) {
  return POST_CALL("/login", data);
}

function register(data: any) {
  return UPLOAD_POST_CALL("/login/register", data);
}

function sendOtp(data: any) {
  return POST_CALL("/login/send-otp", data);
}
function otpLogin(data: any) {
  return POST_CALL("/login/verify-otp", data);
}

function getAdmins() {
  return GET_CALL_AUTH("/users/All");
}
function getCustomers() {
  return GET_CALL_AUTH("/users/customers");
}
function getContactPerson(id : number) {
  // console.log(id);
  return GET_CALL_AUTH("/users/contacts/"+id);
}
function getAssignUsers() {
  // console.log(id);
  return GET_CALL_AUTH("/users/assign/");
}
function getAssignedByUsers() {
  // console.log(id);
  return GET_CALL_AUTH("/users/assignedby/");
}

function getAdmin(id : number) {
  return GET_CALL_AUTH("/users/"+id);
}

function getUser() {
  return GET_CALL_AUTH("/users/");
}
function createAdmin(data: any) {
  return POST_CALL_AUTH("/users/create", data);
}

function updateAdmin(data: any,id : any) {
  return UPDATE_CALL_AUTH("/users/edit/"+id, data);
}

function updateMailService(data: any) {
  return POST_CALL_AUTH("/users/mail-service", data);
}

function deleteAdmin(id : number) {
  return DELETE_CALL_AUTH("/users/delete/"+id);
}

function getMailService() {
  return GET_CALL_AUTH("/users/mail-service");
}

function verifyMailService(data: any) {
  return POST_CALL_AUTH("/users/verify-mail-service", data);
}

function changePassword(data: any) {
  return POST_CALL_AUTH("/login/changePassword", data);
}