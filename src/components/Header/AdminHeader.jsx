import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
      <div className="admin-logo">F1 Race Journal - Panel de Administración</div>
      <div className="admin-links">
        <button className="admin-link" onClick={() => navigate('/admin')}>Dashboard</button>
        <button className="admin-link" onClick={() => navigate('/admin/pilotos')}>Gestionar Pilotos</button>
        <button className="admin-link" onClick={() => navigate('/admin/equipos')}>Gestionar Equipos</button>
        <button className="admin-link" onClick={() => navigate('/inicio')}>Ver Sitio</button>
      </div>
      <div className="admin-buttons">
        <button className="admin-button logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default AdminHeader;