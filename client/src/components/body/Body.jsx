import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ActivationEmail from "./auth/ActivationEmail";
import NotFound from "../Utils/NotFound/NotFound";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Home from "./Home/Home";
import Profile from "./Profile Screens/Profile";
import EditUser from "./Profile Screens/EditUser";
import "./body.css";
import { useSelector } from "react-redux";
import EvaluationScreen from "./Profile Screens/EvaluationScreen";
import Contribute from "./Contribute Page/Contribute";
import PostQuestion from "./Contribute Page/PostQuestion";

const Body = () => {
  const auth = useSelector((state) => state.rootReducer.auth);

  const { isLogged, isAdmin, isEvaluator } = auth;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

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
          path="/contribute/"
          element={isLogged ? <Contribute /> : <NotFound />}
          exact
        />
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
          exact
        />
        <Route
          path="/profile"
          element={isLogged ? <Profile /> : <NotFound />}
          exact
        />
        <Route
          path="/profile/evaluate"
          element={isEvaluator || isAdmin ? <Profile /> : <NotFound />}
          exact
        />
        <Route
          path="/profile/my-contributions"
          element={isLogged ? <Profile /> : <NotFound />}
          exact
        />
        <Route
          path="/profile/all-users"
          element={isAdmin ? <Profile /> : <NotFound />}
          exact
        />
        <Route
          path="/profile/evaluate/question=:id"
          element={isAdmin || isEvaluator ? <EvaluationScreen /> : <NotFound />}
          exact
        />
        <Route
          path="/profile/all-users/edit-user/:id"
          element={isAdmin ? <EditUser /> : <NotFound />}
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Body;
