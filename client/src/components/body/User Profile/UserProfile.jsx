import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./userprofile.css";
import { showErrMsg } from "../../Utils/Notification/Notification";
import { RevolvingDot } from "react-loader-spinner";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [err, setErr] = useState("");
  const [MyContributions, setMyContributions] = useState([]);
  const [QuesStats, setQuesStats] = useState();
  const [loading, setLoading] = useState(false);

  async function fetchUserQuestions() {
    const res = await axios.get(`/user/user_questions/${id}`);
    setMyContributions(res.data);
  }

  async function getQuestionStats() {
    const res = await axios.get(`/user/questionStats/${id}`);
    setQuesStats(res.data[0]);
  }

  async function getUserData() {
    const res = await axios.get(`/user/user_info/${id}`);
    setUser(res.data);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    try {
      fetchUserQuestions();
      getQuestionStats();
      getUserData();
    } catch (err) {
      err.response.data.msg && setErr(err.response.data.msg);
      setLoading(false);
    }

    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="profile-div">
      <div className="user-profile-card">
        {loading ? (
          <div className="loader">
            <RevolvingDot
              height="100"
              width="100"
              color="#c01616"
              ariaLabel="loading"
            />
          </div>
        ) : (
          user && (
            <>
              <div className="user-profile-pic">
                <img src={user.avatar} alt="" />
              </div>
              <h1 id="profile-username">{user.name}</h1>
              <h2>
                {user.role === 2
                  ? "Admin👑"
                  : user.role === 1
                  ? "Evaluator📝"
                  : "User"}
              </h2>
              <div className="user-profile-stats">
                <h2>
                  Questions posted :{" "}
                  {QuesStats && QuesStats.totalcontribution
                    ? QuesStats.totalcontribution
                    : 0}
                </h2>
                <h2>
                  Accepted :{" "}
                  {QuesStats && QuesStats.accepted ? QuesStats.accepted : 0}
                </h2>
                <h2>
                  Declined :{" "}
                  {QuesStats && QuesStats.declined ? QuesStats.declined : 0}
                </h2>
                <h2>
                  Pending :{" "}
                  {QuesStats && QuesStats.pending ? QuesStats.pending : 0}
                </h2>
              </div>
              <div className="user-profile-questions">
                <table className=" allusers ">
                  <thead>
                    <tr>
                      <th>Question/Statement</th>
                      <th id="status-head">Status</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  {err && showErrMsg(err)}
                  <tbody>
                    {MyContributions.map((q) => (
                      <tr key={q._id}>
                        <td>{q.question}</td>
                        <td
                          style={
                            q.status === "Accepted"
                              ? {
                                  backgroundColor: "rgb(9, 158, 54)",
                                  color: "white",
                                }
                              : q.status === "Declined"
                              ? {
                                  backgroundColor: "rgb(214, 10, 10)",
                                  color: "white",
                                }
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
            </>
          )
        )}
      </div>
      <div className="pink-band"></div>
    </div>
  );
};

export default UserProfile;
