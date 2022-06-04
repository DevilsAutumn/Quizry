import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/header/Header";
import Body from "./components/body/Body";
import Footer from "./components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  dispatchLogin,
  fetchUser,
  dispatchGetUser,
} from "./redux/actions/authAction";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.rootReducer.token);
  const auth = useSelector((state) => state.rootReducer.auth);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post("/user/refresh_token", null);

        dispatch({ type: "GET_TOKEN", payload: res.data.access_token });
      };
      getToken();
    }
  }, [auth.isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());
        return fetchUser(token).then((res) => {
          dispatch(dispatchGetUser(res));
        });
      };
      getUser();
    }
  }, [token, dispatch]);

  return (
    <Router>
      <div className="App" id="outer-container">
        <Header pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
        <div id="page-wrap">
          <Body />
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
