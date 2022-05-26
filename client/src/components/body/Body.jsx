import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ActivationEmail from "./auth/ActivationEmail";
import NotFound from "../Utils/NotFound/NotFound";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Home from "./Home/Home";
import Profile from "./Profile/Profile";
import EditUser from "./Profile/EditUser";
import "./body.css";

import { useSelector } from "react-redux";

const Body = () => {
  const auth = useSelector((state) => state.rootReducer.auth);

  const { isLogged, isAdmin } = auth;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
        <Route
          path="/login"
          element={isLogged ? <NotFound /> : <Login />}
          exact
        />
        <Route
          path="/register"
          element={isLogged ? <NotFound /> : <Register />}
          exact
        />
        <Route
          path="/forgot_password"
          element={isLogged ? <NotFound /> : <ForgotPassword />}
          exact
        />
        <Route
          path="/user/reset/:token"
          element={isLogged ? <NotFound /> : <ResetPassword />}
          exact
        />
        <Route
          path="/user/activate/:activation_token"
          element={<ActivationEmail />}
          exact
        />
        <Route
          path="/profile"
          element={isLogged ? <Profile /> : <NotFound />}
          exact
        />
        <Route
          path="/edit_user/:id"
          element={isAdmin ? <EditUser /> : <NotFound />}
        />
      </Routes>
    </>
  );
};

export default Body;
