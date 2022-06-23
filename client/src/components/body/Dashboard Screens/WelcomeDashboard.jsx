import React from "react";

const WelcomeDashboard = () => {
  return (
    <div className="dashboard-welcome">
      <h1>Welcome to Quizry Dashboard!</h1>
      <p>
        Hey there! This Dashboard is a little space for all Quizry users. <br />
        <li>If you are a user you can only see your contributions here.</li>
        <li>
          If you are a Evaluator you can see your contributions as well as
          evaluate questions posted by others.
        </li>
        <li>
          If you are an Admin, you have all the powers of evaluator and users as
          well as you can edit roles of evaluator and users or delete their
          accounts .
        </li>
      </p>
    </div>
  );
};

export default WelcomeDashboard;
