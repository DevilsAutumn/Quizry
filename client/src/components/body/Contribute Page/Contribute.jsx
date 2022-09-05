import React, { useState, useEffect } from "react";
import "./contribute.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../../Loader/Loader";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const Contribute = () => {
  const [loading, setLoading] = useState(false);
  const [allQuestions, setAllQuestions] = useState([{}]);
  const [TopContributors, setTopContributors] = useState([{}]);
  const [stats, setStats] = useState([{}]);
  const [searchresults, setSearchresults] = useState();

  const getAllQuestions = async () => {
    const res = await axios.get("/user/all_questions");
    setAllQuestions(res.data);
  };
  const getTopContributors = async () => {
    const res = await axios.get("/user/top_contributors");
    setTopContributors(res.data);
  };
  const getQuestionStats = async () => {
    const res = await axios.get("/user/stats");
    setStats(res.data[0]);
  };

  const state = {
    labels: ["Accepted", "Declined", "Pending"],
    datasets: [
      {
        label: "Stats",
        data: [
          stats.AcceptedQuestions,
          stats.DeclinedQuestions,
          stats.pendingQuestion,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const setsearchdata = () => {
    // if (allQuestions && allQuestions.question.includes(searchresults)) {
    //   setAllQuestions(allQuestions);
    // }
  };

  useEffect(() => {
    try {
      setLoading(true);
      getAllQuestions();
      getQuestionStats();
      getTopContributors();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (err) {}
  }, []);

  useEffect(() => {
    setsearchdata();
  }, [searchresults]);

  return (
    <div className="contribute-page bg-gradient">
      <div className="all-questions">
        <div className="contribution-head p-user-details">
          <h1>All Questions</h1>
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search a question.."
              id="searchbar"
              onChange={(e) => setSearchresults(e.target.value)}
            />
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png"
              alt="search"
            />
          </div>
          <Link to="/contribute/post-question">
            <button>Post Question</button>
          </Link>
        </div>

        {loading ? (
          <div className="loader">
            <Loader />
          </div>
        ) : (
          <table className="allusers contributor-list">
            <thead>
              <tr>
                <th id="status-head">ID</th>
                <th>Question/Statement</th>
                <th>Category</th>
                <th id="status-head">Status</th>
                <th>Contributor</th>
              </tr>
            </thead>
            <tbody>
              {allQuestions.map(
                (q) =>
                  q.question &&
                  (!searchresults ||
                    q.question
                      .toLowerCase()
                      .includes(searchresults.trim().toLowerCase())) && (
                    <tr key={q._id}>
                      <td>{q._id}</td>
                      <td>{q.question}</td>
                      <td>{q.category}</td>
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
                      <td>
                        <Link to={`/user/${q.posted_by_id}`}>
                          <u>{q.posted_by_name}</u>
                        </Link>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="contributor-right-col">
        <div className="top-contributors">
          <h2>Top Contributors</h2>
          <table className="top-contributors-list">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Accepted ques.</th>
              </tr>
            </thead>
            <tbody>
              {TopContributors.map((c, index) => {
                return (
                  c.accepted && (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.accepted}</td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="top-contributors">
          <h3>Total Questions Posted: {stats.TotalQuestions}</h3>
          <Doughnut
            data={state}
            options={{
              animation: {
                animateRotate: true,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Contribute;
