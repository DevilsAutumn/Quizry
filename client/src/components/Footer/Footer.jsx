import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            {/* <img src={logo1x} alt="" /> */}
            <h1>Q</h1>
          </div>
          <div className="footer-links">
            <a href="/">
              <p>Home</p>
            </a>
            <a href="/donate">
              <p>Donate</p>
            </a>
            <a
              href="mailto:bhuvnesh875@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              <p>Contact Us</p>
            </a>
            <a
              href="mailto:bhuvnesh875@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              <p>Help & support</p>
            </a>
          </div>
        </div>
        <hr />
        <p className="copyright">
          Copyright © 2022 Quizry | All rights reserved
        </p>
      </footer>
    </>
  );
};

export default Footer;
