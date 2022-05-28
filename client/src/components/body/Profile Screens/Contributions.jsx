import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showErrMsg } from "../../Utils/Notification/Notification";

const Contributions = () => {
  const [MyContributions, setMyContributions] = useState([]);

  const [QuesStats, setQuesStats] = useState();
  const [err, setErr] = useState("");
  const token = useSelector((state) => state.rootReducer.token);
  const auth = useSelector((state) => state.rootReducer.auth);

  async function fetchUserQuestions() {
    const res = await axios.get(`/user/my_questions/user=${auth.user._id}`, {
      headers: { Authorization: token },
    });
    setMyContributions(res.data);
  }

  async function getQuestionStats() {
    const res = await axios.get(`/user/questionStats`, {
      headers: { Authorization: token },
    });
    setQuesStats(res.data[0]);
  }
  useEffect(() => {
    try {
      fetchUserQuestions();
      getQuestionStats();
    } catch (err) {
      err.response.data.msg && setErr(err.response.data.msg);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-contributions">
      <div className="contribution-head">
        <div className="contribution-head-left">
          <Link to="/contribute/post-question">
            <img
              src="https://img.icons8.com/external-tanah-basah-detailed-outline-tanah-basah/48/000000/external-plus-user-interface-tanah-basah-detailed-outline-tanah-basah.png"
              alt="post-question"
            />
          </Link>
          <h2>My Contributions</h2>
          <img
            src="https://img.icons8.com/ios-glyphs/30/000000/refresh--v1.png"
            alt="refresh"
            id="refresh"
            onClick={() => {
              fetchUserQuestions();
              getQuestionStats();
            }}
          />
        </div>
        <h3>Total: {QuesStats && QuesStats.totalcontribution}</h3>
        <h3>Accepted: {QuesStats && QuesStats.accepted}</h3>
        <h3>Declined: {QuesStats && QuesStats.declined}</h3>
        <h3>Pending: {QuesStats && QuesStats.pending}</h3>
      </div>
      {err && showErrMsg(err)}
      <table className="allusers">
        <thead>
          <tr>
            <th id="status-head">ID</th>

            <th>Question/Statement</th>
            <th id="status-head">Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {MyContributions.map((q) => (
            <tr key={q._id}>
              <td>{q._id}</td>
              <td>{q.question}</td>
              <td
                style={
                  q.status === "Accepted"
                    ? { backgroundColor: "rgb(9, 158, 54)", color: "white" }
                    : q.status === "Declined"
                    ? { backgroundColor: "rgb(214, 10, 10)", color: "white" }
                    : { backgroundColor: "Yellow" }
                }
              >
                {q.status}
              </td>
              <td>{q.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Contributions;
