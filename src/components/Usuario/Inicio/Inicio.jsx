import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
  const [carreras, setCarreras] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        const [carrerasData, puntosData] = await Promise.all([
          apiService.obtenerCalendario(),
          apiService.obtenerPuntosUsuario()
        ]);

        setCarreras(carrerasData);

        const pilotosTop = [...(puntosData.pilotos || [])]
          .sort((a, b) => b.puntos - a.puntos)
          .slice(0, 3);
        setPilotos(pilotosTop);

        const equiposTop = [...(puntosData.equipos || [])]
          .sort((a, b) => b.puntos - a.puntos)
          .slice(0, 3);
        setEquipos(equiposTop);
      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  const hoy = new Date();
  const proximasCarreras = carreras
    .filter((carrera) => new Date(carrera.fecha) > hoy)
    .slice(0, 2);

  if (loading)
    return <div className="cargando"><span className="spinner"></span> Cargando datos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inicio-container">
      <Header />
      <div className="inicio-main">
        <div className="welcome-section">
          <h1 className="titulo">Hola, {currentUser?.nombre || 'Usuario'}</h1>
        </div>

        <div className="main-content-grid">
          <div className="column">
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Próximas Carreras</h2>
              </div>
              <div className="card-content">
                {proximasCarreras.length === 0 ? (
                  <div className="no-data">No hay carreras próximas disponibles.</div>
                ) : (
                  <div className="carreras-lista">
                    {proximasCarreras.map((carrera) => (
                      <div key={carrera.id} className="carrera-item">
                        <div className="carrera-header">
                          <span className="carrera-round">Ronda {carrera.id}</span>
                          <span className="carrera-date">{formatearFecha(carrera.fecha)}</span>
                        </div>
                        <div className="carrera-name">{carrera.nombre}</div>
                        <div className="carrera-details">
                          <span className="carrera-country">{carrera.pais}</span>
                          <span className="carrera-circuit">{carrera.circuito}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="column">
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Top 3 Pilotos</h2>
              </div>
              <div className="card-content">
                {pilotos.length === 0 ? (
                  <div className="no-data">No hay datos de pilotos.</div>
                ) : (
                  <div className="ranking-list">
                    {pilotos.map((piloto, index) => (
                      <div key={piloto.id ?? piloto.nombre} className="ranking-item">
                        <div className="ranking-info">
                          <div className="ranking-position">{index + 1}</div>
                          <div className="ranking-name">{piloto.nombre}</div>
                        </div>
                        <div className="ranking-points">
                          <div className="points-number">{piloto.puntos}</div>
                          <div className="points-label">pts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="column">
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Top 3 Equipos</h2>
              </div>
              <div className="card-content">
                {equipos.length === 0 ? (
                  <div className="no-data">No hay datos de equipos.</div>
                ) : (
                  <div className="ranking-list">
                    {equipos.map((equipo, index) => (
                      <div key={equipo.id ?? equipo.equipo ?? equipo.nombre} className="ranking-item">
                        <div className="ranking-info">
                          <div className="ranking-position">{index + 1}</div>
                          <div className="ranking-name">{equipo.equipo || equipo.nombre}</div>
                        </div>
                        <div className="ranking-points">
                          <div className="points-number">{equipo.puntos}</div>
                          <div className="points-label">pts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <button onClick={() => navigate('/puestos')} className="btn-ver-mas">
            Ver más
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Inicio;
