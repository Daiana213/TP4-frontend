import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import StandingsForm from './StandingsForm';
import './NuevaEntrada.css';
import { apiService } from '../../../../config/api';

export default function NuevaEntrada() {
  const [titulo, setTitulo] = useState('');
  const [resumen, setResumen] = useState('');
  const [notasPersonales, setNotasPersonales] = useState('');
  const [fecha, setFecha] = useState('');
  const [tieneSprint, setTieneSprint] = useState(false);
  const [standingsData, setStandingsData] = useState({
    clasificacion: [],
    sprint: [],
    carrera: []
  });

  const [granPremioDisponible, setGranPremioDisponible] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const cargarGPDisponible = async () => {
      try {
        const [gps, entradas] = await Promise.all([
          apiService.obtenerGranPremios(),
          apiService.obtenerEntradasDelUsuario()
        ]);

        const gpsOrdenados = gps.sort((a, b) => a.id - b.id);
        const idsConEntrada = entradas.map(e => e.GranPremioId);

        const siguienteGP = gpsOrdenados.find(gp => !idsConEntrada.includes(gp.id));

        if (siguienteGP) {
          setGranPremioDisponible(siguienteGP);
        } else {
          setError('Ya creaste entradas para todos los Grandes Premios.');
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los Grandes Premios.');
      }
    };

    cargarGPDisponible();
  }, []);

  const handleStandingsChange = (newStandings) => {
    setStandingsData(newStandings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiService.crearEntradaUsuario({
        Titulo: titulo,
        GranPremioId: granPremioDisponible.id,
        resumengeneral: resumen,
        notaspersonales: notasPersonales,
        fechacreacion: fecha,
        tieneSprint,
        clasificacionStandings: standingsData.clasificacion.filter(item => item.piloto),
        sprintStandings: tieneSprint ? standingsData.sprint.filter(item => item.piloto) : [],
        carreraStandings: standingsData.carrera.filter(item => item.piloto)
      });

      navigate('/entradas');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="Nueva-container">
      <Header />
      <div className="nueva-entrada-content">
        <h2>Nueva Entrada del Gran Premio</h2>

        {error && <p className="error-message">{error}</p>}

        {granPremioDisponible && (
          <form onSubmit={handleSubmit} className="nueva-entrada-form">
            <div className="form-section">
              <h3>Información General</h3>

              <div className="form-group">
                <label htmlFor="titulo">Título de la Entrada:</label>
                <input 
                  id="titulo"
                  type="text"
                  value={titulo} 
                  onChange={e => setTitulo(e.target.value)} 
                  placeholder="Ej: Gran Premio de Mónaco - Análisis completo"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Gran Premio:</label>
                <p className="gp-nombre">{granPremioDisponible.nombre} (Ronda {granPremioDisponible.id})</p>
              </div>

              <div className="form-group">
                <label htmlFor="fecha">Fecha del Gran Premio:</label>
                <input 
                  id="fecha"
                  type="date" 
                  value={fecha} 
                  onChange={e => setFecha(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="tieneSprint">¿Este GP tiene Sprint?</label>
                <input
                  id="tieneSprint"
                  type="checkbox"
                  checked={tieneSprint}
                  onChange={e => setTieneSprint(e.target.checked)}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Análisis Personal</h3>

              <div className="form-group">
                <label htmlFor="resumen">Resumen General:</label>
                <textarea 
                  id="resumen"
                  value={resumen} 
                  onChange={e => setResumen(e.target.value)}
                  placeholder="Describe los momentos más importantes del Gran Premio..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="notasPersonales">Notas Personales:</label>
                <textarea 
                  id="notasPersonales"
                  value={notasPersonales} 
                  onChange={e => setNotasPersonales(e.target.value)}
                  placeholder="Tus impresiones personales, sorpresas, decepciones..."
                  rows="4"
                />
              </div>
            </div>

            {/* Standings con diseño ajustado desde el CSS */}
            <StandingsForm 
              onStandingsChange={handleStandingsChange}
              initialData={standingsData}
              mostrarSprint={tieneSprint}
            />

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/entradas')}
                className="btn-cancelar"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-crear"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Entrada'}
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
