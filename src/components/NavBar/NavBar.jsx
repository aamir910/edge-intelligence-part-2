import React from 'react';
import './Navbar.css';

const Navbar = ({ image, color }) => {
  return (
    <nav className="navbar" style={{ backgroundColor: color }}>
      <div className="navbar-logo">
        <img src={image} alt="Logo" className="logo-left" />
        <img src='/logo2-remove.png' alt="Logo2" className="logo-right" />
      </div>
    </nav>
  );
};

export default Navbar;
