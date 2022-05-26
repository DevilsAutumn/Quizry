import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import logingif from "../../../Media/login.gif";
import axios from "axios";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../Utils/Notification/Notification";
import {
  isEmpty,
  isEmail,
  isLength,
  isMatch,
} from "../../Utils/validation/Validation";

const initalState = {
  name: "",
  email: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

const Register = () => {
  const [user, setUser] = useState(initalState);

  const { name, email, password, cf_password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty(name) || isEmpty(password))
      return setUser({
        ...user,
        err: "Please fill in all fields.",
        success: "",
      });

    if (!isEmail(email))
      return setUser({
        ...user,
        err: "Invalid Email.",
        success: "",
      });

    if (isLength(password))
      return setUser({
        ...user,
        err: "Password must be of at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setUser({
        ...user,
        err: "Password did not match.",
        success: "",
      });
    try {
      const res = await axios.post("/user/register", {
        name,
        email,
        password,
      });
      setUser({
        ...user,
        err: "",
        success: res.data.msg,
      });
    } catch (err) {
      err.response.data.msg &&
        setUser({
          ...user,
          err: err.response.data.msg,
          success: "",
        });
    }
  };

  return (
    <div className="login-div">
      <div className="login-page">
        <div className="logo-div">
          <img src={logingif} alt="" />
        </div>
        <div className="login-section">
          <h1>Register</h1>
          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Username</label>
              <input
                type="text"
                placeholder="Enter your name"
                id="name"
                value={name}
                name="name"
                onChange={handleChangeInput}
              />
            </div>
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                placeholder="Enter your email address"
                id="email"
                value={email}
                name="email"
                onChange={handleChangeInput}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                id="password"
                value={password}
                name="password"
                onChange={handleChangeInput}
              />
            </div>

            <div>
              <label htmlFor="cf_password">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                id="cf_password"
                value={cf_password}
                name="cf_password"
                onChange={handleChangeInput}
              />
            </div>
            <div className="row">
              <button type="submit">Register</button>
              <Link to="/forgot_password">Forgot your password?</Link>
            </div>
          </form>
          <p>
            Already have an account?{" "}
            <Link to="/login" id="switchlink">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
