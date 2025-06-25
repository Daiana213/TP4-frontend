import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import './Pilotos.css';

function Pilotos() {
  const [pilotosBase, setPilotosBase] = useState([]);
  const [puntosCalculados, setPuntosCalculados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPilotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dataBase, puntosData] = await Promise.all([
          apiService.obtenerPilotos(),
          apiService.obtenerPuntosUsuario()
        ]);

        // Ordenar por nombre del equipo
        dataBase.sort((a, b) => {
          if (a.Equipo?.Nombre < b.Equipo?.Nombre) return -1;
          if (a.Equipo?.Nombre > b.Equipo?.Nombre) return 1;
          return 0;
        });

        setPilotosBase(dataBase);
        setPuntosCalculados(puntosData.pilotos || []);
      } catch (err) {
        setError('Error al cargar los pilotos');
      } finally {
        setLoading(false);
      }
    };

    fetchPilotos();
  }, []);

  // Buscar puntos del piloto por su id o nombre
  const obtenerPuntosCalculados = (piloto) => {
    const encontrado = puntosCalculados.find(
      (p) => p.id === piloto.id || p.nombre === piloto.Nombre
    );
    return encontrado ? encontrado.puntos : 0;
  };

  if (loading) return <div className="cargando">Cargando pilotos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="pilotos-container">
      <Header />
      <h1 className="titulopiloto">PILOTOS 2025</h1>
      <main className="mainpilotos">
        <div className="grid-pilotos">
          {pilotosBase.map((piloto, index) => (
            <div key={piloto.id || index} className="piloto-card">
              <h3>{piloto.Nombre}</h3>
              <div className="piloto-info">
                <p><strong>Número:</strong> {piloto.Numero}</p>
                <p><strong>País:</strong> {piloto.Pais}</p>
                <p><strong>Puntos:</strong> {obtenerPuntosCalculados(piloto)}</p>
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
