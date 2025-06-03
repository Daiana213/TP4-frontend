import React, { useState, useEffect } from 'react';
import Header from '../Header/UserHeader';
import Footer from '../Footer/Footer';
import { apiService } from '../../../config/api';
import './Pilotos.css';

function Pilotos() {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPilotos = async () => {
      try {
        const data = await apiService.obtenerPilotos();
        setPilotos(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los pilotos');
        setLoading(false);
      }
    };

    fetchPilotos();
  }, []);

  if (loading) return <div className="cargando">Cargando pilotos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="pilotos-container">
      <Header />
      <main>
        <h1 className="titulo">Pilotos F1 2025</h1>
        <div className="pilotos-grid">
          {pilotos.map((piloto) => (
            <div key={piloto.id} className="piloto-card">
              <h2>{piloto.Nombre}</h2>
              <div className="piloto-info">
                <p><strong>Número:</strong> {piloto.Numero}</p>
                <p><strong>Equipo:</strong> {piloto.Equipo?.Nombre}</p>
                <p><strong>País:</strong> {piloto.Pais}</p>
                <p><strong>Puntos:</strong> {piloto.Puntos}</p>
                <p><strong>Campeonatos:</strong> {piloto.Campeonatos}</p>
                <p><strong>Podios:</strong> {piloto.Podios}</p>
                <p><strong>Victorias:</strong> {piloto.Wins}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Pilotos;