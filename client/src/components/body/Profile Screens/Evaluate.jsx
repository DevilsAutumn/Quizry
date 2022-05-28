import React from "react";
import PendingQuestions from "./PendingQuestions";
import Contributions from "./Contributions";

const Evaluate = ({ allUsers }) => {
  return <>{!allUsers ? <PendingQuestions /> : <Contributions />}</>;
};

export default Evaluate;
