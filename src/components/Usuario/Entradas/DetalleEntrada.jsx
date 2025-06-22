import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import './DetalleEntrada.css';
import { apiService } from '../../../../config/api';

const DetalleEntrada = () => {
  const { id } = useParams();
  const [entrada, setEntrada] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntrada = async () => {
      try {
        const data = await apiService.obtenerEntradaPorId(id);
        setEntrada(Array.isArray(data) ? data[0] : data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchEntrada();
  }, [id]);

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás segura/o de eliminar esta entrada?')) return;
    try {
      await apiService.eliminarEntradaUsuario(id);
      navigate('/entradas');
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStandingsTable = (standings, title, type) => {
    if (!standings || !Array.isArray(standings)) {
      return (
        <div className="no-data">
          <p>No hay datos de {title.toLowerCase()} disponibles</p>
        </div>
      );
    }

    return (
      <div className="standings-section">
        <h3 className="standings-title">{title}</h3>
        <div className="standings-table-container">
          <table className="standings-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Piloto</th>
                <th>Equipo</th>
                <th>Tiempo</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {standings.slice(0, 10).map((result, index) => (
                <tr key={index} className={index < 3 ? 'podium' : ''}>
                  <td className="position">{index + 1}</td>
                  <td className="driver">{result.piloto || 'N/A'}</td>
                  <td className="team">{result.equipo || 'N/A'}</td>
                  <td className="time">{result.tiempo || 'N/A'}</td>
                  <td className="points">{result.puntos || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="detalle-entrada-container">
        <Header />
        <main className="detalle-content">
          <div className="loading-container">
            <p>Cargando entrada...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) return <p className="error-text">{error}</p>;
  if (!entrada) return <p className="loading-text">Entrada no encontrada</p>;

  return (
    <div className="detalle-entrada-container">
      <Header />
      <main className="detalle-content">
        {/* Columna Izquierda: Info GP */}
        <div className="columna-info-gp">
          <h2 className="titulo-gp">{entrada.Titulo}</h2>
          <span className="gran-premio">
            {entrada.GranPremio?.nombre || `Gran Premio #${entrada.GranPremioId}`}
          </span>
          <span className="fecha-gp">{formatDate(entrada.fechacreacion)}</span>
          <div className="info-section">
            <h3>Resumen General</h3>
            <p>{entrada.resumengeneral || 'No hay resumen disponible'}</p>
          </div>
          <div className="info-section">
            <h3>Notas Personales</h3>
            <p>{entrada.notaspersonales || 'No hay notas personales'}</p>
          </div>
        </div>

        {/* Columna Central: Resultados */}
        <div className="columna-resultados">
          <h3>Resultados del Gran Premio</h3>
          {renderStandingsTable(entrada.Clasificacion?.standings, 'Clasificación', 'clasificacion')}
          {renderStandingsTable(entrada.Sprint?.standings, 'Sprint', 'sprint')}
          {renderStandingsTable(entrada.Carrera?.standings, 'Carrera', 'carrera')}
        </div>

        {/* Columna Derecha: Acciones */}
        <div className="columna-acciones">
          <button className="btn editar" onClick={() => navigate(`/editarentrada/${entrada.id || id}`)}>
            Editar Entrada
          </button>
          <button className="btn eliminar" onClick={handleEliminar}>
            Eliminar Entrada
          </button>
          <button className="btn volver" onClick={() => navigate('/entradas')}>
            Volver al Listado
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DetalleEntrada;