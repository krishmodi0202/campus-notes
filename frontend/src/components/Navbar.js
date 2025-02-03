import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // Importing the icon from react-icons
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Function to toggle the menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Student Notes
        </Link>

        {/* Menu items, conditionally displayed based on the state of 'menuOpen' */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/notes" className="nav-link">
            Browse Notes
          </Link>
          
        </div>

        {/* React Icon (Hamburger Menu) */}
        <div className="react-icon" onClick={toggleMenu}>
          <FaBars size={30} color="#ffffff" />
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="auth-button login-button">
            Login
          </Link>
          <Link to="/signup" className="auth-button signup-button">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
