import React from "react";
import notFound from "../../../Media/Notfound.gif";

const NotFound = () => {
  return (
    <div className="notfound">
      <img src={notFound} alt="" style={{ height: "70vh" }} />
    </div>
  );
};

export default NotFound;
