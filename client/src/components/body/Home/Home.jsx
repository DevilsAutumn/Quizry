import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import MidHome from "./MidHome";
import logoWhite from "../../../Media/logo-white.png";
import HomeGif from "../../../Media/home-gif.gif";
import axios from "axios";

const Home = () => {
  const [stats, setStats] = useState([{}]);

  const getQuestionStats = async () => {
    const res = await axios.get("/user/stats");
    setStats(res.data[0]);
  };

  useEffect(() => {
    getQuestionStats();
  }, []);

  return (
    <>
      <div className="home-div">
        <div className="head-content">
          <div className="heading-home">
            <img src={logoWhite} alt="" />
            <h1>uizry</h1>
          </div>

          <p>Free to use, user-contributed trivia questions database</p>
          <div className="home-btn">
            <Link to="/api">
              <button>API</button>
            </Link>
            {/* <Link to="/donate">
            <button>Donate</button>
          </Link> */}
            <Link to="/contribute">
              <button>Contribute</button>
            </Link>
          </div>
        </div>
        <div className="home-band">
          <img src={HomeGif} alt="gif" />
        </div>
        <img src={HomeGif} alt="gif" id="mobile-gif" />
      </div>
      <MidHome />
      <div className="counter-div">
        <p>{stats && stats.AcceptedQuestions} Verified questions</p>
        <p>{stats && stats.pendingQuestion} Pending questions</p>
      </div>
    </>
  );
};

export default Home;
