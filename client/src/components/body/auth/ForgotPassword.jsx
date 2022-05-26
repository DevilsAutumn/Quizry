import React, { useState } from "react";
import logingif from "../../../Media/login.gif";
import axios from "axios";
import { isEmail } from "../../Utils/validation/Validation";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../Utils/Notification/Notification";

const initalState = {
  email: "",
  err: "",
  success: "",
};

const ForgotPassword = () => {
  const [data, setData] = useState(initalState);

  const { email, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const forgotPassword = async () => {
    if (!isEmail(email))
      return setData({ ...data, err: "Invalid Email.", success: "" });
    try {
      const res = await axios.post("/user/forgot", { email });
      setData({ ...data, err: "", success: res.data.msg });
    } catch (err) {
      err.response.data.msg &&
        setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };
  return (
    <div className="login-div">
      <div className="login-page">
        <div className="logo-div">
          <img src={logingif} alt="" />
        </div>
        <div className="login-section">
          <h1>Forgot password?</h1>
          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}
          <form>
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
          </form>
          <div className="row">
            <button type="submit" onClick={forgotPassword}>
              Verify Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
