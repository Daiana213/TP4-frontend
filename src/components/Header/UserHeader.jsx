import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserHeader.css';

const UserHeader = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="user-nav">
      <div className="user-logo" onClick={() => navigate('/inicio')}>F1 Race Journal</div>
      <div className="user-links">
        <button className="user-link" onClick={() => navigate('/inicio')}>Inicio</button>
        <button className="user-link" onClick={() => navigate('/pilotos')}>Pilotos</button>
        <button className="user-link" onClick={() => navigate('/equipos')}>Equipos</button>
      </div>
      <div className="user-profile">
        <span className="user-greeting">Hola, {user?.nombre || 'Usuario'}</span>
        <button className="user-button logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default UserHeader;