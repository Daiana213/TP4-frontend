// Pilotos.jsx (versión modificada)
import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import './Pilotos.css';

function Pilotos() {
  const [pilotosPorEquipo, setPilotosPorEquipo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPilotos = async () => {
      try {
        const data = await apiService.obtenerPilotos();

        const grupos = data.reduce((acc, piloto) => {
          const equipo = piloto.Equipo?.Nombre || 'Sin equipo';
          if (!acc[equipo]) acc[equipo] = [];
          acc[equipo].push(piloto);
          return acc;
        }, {});

        setPilotosPorEquipo(grupos);
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
          {Object.entries(pilotosPorEquipo).map(([equipoNombre, grupo], index) => (
            <div key={index} className="fila-equipo">
              {/* Piloto 1 */}
              <div className="piloto-card">
                {grupo[0] ? (
                  <>
                    <h3>{grupo[0].Nombre}</h3>
                    <div className="piloto-info">
                      <p><strong>Número:</strong> {grupo[0].Numero}</p>
                      <p><strong>País:</strong> {grupo[0].Pais}</p>
                      <p><strong>Puntos:</strong> {grupo[0].Puntos}</p>
                      <p><strong>Campeonatos:</strong> {grupo[0].Campeonatos}</p>
                      <p><strong>Podios:</strong> {grupo[0].Podios}</p>
                      <p><strong>Victorias:</strong> {grupo[0].Wins}</p>
                    </div>
                  </>
                ) : (
                  <p>No hay piloto 1</p>
                )}
              </div>
  
              {/* Piloto 2 */}
              <div className="piloto-card">
                {grupo[1] ? (
                  <>
                    <h3>{grupo[1].Nombre}</h3>
                    <div className="piloto-info">
                      <p><strong>Número:</strong> {grupo[1].Numero}</p>
                      <p><strong>País:</strong> {grupo[1].Pais}</p>
                      <p><strong>Puntos:</strong> {grupo[1].Puntos}</p>
                      <p><strong>Campeonatos:</strong> {grupo[1].Campeonatos}</p>
                      <p><strong>Podios:</strong> {grupo[1].Podios}</p>
                      <p><strong>Victorias:</strong> {grupo[1].Wins}</p>
                    </div>
                  </>
                ) : (
                  <p>No hay piloto 2</p>
                )}
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
