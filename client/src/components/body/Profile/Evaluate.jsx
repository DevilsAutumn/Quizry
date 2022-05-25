import React from "react";
import AllQuestions from "./AllQuestions";
import Contributions from "./Contributions";

const Evaluate = ({ allUsers }) => {
  return <>{!allUsers ? <AllQuestions /> : <Contributions />}</>;
};

export default Evaluate;
