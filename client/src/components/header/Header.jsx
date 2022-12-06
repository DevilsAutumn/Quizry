import React, { useState } from "react";
import "./header.css";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Spin as Hamburger } from "hamburger-react";

const Header = (props) => {
  const auth = useSelector((state) => state.rootReducer.auth);
  const [dd, setDd] = useState(false);
  // eslint-disable-next-line
  const [isOpen, setIsOpen] = useState(false);

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

  document.body.addEventListener(
    "click",
    function (e) {
      let container = document.getElementById("drop-nav");
      if (!container.contains(e.target)) {
        setDd(false);
      }
    },
    true
  );

  document.body.addEventListener(
    "click",
    function (e) {
      let container = document.getElementById("navbar");
      if (!container.contains(e.target)) {
        setIsOpen(false);
      }
    },
    true
  );

  const userLink = () => {
    return (
      <li className="drop-nav" id="drop-nav">
        <Link
          to="#"
          className="avatar"
          onClick={() => {
            setDd(!dd);
          }}
        >
          <img src={user.avatar} alt="" className="avatar-icon" />
          <text>
            <b>{user.name}</b>
          </text>
          <i
            className="fa fa-angle-down"
            id={dd && "down-arrow"}
            aria-hidden="true"
          ></i>
        </Link>
        {dd && (
          <ul className="dropdown" id="dd">
            <Link to="/my-profile" onClick={() => setDd(false)}>
              My Profile
            </Link>
            <Link to="/dashboard" onClick={() => setDd(false)}>
              Dashboard
            </Link>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </ul>
        )}
      </li>
    );
  };

  const CloseNav = () => {
    var element = document.getElementById("header");
    element.classList.remove("nav-open");
    setIsOpen(false);
  };

  return (
    <>
      <div className="navbar" id="navbar">
        {/* <Menu {...props} className="menu"> */}
        <header className={isOpen && "nav-open"} id="header">
          <NavLink to="/" activeclassname="active" onClick={CloseNav}>
            Home
          </NavLink>
          <NavLink to="/api" activeclassname="active" onClick={CloseNav}>
            API
          </NavLink>
          <NavLink to="/contribute" activeclassname="active" onClick={CloseNav}>
            Contribute
          </NavLink>
          {/* <NavLink to="/donate" activeclassname="active" onClick={CloseNav}>
            Donate
          </NavLink> */}
          <a href="mailto:quizryapp@gmail.com" target="_blank" rel="noreferrer">
            Contact Us
          </a>
          <h1>v1.3.7</h1>
        </header>
        {/* </Menu> */}
        <Hamburger
          toggled={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          id="hamburger"
        />
        {isLogged ? (
          userLink()
        ) : (
          <NavLink to="/login" id="login-register">
            Log In/Register
          </NavLink>
        )}
      </div>
    </>
  );
};

export default Header;
