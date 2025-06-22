import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import './Equipos.css';

function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const data = await apiService.obtenerEquipos();
        setEquipos(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los equipos');
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  if (loading) return <div className="cargando">Cargando equipos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="equipos-container">
      <Header />
      <h1 className="tituloequipo">EQUIPOS 2025</h1>
      <main className="mainequipo">
        <div className="equipos-grid">
          {equipos.map((equipo) => (
            <div key={equipo.id} className="equipo-card">
              <h2>{equipo.Nombre}</h2>
              <div className="equipo-info">
                <p><strong>País:</strong> {equipo.Pais}</p>
                <p><strong>Puntos:</strong> {equipo.Puntos}</p>
                <p><strong>Podios:</strong> {equipo.Podios}</p>
                <p><strong>Victorias:</strong> {equipo.Wins}</p>
                <p><strong>Jefe de Equipo:</strong> {equipo.Team_chief}</p>
                <p><strong>Jefe Técnico:</strong> {equipo.Technical_chief}</p>
              </div>
              <div className="pilotos-equipo">
                <h3>Pilotos:</h3>
                <ul>
                  {equipo.Pilotos?.map(piloto => (
                    <li key={piloto.id}>{piloto.Nombre} - #{piloto.Numero}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Equipos;