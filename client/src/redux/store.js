import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/";
import auth from "./reducers/authReducer";
import token from "./reducers/tokenReducer";
import { Provider } from "react-redux";

const Rstore = configureStore({ reducer: { rootReducer } });

const DataProvider = ({ children }) => {
  return <Provider store={Rstore}>{children}</Provider>;
};

export default DataProvider;
