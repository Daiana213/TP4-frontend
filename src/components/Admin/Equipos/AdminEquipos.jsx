import React, { useState, useEffect } from 'react';
import { apiService } from '../../../../config/api';
import AdminHeader from '../AdminHeader';
import '../AdminList.css';

const AdminEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    pais: '',
    logo: '',
    colorPrimario: '#000000',
    colorSecundario: '#ffffff'
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
      setError('Error al cargar los equipos');
      setLoading(false);
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
    
    try {
      let response;
      
      if (editMode) {
        response = await apiService.actualizarEquipo(currentId, formData);
      } else {
        response = await apiService.crearEquipo(formData);
      }
      
      fetchEquipos();
      resetForm();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (equipo) => {
    setFormData({
      nombre: equipo.nombre,
      pais: equipo.pais,
      logo: equipo.logo,
      colorPrimario: equipo.colorPrimario || '#000000',
      colorSecundario: equipo.colorSecundario || '#ffffff'
    });
    setEditMode(true);
    setCurrentId(equipo.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este equipo?')) return;
    
    try {
      await apiService.eliminarEquipo(id);
      fetchEquipos();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      pais: '',
      logo: '',
      colorPrimario: '#000000',
      colorSecundario: '#ffffff'
    });
    setEditMode(false);
    setCurrentId(null);
  };

  if (loading) return <div className="loading">Cargando equipos...</div>;

  return (
    <div className="admin-container">
      <AdminHeader />
      <main>
        <h1 className="titulo">Gestión de Equipos</h1>
        
        <div className="admin-content">
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
                  placeholder="Ej: Mercedes-AMG Petronas"
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
                <label htmlFor="logo">URL del Logo</label>
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/logo.png"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="colorPrimario">Color Primario</label>
                <input
                  type="color"
                  id="colorPrimario"
                  name="colorPrimario"
                  value={formData.colorPrimario}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="colorSecundario">Color Secundario</label>
                <input
                  type="color"
                  id="colorSecundario"
                  name="colorSecundario"
                  value={formData.colorSecundario}
                  onChange={handleChange}
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
            <h3>Equipos Registrados ({equipos.length})</h3>
            <div className="admin-list">
              {equipos.length === 0 ? (
                <p>No hay equipos registrados en el sistema</p>
              ) : (
                equipos.map(equipo => (
                  <div key={equipo.id} className="admin-item">
                    <div className="admin-item-info">
                      <p>{equipo.nombre}</p>
                      <p><span className="equipo-nombre">País:</span> {equipo.pais}</p>
                      
                      {equipo.logo && (
                        <img 
                          src={equipo.logo} 
                          alt={`Logo de ${equipo.nombre}`} 
                          className="team-logo"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      
                      <div className="team-colors">
                        <div 
                          className="team-color" 
                          style={{ backgroundColor: equipo.colorPrimario || '#000' }}
                          title="Color Primario"
                        ></div>
                        <div 
                          className="team-color" 
                          style={{ backgroundColor: equipo.colorSecundario || '#fff' }}
                          title="Color Secundario"
                        ></div>
                      </div>
                    </div>
                    <div className="admin-item-actions">
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEdit(equipo)}
                      >
                        Editar
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(equipo.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEquipos;