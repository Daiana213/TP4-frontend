import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleRegistro = () => {
    navigate('/registro');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="landing-nav">
      <div className="nav-logo">F1 Race Journal</div>
      <div className="nav-buttons">
        <button className="nav-button login" onClick={handleLogin}>
          Iniciar Sesión
        </button>
        <button className="nav-button register" onClick={handleRegistro}>
          Registro
        </button>
      </div>
    </nav>
  );
};

export default Header;