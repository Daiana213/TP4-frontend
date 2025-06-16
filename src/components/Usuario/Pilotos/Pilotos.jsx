import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import './Pilotos.css';

function Pilotos() {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPilotos = async () => {
      try {
        const data = await apiService.obtenerPilotos();

        // Ordenar y "aplanar" el array: pilotos ordenados por equipo
        // Suponemos que los pilotos ya vienen con propiedad Equipo.Nombre
        // Ordenamos por equipo para mantener agrupación lógica (opcional)
        data.sort((a, b) => {
          if (a.Equipo?.Nombre < b.Equipo?.Nombre) return -1;
          if (a.Equipo?.Nombre > b.Equipo?.Nombre) return 1;
          return 0;
        });

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
      <h1 className="titulopiloto">PILOTOS 2025</h1>
      <main>
        <div className="grid-pilotos">
          {pilotos.map((piloto, index) => (
            <div key={index} className="piloto-card">
              <h3>{piloto.Nombre}</h3>
              <div className="piloto-info">
                <p><strong>Número:</strong> {piloto.Numero}</p>
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
