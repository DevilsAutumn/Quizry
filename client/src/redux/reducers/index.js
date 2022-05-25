import { combineReducers } from "redux";
import auth from "./authReducer";
import token from "./tokenReducer";
import users from "./usersReducers";

export default combineReducers({
  auth,
  token,
  users,
});
