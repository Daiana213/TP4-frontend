import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // <-- Importamos useNavigate para redirigir
import './Inicio.css';

function Inicio() {
  const [carreras, setCarreras] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
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
        // Ordenar y tomar top 3 pilotos por puntos descendente
        const pilotosTop = [...pilotosData].sort((a, b) => b.Puntos - a.Puntos).slice(0, 3);
        setPilotos(pilotosTop);

        // Ordenar y tomar top 3 equipos por puntos descendente
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

  // Filtrar próximas dos carreras
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
        <h1 className="titulo">Hola, {user?.nombre || 'Usuario'}</h1>

        <section className="calendario">
          <h2>Próximas Carreras</h2>
          {proximasCarreras.length === 0 ? (
            <p>No hay carreras próximas disponibles.</p>
          ) : (
            <div className="carreras-lista">
              {proximasCarreras.map((carrera) => (
                <div key={carrera.id} className="carrera-card">
                  <h3>Ronda {carrera.ronda} - {carrera.nombre}</h3>
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
            <ul>
              {pilotos.map((piloto) => (
                <li key={piloto.id}>{piloto.Nombre} - {piloto.Puntos} pts</li>
              ))}
            </ul>
          )}

          <h2>Top 3 Equipos</h2>
          {equipos.length === 0 ? (
            <p>No hay datos de equipos.</p>
          ) : (
            <ul>
              {equipos.map((equipo) => (
                <li key={equipo.id}>{equipo.Nombre} - {equipo.Puntos} pts</li>
              ))}
            </ul>
          )}

          <button
            onClick={() => navigate('/puestos')} // Cambia esta ruta según donde tengas el componente Puestos
            className="btn-ver-mas"
          >
            Ver más
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Inicio;
