import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import errGif from "../../../Media/err.gif";
import successGif from "../../../Media/success.gif";
import "./activationemail.css";

function showActivationErr(msg, timer, setTimer) {
  setInterval(() => {
    setTimer((timer = timer - 1));
  }, 1000);
  console.log(timer);
  return (
    <div className="aem">
      <img src={errGif} alt="" />
      <h1>{msg}</h1>
      <p>Redirecting to login page in {timer} s</p>
    </div>
  );
}

function showActivationSuccess(msg, timer, setTimer) {
  setInterval(() => {
    setTimer((timer = timer - 1));
  }, 1000);
  return (
    <div className="asm">
      <img src={successGif} alt="" />
      <h1>{msg}</h1>
      <p>Redirecting to login page in {timer} s</p>
    </div>
  );
}

const ActivationEmail = () => {
  const { activation_token } = useParams();
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post("/user/activation", {
            activation_token,
          });

          // setSuccess(res.data.msg);
          setSuccess(res.data.msg);

          setTimeout(() => {
            navigate("/login");
          }, 1000 * 5);
        } catch (err) {
          err.response.data.msg &&
            setErr(
              err.response.data.msg === "jwt expired"
                ? "Session timeout. Please register again!"
                : "Email has been already verified."
            );
          setTimeout(() => {
            navigate("/login");
          }, 1000 * 5);
        }
      };
      activationEmail();
    }
  }, [activation_token, navigate]);

  return (
    <div className="active_page">
      {err && showActivationErr(err, timer, setTimer)}
      {success && showActivationSuccess(success, timer, setTimer)}
    </div>
  );
};

export default ActivationEmail;
