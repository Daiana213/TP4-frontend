import React, { useState, useEffect } from 'react';
import Header from '../Header/AdminHeader';
import Footer from '../Footer/Footer';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('pilotos');
  const [pilotos, setPilotos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [calendario, setCalendario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pilotos') {
        const response = await fetch('http://localhost:3000/pilotos');
        if (!response.ok) throw new Error('Error al cargar pilotos');
        const data = await response.json();
        setPilotos(data);
      } else if (activeTab === 'equipos') {
        const response = await fetch('http://localhost:3000/equipos');
        if (!response.ok) throw new Error('Error al cargar equipos');
        const data = await response.json();
        setEquipos(data);
      } else if (activeTab === 'calendario') {
        const response = await fetch('http://localhost:3000/calendario');
        if (!response.ok) throw new Error('Error al cargar calendario');
        const data = await response.json();
        setCalendario(data);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:3000/admin/${activeTab}/${editingId}` 
        : `http://localhost:3000/admin/${activeTab}`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Error al ${editingId ? 'actualizar' : 'crear'}`);
      
      // Refrescar datos
      fetchData();
      
      // Limpiar formulario
      setFormData({});
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    // Si es un gran premio, formatear la fecha para el input date
    if (activeTab === 'calendario' && item.fecha) {
      const fecha = new Date(item.fecha);
      const fechaFormateada = fecha.toISOString().split('T')[0];
      setFormData({...item, fecha: fechaFormateada});
    } else {
      setFormData(item);
    }
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/admin/${activeTab}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');
      
      // Refrescar datos
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderPilotosForm = () => (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>{editingId ? 'Editar Piloto' : 'Añadir Piloto'}</h3>
      <div className="form-group">
        <label>Nombre:</label>
        <input 
          type="text" 
          name="Nombre" 
          value={formData.Nombre || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Número:</label>
        <input 
          type="number" 
          name="Numero" 
          value={formData.Numero || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Puntos:</label>
        <input 
          type="number" 
          name="Puntos" 
          value={formData.Puntos || 0} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>País:</label>
        <input 
          type="text" 
          name="Pais" 
          value={formData.Pais || ''} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Campeonatos:</label>
        <input 
          type="number" 
          name="Campeonatos" 
          value={formData.Campeonatos || 0} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Podios:</label>
        <input 
          type="number" 
          name="Podios" 
          value={formData.Podios || 0} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Carreras:</label>
        <input 
          type="number" 
          name="Carreras" 
          value={formData.Carreras || 0} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Victorias:</label>
        <input 
          type="number" 
          name="Wins" 
          value={formData.Wins || 0} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Equipo ID:</label>
        <select 
          name="EquipoId" 
          value={formData.EquipoId || ''} 
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccionar Equipo</option>
          {equipos.map(equipo => (
            <option key={equipo.id} value={equipo.id}>{equipo.Nombre}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="submit-btn">
        {editingId ? 'Actualizar' : 'Añadir'}
      </button>
      {editingId && (
        <button 
          type="button" 
          className="cancel-btn" 
          onClick={() => {
            setFormData({});
            setEditingId(null);
          }}
        >
          Cancelar
        </button>
      )}
    </form>
  );

  const renderEquiposForm = () => (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>{editingId ? 'Editar Equipo' : 'Añadir Equipo'}</h3>
      <div className="form-group">
        <label>Nombre:</label>
        <input 
          type="text" 
          name="Nombre" 
          value={formData.Nombre || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Puntos:</label>
        <input 
          type="number" 
          name="Puntos" 
          value={formData.Puntos || 0} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Podios:</label>
        <input 
          type="number" 
          name="Podios" 
          value={formData.Podios || 0} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Carreras:</label>
        <input 
          type="number" 
          name="Carreras" 
          value={formData.Carreras || 0} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Victorias:</label>
        <input 
          type="number" 
          name="Wins" 
          value={formData.Wins || 0} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>País:</label>
        <input 
          type="text" 
          name="Pais" 
          value={formData.Pais || ''} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Jefe de Equipo:</label>
        <input 
          type="text" 
          name="Team_chief" 
          value={formData.Team_chief || ''} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="form-group">
        <label>Jefe Técnico:</label>
        <input 
          type="text" 
          name="Technical_chief" 
          value={formData.Technical_chief || ''} 
          onChange={handleInputChange} 
        />
      </div>
      <button type="submit" className="submit-btn">
        {editingId ? 'Actualizar' : 'Añadir'}
      </button>
      {editingId && (
        <button 
          type="button" 
          className="cancel-btn" 
          onClick={() => {
            setFormData({});
            setEditingId(null);
          }}
        >
          Cancelar
        </button>
      )}
    </form>
  );

  const renderCalendarioForm = () => (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>{editingId ? 'Editar Gran Premio' : 'Añadir Gran Premio'}</h3>
      <div className="form-group">
        <label>Nombre:</label>
        <input 
          type="text" 
          name="nombre" 
          value={formData.nombre || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Fecha:</label>
        <input 
          type="date" 
          name="fecha" 
          value={formData.fecha || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Circuito:</label>
        <input 
          type="text" 
          name="circuito" 
          value={formData.circuito || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>País:</label>
        <input 
          type="text" 
          name="pais" 
          value={formData.pais || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Número de vueltas:</label>
        <input 
          type="number" 
          name="numero_vueltas" 
          value={formData.numero_vueltas || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Horario (hora):</label>
        <input 
          type="number" 
          name="horarios" 
          min="0"
          max="23"
          value={formData.horarios || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <button type="submit" className="submit-btn">
        {editingId ? 'Actualizar' : 'Añadir'}
      </button>
      {editingId && (
        <button 
          type="button" 
          className="cancel-btn" 
          onClick={() => {
            setFormData({});
            setEditingId(null);
          }}
        >
          Cancelar
        </button>
      )}
    </form>
  );

  return (
    <div className="admin-container">
      <Header />
      <main>
        <h1 className="titulo">Panel de Administración</h1>
        
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pilotos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pilotos')}
          >
            Pilotos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'equipos' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipos')}
          >
            Equipos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'calendario' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendario')}
          >
            Calendario
          </button>
        </div>

        <div className="admin-content">
          <div className="admin-form-container">
            {activeTab === 'pilotos' 
              ? renderPilotosForm() 
              : activeTab === 'equipos' 
                ? renderEquiposForm() 
                : renderCalendarioForm()}
          </div>

          <div className="admin-list-container">
            <h3>Lista de {
              activeTab === 'pilotos' 
                ? 'Pilotos' 
                : activeTab === 'equipos' 
                  ? 'Equipos' 
                  : 'Grandes Premios'
            }</h3>
            {loading ? (
              <p>Cargando...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <div className="admin-list">
                {activeTab === 'pilotos' ? (
                  pilotos.map(piloto => (
                    <div key={piloto.id} className="admin-item">
                      <div className="admin-item-info">
                        <p><strong>{piloto.Nombre}</strong> - #{piloto.Numero}</p>
                        <p>Equipo: {piloto.Equipo?.Nombre || 'No asignado'}</p>
                      </div>
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEdit(piloto)}
                      >
                        Editar
                      </button>
                    </div>
                  ))
                ) : activeTab === 'equipos' ? (
                  equipos.map(equipo => (
                    <div key={equipo.id} className="admin-item">
                      <div className="admin-item-info">
                        <p><strong>{equipo.Nombre}</strong></p>
                        <p>Jefe: {equipo.Team_chief}</p>
                      </div>
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEdit(equipo)}
                      >
                        Editar
                      </button>
                    </div>
                  ))
                ) : (
                  calendario.map(granPremio => (
                    <div key={granPremio.id} className="admin-item">
                      <div className="admin-item-info">
                        <p><strong>{granPremio.nombre}</strong></p>
                        <p>Fecha: {new Date(granPremio.fecha).toLocaleDateString()}</p>
                        <p>Circuito: {granPremio.circuito}</p>
                      </div>
                      <div className="admin-item-actions">
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEdit(granPremio)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDelete(granPremio.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Admin;