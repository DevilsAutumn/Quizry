import React, { useState } from "react";
import "./header.css";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
// import { Spin as Hamburger } from "hamburger-react";
import { scaleRotate as Menu } from "react-burger-menu";

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
    function () {
      if (dd) {
        setDd(false);
      }
    },
    true
  );

  const userLink = () => {
    return (
      <li className="drop-nav">
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
          <i className="fa fa-angle-down" aria-hidden="true"></i>
        </Link>
        {dd && (
          <ul className="dropdown" id="dd">
            <Link to="/profile">Pofile</Link>
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
      <div className="navbar">
        <Menu {...props} className="menu">
          {/* <header className={isOpen && "nav-open"} id="header"> */}

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
          {/* </header> */}
        </Menu>
        {/* <Hamburger
          toggled={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          id="hamburger"
        /> */}
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
