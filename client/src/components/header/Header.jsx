import React, { useState } from "react";
import "./header.css";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import logo from "../../Media/logo.png";

const Header = () => {
  const auth = useSelector((state) => state.rootReducer.auth);
  const [dd, setDd] = useState(false);

  const { user, isLogged } = auth;

  const handleLogout = async () => {
    try {
      await axios.get("/user/logout");
      localStorage.removeItem("firstLogin");
      window.location.href = "/";
    } catch (err) {
      window.location.href = "/";
    }
  };

  const userLink = () => {
    return (
      <li className="drop-nav">
        <Link to="#" className="avatar">
          <img src={user.avatar} alt="" className="avatar-icon" />
          <b>{user.name}</b>
          <i
            className="fa fa-angle-down"
            aria-hidden="true"
            onClick={() => {
              setDd(!dd);
            }}
          ></i>
        </Link>
        {dd && (
          <ul className="dropdown" id="dd">
            <Link to="/profile" onClick={() => setDd(false)}>
              Pofile
            </Link>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </ul>
        )}
      </li>
    );
  };

  return (
    <header>
      <Link to="/">
        <img src={logo} alt="logo" id="logo" />
      </Link>
      <ul>
        <li>
          <NavLink to="/" activeclassname="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/api" activeclassname="active">
            Api
          </NavLink>
        </li>
        <li>
          <NavLink to="/contribute" activeclassname="active">
            Contribute
          </NavLink>
        </li>
        {isLogged ? (
          userLink()
        ) : (
          <li>
            <NavLink to="/login">Log In</NavLink>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;
