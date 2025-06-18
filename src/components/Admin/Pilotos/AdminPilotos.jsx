import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';

const AdminPilotos = () => {
  const [pilotos, setPilotos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    numero: '',
    equipoId: '',
    nacionalidad: '',
    fechaNacimiento: ''
  });
  const [equipos, setEquipos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPilotos();
    fetchEquipos();
  }, []);

  const fetchPilotos = async () => {
    try {
      const response = await fetch('/api/pilotos');
      if (!response.ok) throw new Error('Error al cargar pilotos');
      const data = await response.json();
      setPilotos(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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
      const url = editMode 
        ? `/api/pilotos/${currentId}` 
        : '/api/pilotos';
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al guardar piloto');
      
      fetchPilotos();
      
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (piloto) => {
    setFormData({
      nombre: piloto.nombre,
      apellido: piloto.apellido,
      numero: piloto.numero,
      equipoId: piloto.equipoId,
      nacionalidad: piloto.nacionalidad,
      fechaNacimiento: piloto.fechaNacimiento
    });
    setEditMode(true);
    setCurrentId(piloto.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este piloto?')) return;
    
    try {
      const response = await fetch(`/api/pilotos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar piloto');
      
      // Actualizar la lista de pilotos
      fetchPilotos();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      numero: '',
      equipoId: '',
      nacionalidad: '',
      fechaNacimiento: ''
    });
    setEditMode(false);
    setCurrentId(null);
  };

  if (loading) return <div className="loading">Cargando...</div>;

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
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="numero">Número</label>
                <input
                  type="number"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
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
                  {equipos.map(equipo => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="nacionalidad">Nacionalidad</label>
                <input
                  type="text"
                  id="nacionalidad"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
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
            <h3>Pilotos Actuales</h3>
            <div className="admin-list">
              {pilotos.length === 0 ? (
                <p>No hay pilotos registrados</p>
              ) : (
                pilotos.map(piloto => (
                  <div key={piloto.id} className="admin-item">
                    <div className="admin-item-info">
                      <p><strong>{piloto.nombre} {piloto.apellido}</strong> - #{piloto.numero}</p>
                      <p>Equipo: {equipos.find(e => e.id === piloto.equipoId)?.nombre || 'No asignado'}</p>
                      <p>Nacionalidad: {piloto.nacionalidad}</p>
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
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPilotos;