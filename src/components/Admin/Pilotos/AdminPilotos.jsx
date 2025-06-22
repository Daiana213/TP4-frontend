import React, { useState, useEffect } from 'react';
import { apiService } from '../../../../config/api';
import AdminHeader from '../Header/AdminHeader';
import './AdminPilotos.css';

const AdminPilotos = () => {
  // ===== ESTADOS =====
  const [pilotos, setPilotos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    numero: '',
    equipoId: '',
    pais: '',
    puntos: '',
    campeonatos: '',
    podios: '',
    victorias: '',
    totalCarreras: '',
    fechaNacimiento: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loadingPilotos, setLoadingPilotos] = useState(true);
  const [loadingEquipos, setLoadingEquipos] = useState(true);
  const [error, setError] = useState(null);

  // ===== EFECTOS =====
  useEffect(() => {
    fetchPilotos();
    fetchEquipos();
  }, []);

  // ===== FUNCIONES DE DATOS =====
  const fetchPilotos = async () => {
    setLoadingPilotos(true);
    try {
      const data = await apiService.obtenerPilotos();
      setPilotos(data);
      setLoadingPilotos(false);
    } catch (err) {
      console.error('Error al cargar pilotos:', err);
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
      console.error('Error al cargar equipos:', err);
      setError(`Error al cargar los equipos: ${err.message}`);
      setLoadingEquipos(false);
    }
  };

  // ===== FUNCIONES DE FORMULARIO =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      totalCarreras: '',
      fechaNacimiento: ''
    });
    setEditMode(false);
    setCurrentId(null);
    setError(null);
  };

  // ===== VALIDACIONES =====
  const validateForm = () => {
    // Validación de campos requeridos
    if (!formData.nombre.trim() || !formData.numero || !formData.equipoId) {
      setError('Por favor, completa todos los campos requeridos');
      return false;
    }
    
    // Validación de número de piloto
    if (formData.numero < 1 || formData.numero > 99) {
      setError('El número de piloto debe estar entre 1 y 99');
      return false;
    }

    return true;
  };

  // ===== MANEJADORES DE EVENTOS =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submissionData = {
      Nombre: formData.nombre,
      Numero: Number(formData.numero),
      EquipoId: Number(formData.equipoId),
      Pais: formData.pais,
      Puntos: Number(formData.puntos) || 0,
      Campeonatos: Number(formData.campeonatos) || 0,
      Podios: Number(formData.podios) || 0,
      Wins: Number(formData.victorias) || 0,
      TotalCarreras: Number(formData.totalCarreras) || 0,
      fechaNacimiento: formData.fechaNacimiento
    };
    
    try {
      if (editMode) {
        await apiService.actualizarPiloto(currentId, submissionData);
      } else {
        await apiService.crearPiloto(submissionData);
      }
      
      await fetchPilotos();
      resetForm();
    } catch (err) {
      console.error('Error en operación de piloto:', err);
      setError(`Error al ${editMode ? 'actualizar' : 'crear'} piloto: ${err.message}`);
    }
  };

  const handleEdit = (piloto) => {
    setFormData({
      nombre: piloto.Nombre,
      numero: piloto.Numero,
      equipoId: piloto.EquipoId,
      pais: piloto.Pais,
      puntos: piloto.Puntos,
      campeonatos: piloto.Campeonatos,
      podios: piloto.Podios,
      victorias: piloto.Wins,
      totalCarreras: piloto.TotalCarreras,
      fechaNacimiento: piloto.fechaNacimiento
    });
    setEditMode(true);
    setCurrentId(piloto.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este piloto?')) return;
    
    try {
      await apiService.eliminarPiloto(id);
      await fetchPilotos();
      setError(null);
    } catch (err) {
      setError(`Error al eliminar piloto: ${err.message}`);
    }
  };

  // ===== FUNCIONES UTILITARIAS =====
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // ===== RENDERIZADO =====
  if (loadingPilotos || loadingEquipos) {
    return (
      <div className="admin-container">
        <AdminHeader />
        <div className="loading">Cargando pilotos...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminHeader />
      <main>
        <h1 className="titulo">Gestión de Pilotos</h1>
        
        <section className="admin-content">
          {/* ===== FORMULARIO ===== */}
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
                  placeholder="44"
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
                  <option value="">Selecciona un equipo</option>
                  {equipos.map(equipo => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.Nombre}
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
                <label htmlFor="puntos">Puntos</label>
                <input
                  type="number"
                  id="puntos"
                  name="puntos"
                  value={formData.puntos}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="campeonatos">Campeonatos</label>
                <input
                  type="number"
                  id="campeonatos"
                  name="campeonatos"
                  value={formData.campeonatos}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
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
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="totalCarreras">Total de Carreras</label>
                <input
                  type="number"
                  id="totalCarreras"
                  name="totalCarreras"
                  value={formData.totalCarreras}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
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

          {/* ===== LISTA DE PILOTOS ===== */}
          <div className="admin-list-container">
            <h3>Pilotos Registrados ({pilotos.length} pilotos)</h3>
            
            <div className="admin-list">
              {pilotos.length === 0 ? (
                <p className="no-data">No hay pilotos registrados en el sistema</p>
              ) : (
                pilotos.map((piloto) => (
                  <div key={piloto.id} className="admin-item admin-piloto-item">
                    <div className="admin-item-info">
                      <p>
                        <span className="piloto-numero">#{piloto.Numero}</span>
                        <strong>{piloto.Nombre}</strong>
                      </p>
                      <div className="piloto-info">
                        <span className="piloto-pais">{piloto.Pais}</span>
                        {piloto.Equipo && (
                          <span className="piloto-equipo">{piloto.Equipo.Nombre}</span>
                        )}
                      </div>
                      <div className="piloto-stats">
                        <span className="piloto-stat campeonatos">{piloto.Campeonatos} Campeonatos</span>
                        <span className="piloto-stat victorias">{piloto.Wins} Victorias</span>
                        <span className="piloto-stat podios">{piloto.Podios} Podios</span>
                        <span className="piloto-stat puntos">{piloto.Puntos} Puntos</span>
                        <span className="piloto-stat carreras">{piloto.TotalCarreras} Carreras</span>
                      </div>
                    </div>
                    <div className="admin-item-actions">
                      <button className="edit-btn" onClick={() => handleEdit(piloto)}>
                        Editar
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(piloto.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPilotos;