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

  // Entradas (nuevo)
  entradas: `${API_BASE_URL}/entradas`,
  entradaById: (id) => `${API_BASE_URL}/entradas/${id}`,

  // Pilotos y Equipos
  pilotos: `${API_BASE_URL}/pilotos`,
  equipos: `${API_BASE_URL}/equipos`,

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

  // Entradas del Diario del Usuario (EntradaGPUsuario)
  obtenerEntradas: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.entradas, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al obtener entradas');
    return response.json();
  },

  obtenerEntradaPorId: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.entradaById(id), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al obtener la entrada');
    return response.json();
  },

  crearEntradaUsuario: async (entradaData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.entradas, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(entradaData)
    });
    if (!response.ok) throw new Error('Error al crear entrada');
    return response.json();
  },

  actualizarEntradaUsuario: async (id, entradaData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.entradaById(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(entradaData)
    });
    if (!response.ok) throw new Error('Error al actualizar entrada');
    return response.json();
  },

  eliminarEntradaUsuario: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.entradaById(id), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al eliminar entrada');
    return response.json();
  },

  // Pilotos y Equipos
  obtenerPilotos: async () => {
    const response = await fetch(API_ENDPOINTS.pilotos);
    if (!response.ok) throw new Error('Error al obtener pilotos');
    return response.json();
  },

  obtenerEquipos: async () => {
    const response = await fetch(API_ENDPOINTS.equipos);
    if (!response.ok) throw new Error('Error al obtener equipos');
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
