import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ActivationEmail from "./auth/ActivationEmail";
import NotFound from "../Utils/NotFound/NotFound";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Home from "./Home/Home";
import Dashboard from "./Dashboard Screens/Dashboard";
import EditUser from "./Dashboard Screens/EditUser";
import "./body.css";
import { useSelector } from "react-redux";

import Contribute from "./Contribute Page/Contribute";
import PostQuestion from "./Contribute Page/PostQuestion";
import Api from "./API/Api";

import UserProfile from "./User Profile/UserProfile";
import MyProfile from "../My profile screens/MyProfile";

const Body = () => {
  const auth = useSelector((state) => state.rootReducer.auth);

  const { isLogged, isAdmin } = auth;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isLogged ? <NotFound /> : <Login />}
          exact
        />
        {/* <Route path="/donate" element={<Donate />} exact /> */}
        <Route
          path="/register"
          element={isLogged ? <NotFound /> : <Register />}
          exact
        />
        <Route path="/contribute/" element={<Contribute />} exact />
        <Route
          path="/contribute/post-question"
          element={isLogged ? <PostQuestion /> : <NotFound />}
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
        />
        <Route path="/api" element={<Api />} exact />
        <Route
          path="/dashboard/*"
          element={isLogged ? <Dashboard /> : <NotFound />}
          exact
        />
        <Route
          path="/my-profile"
          element={isLogged ? <MyProfile /> : <NotFound />}
          exact
        />
        <Route path="/user/:id" element={<UserProfile />} exact />
        {/* <Route
          path="/dashboard/evaluate/*"
          element={isEvaluator || isAdmin ? <Dashboard /> : <NotFound />}
          exact
        />
        <Route
          path="/dashboard/my-contributions/*"
          element={isLogged ? <Dashboard /> : <NotFound />}
          exact
        />
        <Route
          path="/dashboard/all-user/*"
          element={isAdmin ? <Dashboard /> : <NotFound />}
          exact
        /> */}
        {/* <Route
          path="/dashboard/evaluate/question=:id"
          element={isAdmin || isEvaluator ? <EvaluationScreen /> : <NotFound />}
          exact
        /> */}
        <Route
          path="/dashboard/all-users/edit-user/:id"
          element={isAdmin ? <EditUser /> : <NotFound />}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Body;
