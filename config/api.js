const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Usuarios
  login: `${API_BASE_URL}/usuarios/login`,
  registro: `${API_BASE_URL}/usuarios/registro`,
  
  // Carreras
  carreras: `${API_BASE_URL}/carreras`,
  carreraById: (id) => `${API_BASE_URL}/carreras/${id}`,
  
  // Diario
  diario: `${API_BASE_URL}/diario`,
  diarioById: (id) => `${API_BASE_URL}/diario/${id}`,
  
  // Pilotos y Equipos
  pilotos: `${API_BASE_URL}/pilotos`,
  adminPilotos: `${API_BASE_URL}/admin/pilotos`,
  adminPilotosById: (id) => `${API_BASE_URL}/admin/pilotos/${id}`,
  
  equipos: `${API_BASE_URL}/equipos`,
  adminEquipos: `${API_BASE_URL}/admin/equipos`,
  adminEquiposById: (id) => `${API_BASE_URL}/admin/equipos/${id}`,
  
  // Calendario
  calendario: `${API_BASE_URL}/calendario`,
  calendarioById: (id) => `${API_BASE_URL}/calendario/${id}`,
  adminCalendario: `${API_BASE_URL}/admin/calendario`,
  adminCalendarioById: (id) => `${API_BASE_URL}/admin/calendario/${id}`
};

// Funciones de servicio para las llamadas API
export const apiService = {
  // Usuarios
  login: async (credentials) => {
    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Error en el login');
    return response.json();
  },

  registro: async (userData) => {
    const response = await fetch(API_ENDPOINTS.registro, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Error en el registro');
    return response.json();
  },

  // Carreras
  obtenerCarreras: async () => {
    const response = await fetch(API_ENDPOINTS.carreras);
    if (!response.ok) throw new Error('Error al obtener carreras');
    return response.json();
  },

  obtenerCarrera: async (id) => {
    const response = await fetch(API_ENDPOINTS.carreraById(id));
    if (!response.ok) throw new Error('Error al obtener la carrera');
    return response.json();
  },

  // Diario
  crearEntrada: async (entradaData) => {
    const response = await fetch(API_ENDPOINTS.diario, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entradaData)
    });
    if (!response.ok) throw new Error('Error al crear entrada');
    return response.json();
  },

  obtenerEntrada: async (id) => {
    const response = await fetch(API_ENDPOINTS.diarioById(id));
    if (!response.ok) throw new Error('Error al obtener entrada');
    return response.json();
  },

  actualizarEntrada: async (id, entradaData) => {
    const response = await fetch(API_ENDPOINTS.diarioById(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entradaData)
    });
    if (!response.ok) throw new Error('Error al actualizar entrada');
    return response.json();
  },

  // Pilotos y Equipos
  obtenerPilotos: async () => {
    const response = await fetch(API_ENDPOINTS.pilotos);
    if (!response.ok) throw new Error('Error al obtener pilotos');
    return response.json();
  },

  crearPiloto: async (pilotoData) => {
    const response = await fetch(API_ENDPOINTS.adminPilotos, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(pilotoData)
    });
    if (!response.ok) throw new Error('Error al crear piloto');
    return response.json();
  },
  
  actualizarPiloto: async (id, pilotoData) => {
    const response = await fetch(API_ENDPOINTS.adminPilotosById(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(pilotoData)
    });
    if (!response.ok) throw new Error('Error al actualizar piloto');
    return response.json();
  },
  
  eliminarPiloto: async (id) => {
    const response = await fetch(API_ENDPOINTS.adminPilotosById(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) throw new Error('Error al eliminar piloto');
    return response.json();
  },

  obtenerEquipos: async () => {
    const response = await fetch(API_ENDPOINTS.equipos);
    if (!response.ok) throw new Error('Error al obtener equipos');
    return response.json();
  },
  
  crearEquipo: async (equipoData) => {
    const response = await fetch(API_ENDPOINTS.adminEquipos, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(equipoData)
    });
    if (!response.ok) throw new Error('Error al crear equipo');
    return response.json();
  },
  
  actualizarEquipo: async (id, equipoData) => {
    const response = await fetch(API_ENDPOINTS.adminEquiposById(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(equipoData)
    });
    if (!response.ok) throw new Error('Error al actualizar equipo');
    return response.json();
  },
  
  eliminarEquipo: async (id) => {
    const response = await fetch(API_ENDPOINTS.adminEquiposById(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) throw new Error('Error al eliminar equipo');
    return response.json();
  },

  // Calendario
  obtenerCalendario: async () => {
    const response = await fetch(API_ENDPOINTS.calendario);
    if (!response.ok) throw new Error('Error al obtener calendario');
    return response.json();
  },

  obtenerGranPremio: async (id) => {
    const response = await fetch(API_ENDPOINTS.calendarioById(id));
    if (!response.ok) throw new Error('Error al obtener gran premio');
    return response.json();
  },

  crearGranPremio: async (granPremioData) => {
    const response = await fetch(API_ENDPOINTS.adminCalendario, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(granPremioData)
    });
    if (!response.ok) throw new Error('Error al crear gran premio');
    return response.json();
  },

  actualizarGranPremio: async (id, granPremioData) => {
    const response = await fetch(API_ENDPOINTS.adminCalendarioById(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(granPremioData)
    });
    if (!response.ok) throw new Error('Error al actualizar gran premio');
    return response.json();
  },

  eliminarGranPremio: async (id) => {
    const response = await fetch(API_ENDPOINTS.adminCalendarioById(id), {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar gran premio');
    return response.json();
  }
};
