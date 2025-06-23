import React, { useState, useEffect } from 'react';
import './StandingsForm.css';
import { apiService } from '../../../../config/api';

export default function StandingsForm({ onStandingsChange, initialData = {}, mostrarSprint = true }) {
  const [activeTab, setActiveTab] = useState('carrera');
  const [standings, setStandings] = useState({
    clasificacion: [],
    sprint: [],
    carrera: []
  });
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const puntosSprint = [8, 7, 6, 5, 4, 3, 2, 1];
  const puntosCarrera = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

  // Parsear y setear standings al montar o al cambiar initialData
  useEffect(() => {
    const parseStandings = (data) => {
      if (!data) return [];
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch {
          return [];
        }
      }
      return data;
    };
    setStandings({
      clasificacion: parseStandings(initialData.clasificacion),
      sprint: parseStandings(initialData.sprint),
      carrera: parseStandings(initialData.carrera)
    });
  }, [initialData]);

  // Cargar pilotos junto con sus equipos
  useEffect(() => {
    const cargarPilotos = async () => {
      try {
        const pilotosData = await apiService.obtenerPilotos();
        setPilotos(pilotosData || []);
      } catch (err) {
        setError(err.message || 'Error al cargar pilotos');
      } finally {
        setLoading(false);
      }
    };
    cargarPilotos();
  }, []);

  // Función para asignar puntos según tipo y posición
  const getPuntos = (type, pos) => {
    if (type === 'clasificacion') return 0;
    const arr = type === 'sprint' ? puntosSprint : puntosCarrera;
    return arr[pos] || 0;
  };

  // Notificar cambios hacia afuera (padre)
  const notifyChange = (updated) => {
    if (onStandingsChange && typeof onStandingsChange === 'function') {
      onStandingsChange(updated);
    }
  };

  // Actualizar posición, piloto, equipo, puntos, etc.
  const handlePositionChange = (type, idx, field, value) => {
    setStandings(prev => {
      const updated = { ...prev };
      const list = [...(updated[type] || [])];
      list[idx] = { ...list[idx], [field]: value };
      updated[type] = list;
      notifyChange(updated);
      return updated;
    });
  };

  // Manejar selección de piloto, asignando también equipo y puntos
  const handlePilotoSelect = (type, idx, pilotoId) => {
    const piloto = pilotos.find(p => p.id === +pilotoId);
    if (!piloto) {
      // Si no hay piloto seleccionado, limpiar la fila
      handlePositionChange(type, idx, 'piloto', '');
      handlePositionChange(type, idx, 'equipo', '');
      handlePositionChange(type, idx, 'pilotoId', '');
      handlePositionChange(type, idx, 'puntos', 0);
      return;
    }

    // Evitar duplicados en la misma lista
    const selectedIds = standings[type].map(s => s?.pilotoId).filter(Boolean);
    if (selectedIds.includes(piloto.id)) {
      alert('Piloto ya seleccionado en esta lista');
      return;
    }

    // Calcular puntos automáticamente
    const puntos = getPuntos(type, idx);

    handlePositionChange(type, idx, 'piloto', piloto.Nombre);
    handlePositionChange(type, idx, 'equipo', piloto.Equipo?.Nombre || 'Sin equipo');
    handlePositionChange(type, idx, 'pilotoId', piloto.id);
    handlePositionChange(type, idx, 'puntos', puntos);
  };

  // Renderizar filas por tipo (clasificación, sprint, carrera)
  const renderRows = (type) => {
    if (type === 'sprint' && !mostrarSprint) return null;
    const max = type === 'sprint' ? 8 : 10;
    
    return Array.from({ length: max }, (_, idx) => {
      const cur = standings[type][idx] || {};
      const puntosAsignados = cur.puntos !== undefined ? cur.puntos : getPuntos(type, idx);
      
      return (
        <tr key={idx} className={idx < 3 ? 'podium-row' : ''}>
          <td className="position">{idx + 1}</td>
          <td>
            <select
              value={cur.pilotoId || ''}
              disabled={loading}
              onChange={e => handlePilotoSelect(type, idx, e.target.value)}
              className="piloto-select"
            >
              <option value="">Seleccionar piloto</option>
              {pilotos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.Nombre} - {p.Equipo?.Nombre || 'Sin equipo'}
                </option>
              ))}
            </select>
          </td>
          <td>
            <input
              type="text"
              placeholder="Tiempo"
              value={cur.tiempo || ''}
              onChange={e => handlePositionChange(type, idx, 'tiempo', e.target.value)}
              className="time-input"
            />
          </td>
          <td className="points">
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: puntosAsignados > 0 ? '#007bff' : '#f8f9fa',
              color: puntosAsignados > 0 ? 'white' : '#6c757d',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '14px',
              minWidth: '40px',
              textAlign: 'center',
              border: puntosAsignados === 0 ? '1px solid #dee2e6' : 'none',
              boxShadow: puntosAsignados > 0 ? '0 2px 4px rgba(0,123,255,0.3)' : 'none'
            }}>
              {puntosAsignados}
            </div>
          </td>
        </tr>
      );
    });
  };

  // Obtener información de puntos para mostrar
  const getPuntosInfo = () => {
    if (activeTab === 'clasificacion') {
      return "La clasificación no otorga puntos en F1";
    } else if (activeTab === 'sprint') {
      return "Puntos Sprint: 8-7-6-5-4-3-2-1 (top 8)";
    } else {
      return "Puntos Carrera: 25-18-15-12-10-8-6-4-2-1 (top 10)";
    }
  };

  if (loading) return <div className="loading">Cargando pilotos...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="standings-form">
      <div className="tabs">
        <button
          type="button"
          className={"btn ${activeTab === 'clasificacion' ? 'active' : ''}"}
          onClick={() => setActiveTab('clasificacion')}
        >
          Clasificación
        </button>
        {mostrarSprint && (
          <button
            type="button"
            className={"btn ${activeTab === 'sprint' ? 'active' : ''}"}
            onClick={() => setActiveTab('sprint')}
          >
            Sprint
          </button>
        )}
        <button
          type="button"
          className={"btn {activeTab === 'carrera' ? 'active' : ''}"}
          onClick={() => setActiveTab('carrera')}
        >
          Carrera
        </button>
      </div>

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
          <tbody>{renderRows(activeTab)}</tbody>
        </table>
      </div>

      <div className="standings-info">
        <div className="info-card">
          <h4>Información de Puntos</h4>
          <p>{getPuntosInfo()}</p>
          {activeTab !== 'clasificacion' && (
            <ul>
              {activeTab === 'sprint' ? (
                puntosSprint.map((puntos, idx) => (
                  <li key={idx}>Posición {idx + 1}: {puntos} puntos</li>
                ))
              ) : (
                puntosCarrera.map((puntos, idx) => (
                  <li key={idx}>Posición {idx + 1}: {puntos} puntos</li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
