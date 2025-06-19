import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import StandingsForm from './StandingsForm';
import './EditarEntrada.css';
import { apiService } from '../../../../config/api';

export default function EditarEntrada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entrada, setEntrada] = useState(null);
  const [standingsData, setStandingsData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tieneSprint, setTieneSprint] = useState(false);

  useEffect(() => {
    let isMounted = true;

    apiService.obtenerEntradaPorId(id)
      .then(data => {
        if (isMounted) {
          setEntrada({
            ...data,
            fechacreacion: data.fechacreacion
              ? data.fechacreacion.slice(0, 10)
              : new Date().toISOString().slice(0, 10)
          });

          setTieneSprint(data.tieneSprint || false);

          setStandingsData({
            clasificacion: data.Clasificacion?.standings || [],
            sprint: data.Sprint?.standings || [],
            carrera: data.Carrera?.standings || []
          });

          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    if (!entrada) return;

    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'tieneSprint') {
        setTieneSprint(checked);
      } else {
        setEntrada(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setEntrada(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStandingsChange = (newStandings) => {
    setStandingsData(newStandings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entrada || !standingsData) return;

    setError(null);
    setSaving(true);
    try {
      await apiService.actualizarEntradaUsuario(id, {
        Titulo: entrada.Titulo,
        GranPremioId: parseInt(entrada.GranPremioId, 10),
        resumengeneral: entrada.resumengeneral,
        notaspersonales: entrada.notaspersonales,
        fechacreacion: entrada.fechacreacion,
        tieneSprint,
        clasificacionStandings: standingsData.clasificacion.filter(item => item.piloto),
        sprintStandings: tieneSprint ? standingsData.sprint.filter(item => item.piloto) : [],
        carreraStandings: standingsData.carrera.filter(item => item.piloto)
      });
      navigate('/entradas');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="editar-container">
        <Header />
        <main className="editar-content">
          <div className="loading-container">
            <p>Cargando entrada...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!entrada || !standingsData) {
    return (
      <div className="editar-container">
        <Header />
        <main className="editar-content">
          <p className="error-text">Entrada no encontrada</p>
          <button onClick={() => navigate('/entradas')} className="btn-volver">
            Volver a lista
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="editar-container">
      <Header />
      <main className="editar-content">
        <h2>Editar Entrada del Gran Premio</h2>

        <form onSubmit={handleSubmit} className="editar-form">
          <div className="form-section">
            <h3>Información General</h3>

            <div className="form-group">
              <label htmlFor="titulo">Título de la Entrada:</label>
              <input
                id="titulo"
                name="Titulo"
                type="text"
                value={entrada.Titulo || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="granPremioId">Gran Premio ID:</label>
              <input
                id="granPremioId"
                name="GranPremioId"
                type="number"
                value={entrada.GranPremioId || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha del Gran Premio:</label>
              <input
                id="fecha"
                name="fechacreacion"
                type="date"
                value={entrada.fechacreacion || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tieneSprint">¿Este GP tiene Sprint?</label>
              <input
                id="tieneSprint"
                name="tieneSprint"
                type="checkbox"
                checked={tieneSprint}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Análisis Personal</h3>

            <div className="form-group">
              <label htmlFor="resumen">Resumen General:</label>
              <textarea
                id="resumen"
                name="resumengeneral"
                value={entrada.resumengeneral || ''}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notasPersonales">Notas Personales:</label>
              <textarea
                id="notasPersonales"
                name="notaspersonales"
                value={entrada.notaspersonales || ''}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          <StandingsForm
            onStandingsChange={handleStandingsChange}
            initialData={standingsData}
            mostrarSprint={tieneSprint}
          />

          {error && <p className="error-message">{error}</p>}

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
              className="btn-guardar"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
