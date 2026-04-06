import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="navbar sub-navbar">
        <div className="container d-flex justify-content-between">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#111111', letterSpacing: '1px' }}>
              Hipster Shop
            </span>
          </Link>
          <div className="controls">
            <Link to="/cart" className="cart-link">
              <img src="/icons/Hipster_CartIcon.svg" alt="Cart icon" className="logo" title="Cart" />
              {/* <span className="cart-size-circle">0</span> */}
            </Link>

            <div className="auth-actions">
              <Link to="/login" className="btn auth-btn auth-btn-outline">Login</Link>
              <Link to="/signup" className="btn auth-btn auth-btn-solid">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
