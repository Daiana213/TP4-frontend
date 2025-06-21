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

        // Traer calendario, pilotos y equipos en paralelo
        const [carrerasData, pilotosData, equiposData] = await Promise.all([
          apiService.obtenerCalendario(),
          apiService.obtenerPilotos(),
          apiService.obtenerEquipos()
        ]);

        setCarreras(carrerasData);
        // Ordenar y tomar top 3 pilotos por puntos descendente (podio)
        const pilotosTop = [...pilotosData].sort((a, b) => b.Puntos - a.Puntos).slice(0, 3);
        setPilotos(pilotosTop);

        // Ordenar y tomar top 3 equipos por puntos descendente (podio)
        const equiposTop = [...equiposData].sort((a, b) => b.Puntos - a.Puntos).slice(0, 3);
        setEquipos(equiposTop);

      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Filtrar próximas carreras
  const hoy = new Date();
  const proximasCarreras = carreras
    .filter((carrera) => new Date(carrera.fecha) > hoy)
    .slice(0, 2);

  if (loading) return <div className="cargando"><span className="spinner"></span> Cargando datos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inicio-container">
      <Header />
      <main className="inicio-main">
        <div className="welcome-section">
          <h1 className="titulo">Hola, {currentUser?.nombre || 'Usuario'}</h1>
          <p className="subtitle">Tu diario personal de Fórmula 1</p>
        </div>

        <div className="main-content-grid">
          <div className="column">
            <section className="dashboard-card calendario-card">
              <div className="card-header">
                <h2>Calendario F1</h2>
              </div>
              <div className="card-content">
                {proximasCarreras.length === 0 ? (
                  <p className="no-data">No hay carreras próximas disponibles.</p>
                ) : (
                  <div className="carreras-lista">
                    {proximasCarreras.map((carrera, index) => (
                      <div key={carrera.id} className="carrera-item">
                        <div className="carrera-header">
                          <span className="carrera-round">Ronda {carrera.ronda}</span>
                          <span className="carrera-date">{formatearFecha(carrera.fecha)}</span>
                        </div>
                        <h3 className="carrera-name">{carrera.nombre}</h3>
                        <div className="carrera-details">
                          <span className="carrera-country">{carrera.pais}</span>
                          <span className="carrera-circuit">{carrera.circuito}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="column">
            <section className="dashboard-card pilotos-card">
              <div className="card-header">
                <h2>Podio Pilotos</h2>
              </div>
              <div className="card-content">
                {pilotos.length === 0 ? (
                  <p className="no-data">No hay datos de pilotos.</p>
                ) : (
                  <div className="ranking-list">
                    {pilotos.map((piloto, index) => (
                      <div key={piloto.id} className="ranking-item">
                        <div className="ranking-position">
                          <span className="position-number">{index + 1}</span>
                        </div>
                        <div className="ranking-info">
                          <h3 className="ranking-name">{piloto.Nombre}</h3>
                          <p className="ranking-team">{piloto.Equipo?.Nombre || 'Sin equipo'}</p>
                        </div>
                        <div className="ranking-points">
                          <span className="points-number">{piloto.Puntos}</span>
                          <span className="points-label">pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="column">
            <section className="dashboard-card equipos-card">
              <div className="card-header">
                <h2>Podio Equipos</h2>
              </div>
              <div className="card-content">
                {equipos.length === 0 ? (
                  <p className="no-data">No hay datos de equipos.</p>
                ) : (
                  <div className="ranking-list">
                    {equipos.map((equipo, index) => (
                      <div key={equipo.id} className="ranking-item">
                        <div className="ranking-position">
                          <span className="position-number">{index + 1}</span>
                        </div>
                        <div className="ranking-info">
                          <h3 className="ranking-name">{equipo.Nombre}</h3>
                          <p className="ranking-country">{equipo.Pais}</p>
                        </div>
                        <div className="ranking-points">
                          <span className="points-number">{equipo.Puntos}</span>
                          <span className="points-label">pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="actions-section">
          <button
            onClick={() => navigate('/puestos')}
            className="btn-ver-mas"
          >
            Ver Clasificación Completa
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Inicio;
