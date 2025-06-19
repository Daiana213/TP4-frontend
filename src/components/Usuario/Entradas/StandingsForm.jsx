import React, { useState, useEffect } from 'react';
import './StandingsForm.css';
import { apiService } from '../../../../config/api';

const StandingsForm = ({ onStandingsChange, initialData = {} }) => {
  const [activeTab, setActiveTab] = useState('clasificacion');
  const [standings, setStandings] = useState({
    clasificacion: initialData.clasificacion || [],
    sprint: initialData.sprint || [],
    carrera: initialData.carrera || []
  });
  const [pilotos, setPilotos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const puntosClasificacion = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const puntosSprint = [8, 7, 6, 5, 4, 3, 2, 1];
  const puntosCarrera = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

  // Cargar pilotos desde el backend
  useEffect(() => {
    const fetchPilotos = async () => {
      try {
        setLoading(true);

        const data = await apiService.obtenerPilotos();
        setPilotos(data);
      } catch (err) {
        setError(err.message);
        console.error('Error cargando pilotos:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEquipos = async () => {
      try {
        const data = await apiService.obtenerEquipos();
        setEquipos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPilotos();
    fetchEquipos();
  }, []);


  const handlePositionChange = (type, position, field, value) => {
    const newStandings = [...standings[type]];
    
    if (!newStandings[position]) {
      newStandings[position] = {};
    }
    
    newStandings[position][field] = value;
    
    const updatedStandings = {
      ...standings,
      [type]: newStandings
    };
    
    setStandings(updatedStandings);
    onStandingsChange(updatedStandings);
  };

  const handlePilotoSelect = (type, position, pilotoId) => {
    const piloto = pilotos.find(p => p.id === parseInt(pilotoId));
    if (piloto) {
      handlePositionChange(type, position, 'piloto', piloto.Nombre);
      handlePositionChange(type, position, 'equipo', piloto.Equipo?.Nombre || 'Sin equipo');
      handlePositionChange(type, position, 'pilotoId', piloto.id);
      // Guardar los puntos según la posición
      const puntos = getPuntos(type, position);
      handlePositionChange(type, position, 'puntos', puntos);
    }
  };

  const getPuntos = (type, position) => {
    if (type === 'clasificacion') return 0; // La clasificación no otorga puntos
    const puntosArray = type === 'sprint' ? puntosSprint : puntosCarrera;
    return position < puntosArray.length ? puntosArray[position] : 0;
  };

  const renderStandingsTable = (type) => {
    const maxPositions = type === 'sprint' ? 8 : 10;
    const rows = [];

    for (let i = 0; i < maxPositions; i++) {
      const currentData = standings[type][i] || {};
      const puntos = getPuntos(type, i);

      rows.push(
        <tr key={i} className={i < 3 ? 'podium-row' : ''}>
          <td className="position">{i + 1}</td>
          <td>
            <select
              value={currentData.pilotoId || ''}
              onChange={(e) => handlePilotoSelect(type, i, e.target.value)}
              className="piloto-select"
              disabled={loading}
            >
              <option value="">Seleccionar piloto</option>
              {pilotos.map(piloto => (
                <option key={piloto.id} value={piloto.id}>
                  {piloto.Nombre} - {piloto.Equipo?.Nombre || 'Sin equipo'}
                </option>
              ))}
            </select>
          </td>
          <td>
            <input
              type="text"
              placeholder="Tiempo (ej: 1:23.456)"
              value={currentData.tiempo || ''}
              onChange={(e) => handlePositionChange(type, i, 'tiempo', e.target.value)}
              className="time-input"
            />
          </td>
          <td className="points">{puntos}</td>
        </tr>
      );
    }

    return rows;
  };

  if (loading) {
    return (
      <div className="standings-form">
        <h3>Datos de Puestos</h3>
        <div className="loading-message">
          <p>Cargando pilotos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="standings-form">
        <h3>Datos de Puestos</h3>
        <div className="error-message">
          <p>Error al cargar pilotos: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="standings-form">
      <h3>Datos de Puestos del Gran Premio</h3>
      
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'clasificacion' ? 'active' : ''}`}
          onClick={() => setActiveTab('clasificacion')}
        >
          Clasificación
        </button>
        <button
          className={`tab ${activeTab === 'sprint' ? 'active' : ''}`}
          onClick={() => setActiveTab('sprint')}
        >
          Sprint
        </button>
        <button
          className={`tab ${activeTab === 'carrera' ? 'active' : ''}`}
          onClick={() => setActiveTab('carrera')}
        >
          Carrera
        </button>
      </div>

      <div className="tab-content">
        <div className="standings-table-container">
          <table className="standings-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Piloto</th>
                <th>Tiempo</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {renderStandingsTable(activeTab)}
            </tbody>
          </table>
        </div>

        <div className="standings-info">
          <div className="info-card">
            <h4>Información de Puntos</h4>
            <ul>
              <li><strong>Clasificación:</strong> No otorga puntos, solo determina el orden de salida</li>
              <li><strong>Sprint:</strong> 8-7-6-5-4-3-2-1 puntos para los primeros 8</li>
              <li><strong>Carrera:</strong> 25-18-15-12-10-8-6-4-2-1 puntos para los primeros 10</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h4>Instrucciones</h4>
            <ul>
              <li>Selecciona el piloto para cada posición</li>
              <li>Ingresa el tiempo de vuelta (opcional)</li>
              <li>Los puntos se calculan automáticamente</li>
              <li>Puedes dejar posiciones vacías si no tienes todos los datos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsForm;