import { POST_CALL_AUTH , GET_CALL_AUTH ,UPDATE_CALL_AUTH ,DELETE_CALL_AUTH } from "./index";

export const categoryService = {
  getCategories,
  getCategory,
  updateCategory,
  addCategory,
  deleteCategory,
};

function getCategories() {
  return GET_CALL_AUTH("/categories/All");
}

function getCategory(id : number) {
  return GET_CALL_AUTH("/categories/"+id);
}

function addCategory(data: any) {
  return POST_CALL_AUTH("/categories/add", data);
}

function updateCategory(data: any,id : number) {
    return UPDATE_CALL_AUTH("/categories/update/"+id, data);
}
function deleteCategory(id : number) {
  return DELETE_CALL_AUTH("/categories/delete/"+id);
}

