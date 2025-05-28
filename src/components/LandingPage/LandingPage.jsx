import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRegistro = () => {
    navigate('/registro');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <Header />
      <main className="landing-main">
        <div className="hero-section">
          <h1>Tu Diario Personal de F1</h1>
          <p className="hero-description">
            Registra tus experiencias y momentos favoritos de cada Gran Premio
          </p>
          <button className="cta-button" onClick={handleRegistro}>
            Comenzar Ahora
          </button>
        </div>

        <div className="features-section">
          <h2>Características Principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📅</span>
              <h3>Calendario de Carreras</h3>
              <p>Accede al calendario completo de la temporada</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📝</span>
              <h3>Notas Personales</h3>
              <p>Crea entradas detalladas para cada carrera</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🏆</span>
              <h3>Registro de Podios</h3>
              <p>Guarda los resultados de cada Gran Premio</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;