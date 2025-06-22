import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="admin-nav">
      <div className="admin-logo" onClick={() => navigate('/admin')}>F1 Race Journal - Panel de Administración</div>
      <div className="user-links">
        <button className="admin-link" onClick={() => navigate('/admin/calendario')}>Calendario</button>
        <button className="admin-link" onClick={() => navigate('/admin/pilotos')}>Pilotos</button>
        <button className="admin-link" onClick={() => navigate('/admin/equipos')}>Equipos</button>
      </div>
      <div className="admin-bottons">
        <button className="admin-button logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default AdminHeader;