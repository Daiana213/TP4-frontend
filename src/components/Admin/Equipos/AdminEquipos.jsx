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
    colorSecundario: '#ffffff',
    puntos: '',
    podios: '',
    carreras: '',
    wins: '',
    team_chief: '',
    technical_director: ''
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.pais.trim()) {
      setError('Por favor, completa todos los campos requeridos');
      return;
    }
    try {
      if (editMode) {
        await apiService.actualizarEquipo(currentId, formData);
      } else {
        await apiService.crearEquipo(formData);
      }
      fetchEquipos();
      resetForm();
      setError(null);
    } catch (err) {
      setError(`Error al ${editMode ? 'actualizar' : 'crear'} equipo: ${err.message}`);
    }
  };

  const handleEdit = (equipo) => {
    setFormData({
      nombre: equipo.Nombre,
      pais: equipo.Pais,
      puntos: equipo.Puntos || '',
      podios: equipo.Podios || '',
      wins: equipo.Wins || '',
      team_chief: equipo.Team_chief || '',
      technical_chief: equipo.Technical_chief || ''
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
      puntos: '',
      podios: '',
      wins: '',
      team_chief: '',
      technical_chief: ''
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
              {['nombre', 'pais', 'puntos', 'podios', 'wins', 'team_chief', 'technical_director'].map(field => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>{field.replace('_', ' ').toUpperCase()}</label>
                  <input
                    type={['puntos', 'podios', 'carreras', 'wins'].includes(field) ? 'number' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required={['nombre', 'pais'].includes(field)}
                  />
                </div>
              ))}
              <div className="form-actions">
                <button type="submit" className="submit-btn">{editMode ? 'Actualizar' : 'Guardar'}</button>
                {editMode && <button type="button" className="cancel-btn" onClick={resetForm}>Cancelar</button>}
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
                      <p><strong>Nombre:</strong> {equipo.Nombre}</p>
                      <p><strong>País:</strong> {equipo.Pais}</p>
                      <p><strong>Puntos:</strong> {equipo.Puntos}</p>
                      <p><strong>Podios:</strong> {equipo.Podios}</p>
                      <p><strong>Victorias:</strong> {equipo.Wins}</p>
                      <p><strong>Jefe de equipo:</strong> {equipo.Team_chief}</p>
                      <p><strong>Director técnico:</strong> {equipo.Technical_chief}</p>                      
                    </div>
                    <div className="admin-item-actions">
                      <button className="edit-btn" onClick={() => handleEdit(equipo)}>Editar</button>
                      <button className="delete-btn" onClick={() => handleDelete(equipo.id)}>Eliminar</button>
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