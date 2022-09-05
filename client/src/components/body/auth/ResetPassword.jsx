import React, { useState } from "react";
import logingif from "../../../Media/login.gif";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../Utils/Notification/Notification";
import { isLength, isMatch } from "../../Utils/validation/Validation";

const initalState = {
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

const ResetPassword = () => {
  const [data, setData] = useState(initalState);
  const [pvisible, setPvisible] = useState(false);
  const [cpvisible, setCpvisible] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const { password, cf_password, err, success } = data;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const handleResetPass = async () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Password did not match.", success: "" });

    try {
      const res = await axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: res.data.msg });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    } catch (err) {
      err.response.data.msg &&
        setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div className="login-div bg-gradient">
      <div className="login-page">
        <div className="logo-div">
          <img src={logingif} alt="" />
        </div>
        <div className="login-section">
          <h1>Reset passowrd</h1>
          {err && showErrMsg(err)}
          {success && showSuccessMsg(success)}
          <form>
            <div>
              <label htmlFor="password">Enter new password</label>
              <div className="input-div">
                <input
                  type={pvisible ? "text" : "password"}
                  placeholder="Enter new password"
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
            <div>
              <label htmlFor="cf_password">Re-enter password</label>
              <div className="input-div">
                <input
                  type={cpvisible ? "text" : "password"}
                  placeholder="Re-enter new password"
                  id="cf_password"
                  value={cf_password}
                  name="cf_password"
                  onChange={handleChangeInput}
                />
                {cpvisible ? (
                  <img
                    src="https://img.icons8.com/cotton/20/undefined/surprise--v2.png"
                    id="pass-eye"
                    alt="eye"
                    onClick={() => setCpvisible(!cpvisible)}
                  />
                ) : (
                  <img
                    src="https://img.icons8.com/windows/20/undefined/closed-eye.png"
                    id="pass-eye"
                    alt="eye"
                    onClick={() => setCpvisible(!cpvisible)}
                  />
                )}
              </div>
            </div>
          </form>
          <div className="row">
            <button type="submit" onClick={handleResetPass}>
              Reset password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
