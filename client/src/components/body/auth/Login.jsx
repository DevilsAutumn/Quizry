import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import logingif from "../../../Media/login.gif";
import axios from "axios";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../Utils/Notification/Notification";
import { dispatchLogin } from "../../../redux/actions/authAction";
import { useDispatch } from "react-redux";

const initalState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

const Login = () => {
  const [user, setUser] = useState(initalState);
  const [pvisible, setPvisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("user/login", { email, password });
      setUser({
        ...user,
        err: "",
        success: res.data.msg,
      });

      localStorage.setItem("firstLogin", true);

      dispatch(dispatchLogin());
      navigate("/");
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
          <h1>Login</h1>
          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email Address</label>
              <div className="input-div">
                <input
                  type="text"
                  placeholder="Enter your email address"
                  id="email"
                  value={email}
                  name="email"
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <div className="input-div">
                <input
                  type={pvisible ? "text" : "password"}
                  placeholder="Enter your password"
                  id="password"
                  value={password}
                  name="password"
                  onChange={handleChangeInput}
                />
                {pvisible ? (
                  <img
                    src="https://img.icons8.com/cotton/20/undefined/surprise--v2.png"
                    id="pass-eye"
                    alt="eye"
                    onClick={() => setPvisible(!pvisible)}
                  />
                ) : (
                  <img
                    src="https://img.icons8.com/windows/20/undefined/closed-eye.png"
                    id="pass-eye"
                    alt="eye"
                    onClick={() => setPvisible(!pvisible)}
                  />
                )}
              </div>
            </div>
            <div className="row">
              <button type="submit">Login</button>
              <Link to="/forgot_password">Forgot your password?</Link>
            </div>
          </form>
          <p>
            New User?{" "}
            <Link to="/register" id="switchlink">
              Register
            </Link>
          </p>
          {/* <div className="hr">
            <hr></hr>Or login with<hr></hr>
          </div>
          <div className="social-login"></div> */}
        </div>
      </div>
      <div className="pink-band"></div>
    </div>
  );
};

export default Login;
