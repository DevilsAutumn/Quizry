import React from "react";
import notFound from "../../../Media/Notfound.gif";
import { useSelector } from "react-redux";
import "./notfound.css";

const NotFound = () => {
  const auth = useSelector((state) => state.rootReducer.auth);

  const { isLogged } = auth;

  return (
    <>
      <div
        className="notfound"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <img src={notFound} alt="" style={{ height: "70vh" }} />
        {!isLogged && <h1>Please Login or Register first!</h1>}
      </div>
    </>
  );
};

export default NotFound;
