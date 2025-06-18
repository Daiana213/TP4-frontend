import React from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-container">
      <AdminHeader />
      <main className="admin-main">
        <h1 className="admin-title">Panel de Administración F1</h1>
        <p className="admin-desc">
          Bienvenido al panel de administración. Desde aquí puedes gestionar las principales funciones del sistema:
        </p>
        <div className="admin-actions">
          <Link to="/admin/pilotos" className="admin-btn">
            <span className="material-icons">person</span>
            Gestionar Pilotos
          </Link>
          <Link to="/admin/equipos" className="admin-btn">
            <span className="material-icons">groups</span>
            Gestionar Equipos
          </Link>
          <Link to="/admin/calendario" className="admin-btn">
            <span className="material-icons">calendar_month</span>
            Gestionar Calendario
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Admin;