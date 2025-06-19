import React, { useState, useEffect } from 'react';
import './StandingsForm.css';
import { apiService } from '../../../../config/api';

export default function StandingsForm({ onStandingsChange, initialData = {}, mostrarSprint = true }) {
  const [activeTab, setActiveTab] = useState('clasificacion');
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

  // Inicializa standings al montar
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

  // Carga pilotos
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

  const getPuntos = (type, pos) => {
    if (type === 'clasificacion') return 0;
    const arr = type === 'sprint' ? puntosSprint : puntosCarrera;
    return arr[pos] || 0;
  };

  const notifyChange = (updated) => {
    if (onStandingsChange && typeof onStandingsChange === 'function') {
      onStandingsChange(updated);
    }
  };

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

  const handlePilotoSelect = (type, idx, pilotoId) => {
    const piloto = pilotos.find(p => p.id === +pilotoId);
    if (!piloto) {
      handlePositionChange(type, idx, 'piloto', '');
      handlePositionChange(type, idx, 'equipo', '');
      handlePositionChange(type, idx, 'pilotoId', '');
      handlePositionChange(type, idx, 'puntos', 0);
      return;
    }

    const selected = standings[type].map(s => s?.pilotoId).filter(Boolean);
    if (selected.includes(piloto.id)) {
      alert('Piloto ya seleccionado');
      return;
    }

    handlePositionChange(type, idx, 'piloto', piloto.Nombre);
    handlePositionChange(type, idx, 'equipo', piloto.Equipo?.Nombre || 'Sin equipo');
    handlePositionChange(type, idx, 'pilotoId', piloto.id);
    handlePositionChange(type, idx, 'puntos', getPuntos(type, idx));
  };

  const renderRows = type => {
    if (type === 'sprint' && !mostrarSprint) return null;
    const max = type === 'sprint' ? 8 : 10;
    return Array.from({ length: max }, (_, idx) => {
      const cur = standings[type][idx] || {};
      return (
        <tr key={idx} className={idx < 3 ? 'podium-row' : ''}>
          <td className="position">{idx + 1}</td>
          <td>
            <select
              value={cur.pilotoId || ''}
              disabled={loading}
              onChange={e => handlePilotoSelect(type, idx, e.target.value)}
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
            />
          </td>
          <td className="points">{cur.puntos || 0}</td>
        </tr>
      );
    });
  };

  if (loading) return <div>Cargando pilotos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="standings-form">
     <div className="tabs">
  <button
    type="button" // 👈 AGREGAR ESTO
    className={activeTab === 'clasificacion' ? 'active' : ''}
    onClick={() => setActiveTab('clasificacion')}
  >
    Clasificación
  </button>

  {mostrarSprint && (
    <button
      type="button" // 👈 AGREGAR ESTO
      className={activeTab === 'sprint' ? 'active' : ''}
      onClick={() => setActiveTab('sprint')}
    >
      Sprint
    </button>
  )}

  <button
    type="button" // 👈 AGREGAR ESTO
    className={activeTab === 'carrera' ? 'active' : ''}
    onClick={() => setActiveTab('carrera')}
  >
    Carrera
  </button>
</div>

      <table className="standings-table">
        <thead><tr><th>Pos</th><th>Piloto</th><th>Tiempo</th><th>Puntos</th></tr></thead>
        <tbody>{renderRows(activeTab)}</tbody>
      </table>
    </div>
  );
}
