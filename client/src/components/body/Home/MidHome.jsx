import React from "react";
import HomeGif from "../../../Media/management.gif";

const MidHome = () => {
  return (
    <div className="mid-home">
      <h1>Why Quizry?</h1>
      <div className="mid-home-content">
        <div className="mid-home-text">
          <ul className="a">
            <li>Easy to setup</li>
            <li>Free of cost</li>
            <li>Questions contributed by users</li>
            <li>Questions verified by Evaluators</li>
            <li>Easily generate api and use it anywhere!</li>
          </ul>
        </div>
        <div className="mid-home-image">
          <img src={HomeGif} alt="" id="homegif" />
        </div>
      </div>
    </div>
  );
};

export default MidHome;
