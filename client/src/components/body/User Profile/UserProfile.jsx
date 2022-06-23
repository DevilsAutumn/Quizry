import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./userprofile.css";
import { showErrMsg } from "../../Utils/Notification/Notification";
import Loader from "../../Loader/Loader";

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
  }

  useEffect(() => {
    setLoading(true);
    try {
      fetchUserQuestions();
      getQuestionStats();
      getUserData();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
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
            <Loader />
          </div>
        ) : (
          user && (
            <>
              <div className="upper-user-profile">
                <div className="user-profile-pic">
                  <img src={user.avatar} alt="" />
                </div>
                <div className="user-profile-stats">
                  <h1 id="profile-username">{user.name}</h1>
                  <h2>
                    <p>
                      {user.role === 2
                        ? " Admin👑"
                        : user.role === 1
                        ? " Evaluator📝"
                        : " User"}
                    </p>
                  </h2>
                  {user.bio && <p>About: {user.bio}</p>}
                  {user.website && (
                    <p>
                      My website:{" "}
                      <a href={`${user.website}`} target="__blank">
                        <u>{user.website}</u>
                      </a>
                    </p>
                  )}
                  {(user.linkedin ||
                    user.instagram ||
                    user.github ||
                    user.twitter) && (
                    <div className="user-socials">
                      My Socials:{"  "}
                      {user.linkedin && (
                        <a href={`${user.linkedin}`} target="__blank">
                          <img
                            src="https://img.icons8.com/color/30/undefined/linkedin-circled--v1.png"
                            alt="linkedin"
                          />
                        </a>
                      )}
                      {user.instagram && (
                        <a href={`${user.instagram}`} target="__blank">
                          <img
                            src="https://img.icons8.com/fluency/30/undefined/instagram-new.png"
                            alt="insta"
                          />
                        </a>
                      )}
                      {user.github && (
                        <a href={`${user.github}`} target="__blank">
                          <img
                            src="https://img.icons8.com/fluency/30/undefined/github.png"
                            alt="github"
                          />
                        </a>
                      )}
                      {user.twitter && (
                        <a href={`${user.twitter}`} target="__blank">
                          <img
                            src="https://img.icons8.com/color/30/undefined/twitter--v1.png"
                            alt="twitter"
                          />
                        </a>
                      )}
                    </div>
                  )}
                  <div className="questions-stats">
                    <p>
                      Questions posted :{" "}
                      {QuesStats && QuesStats.totalcontribution
                        ? QuesStats.totalcontribution
                        : 0}
                      &nbsp;|&nbsp;
                    </p>
                    <br />
                    <p>
                      Accepted :{" "}
                      {QuesStats && QuesStats.accepted ? QuesStats.accepted : 0}
                      &nbsp;|&nbsp;
                    </p>
                    <br />
                    <p>
                      Declined :{" "}
                      {QuesStats && QuesStats.declined ? QuesStats.declined : 0}
                      &nbsp;|&nbsp;
                    </p>
                    <br />
                    <p>
                      Pending :{" "}
                      {QuesStats && QuesStats.pending ? QuesStats.pending : 0}
                    </p>
                  </div>
                </div>
              </div>
              {/* <h2>{user.name}'s Contributions</h2> */}
              <div className="user-profile-questions">
                <br />
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
