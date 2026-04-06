import React from 'react';

const Footer = () => {
  return (
    <footer className="py-5">
      <div className="container footer-content">
        <div className="row text-center text-md-left">
          <div className="col-12 col-md-6 mb-3">
            <h5 className="footer-title">Hipster Shop (MERN Edition)</h5>
            <p className="text-muted footer-text">
              A port of the original Google Microservices Demo, now leveraging Node.js, Express, React, and MongoDB architecture.
            </p>
          </div>
          <div className="col-12 col-md-3 mb-3">
            <h5 className="footer-title">Links</h5>
            <ul className="list-unstyled footer-text">
              <li><a href="/">Home</a></li>
              <li><a href="/cart">Cart</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Sign Up</a></li>
            </ul>
          </div>
          <div className="col-12 col-md-3 mb-3">
            <h5 className="footer-title">Powered by</h5>
            <ul className="list-unstyled footer-text">
              <li>React + React Router</li>
              <li>Express.js Microservices</li>
              <li>Kubernetes + Docker</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
