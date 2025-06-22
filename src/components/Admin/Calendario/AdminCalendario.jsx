import React, { useState, useEffect } from 'react';
import AdminHeader from '../Header/AdminHeader';
import { apiService } from '../../../../config/api';
import './AdminCalendario.css';

const AdminCalendario = () => {
  // ===== ESTADOS =====
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

  // ===== EFECTOS =====
  useEffect(() => {
    fetchCalendario();
  }, []);

  // ===== FUNCIONES DE DATOS =====
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
      fecha: '',
      pais: '',
      circuito: '',
      numero_vueltas: '',
      horarios: ''
    });
    setEditMode(false);
    setCurrentId(null);
    setError(null);
  };

  // ===== VALIDACIONES =====
  const validateForm = () => {
    // Validación de campos requeridos
    if (!formData.nombre.trim() || !formData.fecha || !formData.pais.trim() || !formData.circuito.trim()) {
      setError('Por favor, completa todos los campos requeridos');
      return false;
    }
    
    // Validación de fecha
    const fechaCarrera = new Date(formData.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (!editMode && fechaCarrera < hoy) {
      setError('La fecha de la carrera no puede ser anterior a hoy');
      return false;
    }

    // Validación de horario
    if (formData.horarios < 0 || formData.horarios > 23) {
      setError('El horario debe estar entre 0 y 23');
      return false;
    }

    // Validación de número de vueltas
    if (formData.numero_vueltas < 1) {
      setError('El número de vueltas debe ser mayor a 0');
      return false;
    }

    return true;
  };

  // ===== MANEJADORES DE EVENTOS =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submissionData = {
      nombre: formData.nombre,
      fecha: formData.fecha,
      pais: formData.pais,
      circuito: formData.circuito,
      numero_vueltas: Number(formData.numero_vueltas) || 0,
      horarios: Number(formData.horarios) || 0
    };

    try {
      if (editMode) {
        await apiService.actualizarGranPremio(currentId, submissionData);
      } else {
        await apiService.crearGranPremio(submissionData);
      }

      await fetchCalendario();
      resetForm();
    } catch (err) {
      console.error('Error en operación de gran premio:', err);
      setError(`Error al ${editMode ? 'actualizar' : 'crear'} gran premio: ${err.message}`);
    }
  };

  const handleEdit = (carrera) => {
    try {
      const fechaFormateada = formatDateForInput(carrera.fecha);

      setFormData({
        nombre: carrera.nombre || '',
        fecha: fechaFormateada,
        pais: carrera.pais || '',
        circuito: carrera.circuito || '',
        numero_vueltas: carrera.numero_vueltas || '',
        horarios: carrera.horarios || ''
      });
      setEditMode(true);
      setCurrentId(carrera.id);
      setError(null);
    } catch (error) {
      console.error('Error al procesar datos para edición:', error);
      setError('Error al cargar los datos para edición');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta carrera?')) return;

    try {
      await apiService.eliminarGranPremio(id);
      await fetchCalendario();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // ===== FUNCIONES UTILITARIAS =====
  const formatDateForInput = (fechaString) => {
    if (!fechaString) return '';
    
    try {
      const fecha = new Date(fechaString);
      if (!isNaN(fecha.getTime())) {
        return fecha.toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Fecha inválida recibida:', fechaString);
    }
    return '';
  };

  const formatearFecha = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      if (isNaN(fecha.getTime())) {
        return 'Fecha inválida';
      }
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // ===== DATOS PROCESADOS =====
  const carrerasOrdenadas = [...calendario].sort((a, b) => {
    try {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaA - fechaB;
    } catch (error) {
      return 0;
    }
  });

  // ===== RENDERIZADO =====
  if (loading) {
    return (
      <div className="admin-container">
        <AdminHeader />
        <div className="loading">Cargando calendario...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminHeader />
      <main>
        <h1 className="titulo">Gestión del Calendario</h1>
        
        <section className="admin-content">
          {/* ===== FORMULARIO ===== */}
          <div className="admin-form-container">
            <h3>{editMode ? 'Editar Carrera' : 'Agregar Nueva Carrera'}</h3>
            
            {error && <p className="error">{error}</p>}

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Gran Premio</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Gran Premio de España"
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
                  placeholder="Ej: España"
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
                  placeholder="Ej: Circuit de Barcelona-Catalunya"
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
                  placeholder="66"
                  min="1"
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
                  placeholder="15"
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

          {/* ===== LISTA DE CARRERAS ===== */}
          <div className="admin-list-container">
            <h3>Calendario Actual ({carrerasOrdenadas.length} carreras)</h3>
            
            <div className="admin-list">
              {carrerasOrdenadas.length === 0 ? (
                <p className="no-data">No hay carreras programadas</p>
              ) : (
                carrerasOrdenadas.map((carrera, index) => (
                  <div key={carrera.id} className="admin-item admin-calendario-item">
                    <div className="admin-item-info">
                      <p>
                        <strong>Ronda {index + 1}: {carrera.nombre}</strong>
                      </p>
                      <p className="fecha-destacada">Fecha: {formatearFecha(carrera.fecha)}</p>
                      <div className="circuito-info">
                        <strong>Circuito:</strong> {carrera.circuito}, {carrera.pais}
                      </div>
                      <p>
                        <span className="vueltas-info">Vueltas: {carrera.numero_vueltas}</span> | 
                        <span className="horario-info"> Horario: {carrera.horarios}:00h</span>
                      </p>
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
