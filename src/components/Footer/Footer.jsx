import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="landing-footer">
      <p>&copy; 2024 F1 Race Journal. Tu experiencia personal en la F1.</p>
      <div className="footer-links">
        <Link to="/login" className="admin-link">Admin</Link>
      </div>
    </footer>
  );
};

export default Footer;