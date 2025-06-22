import React, { useState, useEffect } from 'react';
import { apiService } from '../../../../config/api';
import AdminHeader from '../Header/AdminHeader';
import './AdminEquipos.css';

const AdminEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    pais: '',
    puntos: '',
    podios: '',
    carreras: '',
    wins: '',
    team_chief: '',
    technical_chief: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    try {
      const data = await apiService.obtenerEquipos();
      setEquipos(data);
      setLoading(false);
    } catch (err) {
      setError(`Error al cargar los equipos: ${err.message}`);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      pais: '',
      puntos: '',
      podios: '',
      carreras: '',
      wins: '',
      team_chief: '',
      technical_chief: ''
    });
    setEditMode(false);
    setCurrentId(null);
    setError(null);
  };

  const validateForm = () => {
    if (!formData.nombre.trim() || !formData.pais.trim()) {
      setError('Por favor, completa todos los campos requeridos');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submissionData = {
      Nombre: formData.nombre,
      Pais: formData.pais,
      Puntos: Number(formData.puntos) || 0,
      Podios: Number(formData.podios) || 0,
      Carreras: Number(formData.carreras) || 0,
      Wins: Number(formData.wins) || 0,
      Team_chief: formData.team_chief,
      Technical_chief: formData.technical_chief
    };
    
    try {
      if (editMode) {
        await apiService.actualizarEquipo(currentId, submissionData);
      } else {
        await apiService.crearEquipo(submissionData);
      }
      
      await fetchEquipos();
      resetForm();
    } catch (err) {
      console.error('Error en operación de equipo:', err);
      setError(`Error al ${editMode ? 'actualizar' : 'crear'} equipo: ${err.message}`);
    }
  };

  const handleEdit = (equipo) => {
    setFormData({
      nombre: equipo.Nombre,
      pais: equipo.Pais,
      puntos: equipo.Puntos || '',
      podios: equipo.Podios || '',
      carreras: equipo.Carreras || '',
      wins: equipo.Wins || '',
      team_chief: equipo.Team_chief || '',
      technical_chief: equipo.Technical_chief || ''
    });
    setEditMode(true);
    setCurrentId(equipo.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este equipo?')) return;
    try {
      await apiService.eliminarEquipo(id);
      await fetchEquipos();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <AdminHeader />
        <div className="loading">Cargando equipos...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminHeader />
      <main>
        <h1 className="titulo">Gestión de Equipos</h1>
        
        <section className="admin-content">
          <div className="admin-form-container">
            <h3>{editMode ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}</h3>
            
            {error && <p className="error">{error}</p>}
            
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Equipo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Mercedes"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pais">País</label>
                <input
                  type="text"
                  id="pais"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  placeholder="Ej: Alemania"
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
                <label htmlFor="carreras">Carreras</label>
                <input
                  type="number"
                  id="carreras"
                  name="carreras"
                  value={formData.carreras}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="wins">Victorias</label>
                <input
                  type="number"
                  id="wins"
                  name="wins"
                  value={formData.wins}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="team_chief">Jefe de Equipo</label>
                <input
                  type="text"
                  id="team_chief"
                  name="team_chief"
                  value={formData.team_chief}
                  onChange={handleChange}
                  placeholder="Ej: Toto Wolff"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="technical_chief">Director Técnico</label>
                <input
                  type="text"
                  id="technical_chief"
                  name="technical_chief"
                  value={formData.technical_chief}
                  onChange={handleChange}
                  placeholder="Ej: James Allison"
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
            <h3>Equipos Registrados ({equipos.length} equipos)</h3>
            
            <div className="admin-list">
              {equipos.length === 0 ? (
                <p className="no-data">No hay equipos registrados en el sistema</p>
              ) : (
                equipos.map((equipo) => (
                  <div key={equipo.id} className="admin-item admin-equipo-item">
                    <div className="admin-item-info">
                      <p>
                        <strong>{equipo.Nombre}</strong>
                      </p>
                      <div className="equipo-info">
                        <span className="equipo-pais">{equipo.Pais}</span>
                      </div>
                      <div className="equipo-stats">
                        <span className="equipo-stat puntos">{equipo.Puntos} Puntos</span>
                        <span className="equipo-stat podios">{equipo.Podios} Podios</span>
                        <span className="equipo-stat carreras">{equipo.Carreras} Carreras</span>
                        <span className="equipo-stat victorias">{equipo.Wins} Victorias</span>
                      </div>
                      <div className="staff-info">
                        <strong>Jefe de equipo:</strong> {equipo.Team_chief || 'No especificado'}
                      </div>
                      <div className="staff-info">
                        <strong>Director técnico:</strong> {equipo.Technical_chief || 'No especificado'}
                      </div>
                    </div>
                    <div className="admin-item-actions">
                      <button className="edit-btn" onClick={() => handleEdit(equipo)}>
                        Editar
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(equipo.id)}>
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

export default AdminEquipos;