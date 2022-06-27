import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, NavLink } from "react-router-dom";
import "./dashboard.css";

import AllUsers from "./AllUsers";
import Contributions from "./Contributions";
import {
  fetchAllUsers,
  dispatchGetAllUsers,
} from "../../../redux/actions/usersActions";

import PendingQuestions from "./PendingQuestions";
import WelcomeDashboard from "./WelcomeDashboard";

const initialState = {
  name: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

const Profile = () => {
  const auth = useSelector((state) => state.rootReducer.auth);
  const token = useSelector((state) => state.rootReducer.token);
  const users = useSelector((state) => state.rootReducer.users);

  const { user, isAdmin, isEvaluator } = auth;
  const [data, setData] = useState(initialState);

  const [callback, setCallback] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers(token).then((res) => {
        dispatch(dispatchGetAllUsers(res));
      });
    }
  }, [token, isAdmin, dispatch, callback]);

  const handleDelete = async (id, name) => {
    try {
      if (user._id !== id) {
        if (
          window.confirm(`Are you sure you want to delete ${name}'s account?`)
        ) {
          await axios.delete(`/user/delete/${id}`, {
            headers: { Authorization: token },
          });

          setCallback(!callback);
        }
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="profile-div">
      <div className="p-card">
        <div className="p-btns">
          <NavLink to="/dashboard/my-contributions">My contributions</NavLink>
          {user.role > 0 && (
            <NavLink to="/dashboard/evaluate">Evaluate</NavLink>
          )}
          {isAdmin && <NavLink to="/dashboard/all-users">See Users</NavLink>}
        </div>
      </div>
      <div className="profile-content">
        <Routes>
          <Route path="/" element={<WelcomeDashboard />} />
          <Route path="/my-contributions" element={<Contributions />} />
          <Route
            path="/all-users"
            element={
              isAdmin && <AllUsers users={users} handleDelete={handleDelete} />
            }
          />
          <Route
            path="/evaluate"
            element={(isAdmin || isEvaluator) && <PendingQuestions />}
          />
        </Routes>
      </div>
      <div className="pink-band"></div>
    </div>
  );
};

export default Profile;
