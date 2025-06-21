import React, { useState, useEffect } from 'react';
import AdminHeader from '../AdminHeader';
import { apiService } from '../../../../config/api';
import './AdminCalendario.css';

const AdminCalendario = () => {
  const [calendario, setCalendario] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    pais: '',
    circuito: '',
    numero_vueltas: '',
    horarios: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCalendario();
  }, []);

  const fetchCalendario = async () => {
    try {
      const data = await apiService.obtenerCalendario();
      setCalendario(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
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

    // Validación de campos requeridos
    if (!formData.nombre.trim() || !formData.fecha || !formData.pais.trim() || !formData.circuito.trim()) {
      setError('Por favor, completa todos los campos requeridos');
      return;
    }
    
    // Validación de fecha
    const fechaCarrera = new Date(formData.fecha);
    const hoy = new Date();
    if (fechaCarrera < hoy) {
      setError('La fecha de la carrera no puede ser anterior a hoy');
      return;
    }

    try {
      if (editMode) {
        await apiService.actualizarGranPremio(currentId, formData);
      } else {
        await apiService.crearGranPremio(formData);
      }

      fetchCalendario();
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Error en operación de calendario:', err);
      setError(`Error al ${editMode ? 'actualizar' : 'crear'} carrera: ${err.message}`);
    }
  };

  const handleEdit = (carrera) => {
    const fecha = new Date(carrera.fecha);
    const fechaFormateada = fecha.toISOString().split('T')[0];

    setFormData({
      nombre: carrera.nombre,
      fecha: fechaFormateada,
      pais: carrera.pais,
      circuito: carrera.circuito,
      numero_vueltas: carrera.numero_vueltas,
      horarios: carrera.horarios,
      ronda: carrera.ronda
    });
    setEditMode(true);
    setCurrentId(carrera.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta carrera?')) return;

    try {
      await apiService.eliminarGranPremio(id);
      fetchCalendario();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      fecha: '',
      pais: '',
      circuito: '',
      numero_vueltas: '',
      horarios: ''
     });
    setEditMode(false);
    setCurrentId(null);
  };

  const carrerasOrdenadas = [...calendario].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="admin-container">
      <AdminHeader />
      <main>
        <h1 className="titulo">Gestión del Calendario</h1>
        <section className="admin-content">
            <div className="admin-form-container">
              <h3>{editMode ? 'Editar Carrera' : 'Agregar Nueva Carrera'}</h3>
              {error && <p className="error">{error}</p>}

              <form className="admin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del Gran Premio</label>
                  <input
                    type="text"
                    id ="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>              

                <div className="form-group">
                  <label htmlFor="fecha">Fecha</label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
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
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="circuito">Circuito</label>
                    <input
                      type="text"
                      id="circuito"
                      name="circuito"
                      value={formData.circuito}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="numero_vueltas">Número de Vueltas</label>
                    <input
                      type="number"
                      id="numero_vueltas"
                      name="numero_vueltas"
                      value={formData.numero_vueltas}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="horarios">Horario (hora)</label>
                    <input
                      type="number"
                      id="horarios"
                      name="horarios"
                      value={formData.horarios}
                      onChange={handleChange}
                      min="0"
                      max="23"
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
                <h3>Calendario Actual</h3>
                <div className="admin-list">
                  {carrerasOrdenadas.length === 0 ? (
                    <p>No hay carreras programadas</p>
                  ) : (
                    carrerasOrdenadas.map((carrera) => (
                      <div key={carrera.id} className="admin-item">
                        <div className="admin-item-info">
                          <p>
                            <strong>Ronda {carrera.ronda}: {carrera.nombre}</strong>
                          </p>
                          <p>Fecha: {new Date(carrera.fecha).toLocaleDateString('es-ES')}</p>
                          <p>Circuito: {carrera.circuito}, {carrera.pais}</p>
                          <p>Vueltas: {carrera.numero_vueltas} | Horario: {carrera.horarios}:00h</p>
                        </div>
                        <div className="admin-item-actions">
                          <button className="edit-btn" onClick={() => handleEdit(carrera)}>
                            Editar
                          </button>
                          <button className="delete-btn" onClick={() => handleDelete(carrera.id)}>
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

export default AdminCalendario;
