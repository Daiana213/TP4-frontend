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

        const [carrerasData, pilotosData, equiposData] = await Promise.all([
          apiService.obtenerCalendario(),
          apiService.obtenerPilotos(),
          apiService.obtenerEquipos()
        ]);

        setCarreras(carrerasData);
        const pilotosTop = [...pilotosData].sort((a, b) => b.Puntos - a.Puntos).slice(0, 3);
        setPilotos(pilotosTop);
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

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const hoy = new Date();
  const proximasCarreras = carreras
    .filter((carrera) => new Date(carrera.fecha) > hoy)
    .slice(0, 2);

  if (loading) return <div className="cargando"><span className="spinner"></span> Cargando datos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inicio-container">
      <Header />
      <main>
        <div>
          <h1 className="titulo">Hola, {currentUser?.nombre || 'Usuario'}</h1>

          <section className="calendario">
            <h2>Próximas Carreras</h2>
            {proximasCarreras.length === 0 ? (
              <p>No hay carreras próximas disponibles.</p>
            ) : (
              <div className="carreras-lista">
                {proximasCarreras.map((carrera) => (
                  <div key={carrera.id} className="carrera-card">
                    <h3>Ronda {carrera.id} - {carrera.nombre}</h3>
                    <p><strong>Fecha:</strong> {formatearFecha(carrera.fecha)}</p>
                    <p><strong>País:</strong> {carrera.pais}</p>
                    <p><strong>Circuito:</strong> {carrera.circuito}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="ranking">
            <h2>Top 3 Pilotos</h2>
            {pilotos.length === 0 ? (
              <p>No hay datos de pilotos.</p>
            ) : (
              pilotos.map((piloto) => (
                <div key={piloto.id} className="ranking-card">
                  <span className="nombre">{piloto.Nombre}</span>
                  <span className="puntos">{piloto.Puntos} pts</span>
                </div>
              ))
            )}

            <h2>Top 3 Equipos</h2>
            {equipos.length === 0 ? (
              <p>No hay datos de equipos.</p>
            ) : (
              equipos.map((equipo) => (
                <div key={equipo.id} className="ranking-card">
                  <span className="nombre">{equipo.Nombre}</span>
                  <span className="puntos">{equipo.Puntos} pts</span>
                </div>
              ))
            )}

            <button
              onClick={() => navigate('/puestos')}
              className="btn-ver-mas"
            >
              Ver más
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Inicio;
