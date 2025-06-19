import React, { useState, useEffect } from 'react';
import { apiService } from '../../../../config/api';
import AdminHeader from '../AdminHeader';
import '../AdminList.css';

const AdminPilotos = () => {
  const [pilotos, setPilotos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    numero: '',
    equipoId: '',
    pais: '',
    puntos: '',
    campeonatos: '',
    podios: '',
    victorias: '',
    fechaNacimiento: ''
  });
  const [equipos, setEquipos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loadingPilotos, setLoadingPilotos] = useState(true);
  const [loadingEquipos, setLoadingEquipos] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPilotos();
    fetchEquipos();
  }, []);

  const fetchPilotos = async () => {
    setLoadingPilotos(true);
    try {
      const data = await apiService.obtenerPilotos();
      setPilotos(data);
      setLoadingPilotos(false);
    } catch (err) {
      setError(`Error al cargar los pilotos: ${err.message}`);
      setLoadingPilotos(false);
    }
  };

  const fetchEquipos = async () => {
    setLoadingEquipos(true);
    try {
      const data = await apiService.obtenerEquipos();
      setEquipos(data);
      setLoadingEquipos(false);
    } catch (err) {
      setError(`Error al cargar los equipos: ${err.message}`);
      setLoadingEquipos(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure numerical fields are properly converted
    const submissionData = {
      ...formData,
      numero: Number(formData.numero),
      equipoId: Number(formData.equipoId),
      puntos: Number(formData.puntos),
      campeonatos: Number(formData.campeonatos),
      podios: Number(formData.podios),
      victorias: Number(formData.victorias)
    };
    
    try {
      if (editMode) {
        await apiService.actualizarPiloto(currentId, submissionData);
      } else {
        await apiService.crearPiloto(submissionData);
      }
      
      fetchPilotos();
      resetForm();
      setError(null); // Clear any previous errors on success
    } catch (err) {
      setError(`Error al ${editMode ? 'actualizar' : 'crear'} piloto: ${err.message}`);
    }
  };

  const handleEdit = (piloto) => {
    setFormData({
      nombre: piloto.nombre,
      numero: piloto.numero,
      equipoId: piloto.equipoId,
      pais: piloto.pais,
      puntos: piloto.puntos,
      campeonatos: piloto.campeonatos,
      podios: piloto.podios,
      victorias: piloto.victorias,
      fechaNacimiento: piloto.fechaNacimiento
    });
    setEditMode(true);
    setCurrentId(piloto.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este piloto?')) return;
    
    try {
      await apiService.eliminarPiloto(id);
      fetchPilotos();
      setError(null); // Clear any previous errors on success
    } catch (err) {
      setError(`Error al eliminar piloto: ${err.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      numero: '',
      equipoId: '',
      pais: '',
      puntos: '',
      campeonatos: '',
      podios: '',
      victorias: '',
      fechaNacimiento: ''
    });
    setEditMode(false);
    setCurrentId(null);
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

  if (loadingPilotos || loadingEquipos) return <div className="loading">Cargando pilotos...</div>;

  return (
    <div className="admin-container">
      <AdminHeader />
      <main>
        <h1 className="titulo">Gestión de Pilotos</h1>
        
        <div className="admin-content">
          <div className="admin-form-container">
            <h3>{editMode ? 'Editar Piloto' : 'Agregar Nuevo Piloto'}</h3>
            {error && <p className="error">{error}</p>}
            
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Lewis Hamilton"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="numero">Número de Piloto</label>
                <input
                  type="number"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="Ej: 44"
                  min="1"
                  max="99"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="equipoId">Equipo</label>
                <select
                  id="equipoId"
                  name="equipoId"
                  value={formData.equipoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar equipo</option>
                  {equipos.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pais">País</label>
                <input
                  type="text"
                  id="pais"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  placeholder="Ej: Reino Unido"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="puntos">Puntos Totales</label>
                <input
                  type="number"
                  id="puntos"
                  name="puntos"
                  value={formData.puntos}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="campeonatos">Campeonatos Mundiales</label>
                <input
                  type="number"
                  id="campeonatos"
                  name="campeonatos"
                  value={formData.campeonatos}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="podios">Podios</label>
                <input
                  type="number"
                  id="podios"
                  name="podios"
                  value={formData.podios}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">  
                <label htmlFor="victorias">Victorias</label>
                <input
                  type="number"
                  id="victorias"
                  name="victorias"
                  value={formData.victorias}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editMode ? 'Actualizar' : 'Guardar'}
                </button>
                {editMode && (
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="admin-list-container">
            <h3>🏁 Pilotos Registrados ({pilotos.length})</h3>
            <div className="admin-list">
              {pilotos.length === 0 ? (
                <p>No hay pilotos registrados en el sistema</p>
              ) : (
                pilotos.map(piloto => {
                  const equipo = equipos.find(e => Number(e.id) === Number(piloto.equipoId));
                  return (
                    <div key={piloto.id} className="admin-item">
                      <div className="admin-item-info">
                        <p>#{piloto.numero} - {piloto.nombre}</p>
                        <p><span className="equipo-nombre">Equipo:</span> {equipo?.nombre || 'No asignado'}</p>
                        <p><span className="equipo-nombre">País:</span> {piloto.pais}</p>
                        <p><span className="equipo-nombre">Nacimiento:</span> {formatDate(piloto.fechaNacimiento)}</p>
                        
                        <div className="stats">
                          <span className="stat">{piloto.campeonatos} Campeonatos</span>
                          <span className="stat">{piloto.victorias} Victorias</span>
                          <span className="stat">{piloto.podios} Podios</span>
                          <span className="stat">{piloto.puntos} Puntos</span>
                        </div>
                      </div>
                      <div className="admin-item-actions">
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEdit(piloto)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDelete(piloto.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPilotos;