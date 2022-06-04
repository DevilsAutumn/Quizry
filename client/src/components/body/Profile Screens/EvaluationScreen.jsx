import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { RevolvingDot } from "react-loader-spinner";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../Utils/Notification/Notification";

const EvaluationScreen = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.rootReducer.token);
  const [pendingQuestion, setPendingQuestion] = useState([]);
  const [success, setSuccess] = useState();
  const [reason, setReason] = useState("");
  const [Loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const navigate = useNavigate();

  async function getOnePendingQuestion() {
    setLoading(true);
    const res = await axios.get(`/user/one_pending_question/${id}`, {
      headers: { Authorization: token },
    });

    setLoading(false);
    setPendingQuestion(res.data[0]);
  }
  useEffect(() => {
    try {
      getOnePendingQuestion();
    } catch (err) {
      setLoading(false);
      err.response.data.msg && setErr(err.response.data.msg);
    }
  }, []);

  const handleClick = async (e) => {
    const status = e.target.value;
    try {
      const res = await axios.post(
        `/user/evaluate_question/${id}`,
        { reason, status },
        {
          headers: { Authorization: token },
        }
      );
      setSuccess(res.data.msg);
      navigate("/profile/evaluate");
    } catch (err) {
      err.response.data.msg && setErr(err.response.data.msg);
    }
  };
  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };
  return (
    <div className="profile-div">
      <div className="e-container p-card ">
        {Loading ? (
          <div className="loader">
            <RevolvingDot
              height="100"
              width="100"
              color="#c01616"
              ariaLabel="loading"
            />
          </div>
        ) : (
          <div className="p-contributions evaluation-card">
            <div className="evaluation-heading">
              <h3>Question ID: {id} </h3>
              <h3>Author's ID: {pendingQuestion.posted_by_id} </h3>
              <h3>Author's name: {pendingQuestion.posted_by_name} </h3>
            </div>
            <div className="evaluating-question-main">
              {}
              <p>
                <b>Question : </b>
                {pendingQuestion.question}
              </p>
              {/* <p>
              Options:{" "}
              {pendingQuestion.options.forEach((option, index) => {
                  return (
                      <p key={index}>
                      Option {index + 1}: {option}
                      </p>
                      );
                    })}
                </p> */}
              <p>
                <b>Options :</b>{" "}
                {pendingQuestion.options && pendingQuestion.options.join(" , ")}
              </p>
              <p>
                <b>Correct Option :</b> {pendingQuestion.correct_option}
              </p>
              <p>
                <b>Category :</b> {pendingQuestion.category}
              </p>
              <p>
                <b>Type :</b> {pendingQuestion.type}
              </p>
              <p>
                <b>Difficulty :</b> {pendingQuestion.difficulty}
              </p>
              <p>
                <b>Posted On : </b>
                {new Date(pendingQuestion.createdAt).toLocaleString()}
              </p>
              <div className="evaluator-actions p-user-details">
                <label htmlFor="reason">{`(Optional) Reason for Rejecting/Advice:`}</label>
                <textarea
                  name="reason"
                  id="reason"
                  cols="40"
                  rows="4"
                  value={reason}
                  onChange={handleReasonChange}
                  placeholder="Type here"
                />
                <div className="e-btns">
                  <button
                    value="Declined"
                    onClick={(e) => {
                      handleClick(e);
                    }}
                  >
                    Decline
                  </button>

                  <button
                    value="Accepted"
                    onClick={(e) => {
                      handleClick(e);
                    }}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="pink-band"></div>
    </div>
  );
};

export default EvaluationScreen;
