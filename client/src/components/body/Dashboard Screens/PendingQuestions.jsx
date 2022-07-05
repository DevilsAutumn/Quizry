import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, Routes, Route } from "react-router-dom";
import { showErrMsg } from "../../Utils/Notification/Notification";
import EvaluationScreen from "./EvaluationScreen";
import NotFound from "../../Utils/NotFound/NotFound";

const PendingQuestions = () => {
  const [PendingQuestions, setPendingQuestions] = useState([]);
  const [err, setErr] = useState(false);
  const token = useSelector((state) => state.rootReducer.token);
  const auth = useSelector((state) => state.rootReducer.auth);

  const { isAdmin, isEvaluator } = auth;

  async function getPendingQuestions() {
    const res = await axios.get(`/user/pending_questions`, {
      headers: { Authorization: token },
    });
    setPendingQuestions(res.data);
  }
  useEffect(() => {
    try {
      getPendingQuestions();
    } catch (err) {
      err.response.data.msg && setErr(err.response.data.msg);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="p-contributions">
        <div className="contribution-head">
          <div className="contribution-head-left">
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/refresh--v1.png"
              alt="refresh"
              onClick={getPendingQuestions}
            />
            <h1>Evaluate</h1>
          </div>
          <p>
            Total Pending Questions:{" "}
            <b>{PendingQuestions ? PendingQuestions.length : "0"}</b>
          </p>
        </div>
        {err && showErrMsg(err)}
        <Routes>
          <Route
            path={`/`}
            element={
              isAdmin || isEvaluator ? (
                <table className="allusers">
                  <thead>
                    <tr>
                      <th id="status-head">ID</th>
                      <th>Question/Statement</th>
                      <th id="status-head">Status</th>
                      <th>Contributor</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PendingQuestions.map((q) => (
                      <tr key={q._id}>
                        <td>{q._id}</td>
                        <td>{q.question}</td>
                        <td style={{ backgroundColor: "Yellow" }}>
                          {q.status}
                        </td>
                        <td>{q.posted_by_name}</td>
                        <td>
                          <Link to={`question=${q._id}`}>
                            <u>Evaluate</u>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <NotFound />
              )
            }
            exact
          />{" "}
          <Route
            path={`question=:id`}
            element={
              isAdmin || isEvaluator ? (
                <EvaluationScreen getPendingQuestions={getPendingQuestions} />
              ) : (
                <NotFound />
              )
            }
            exact
          />
        </Routes>
      </div>
    </>
  );
};

export default PendingQuestions;
