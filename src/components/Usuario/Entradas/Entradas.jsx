import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import './Entradas.css';
import { apiService } from '../../../../config/api';

const Entradas = () => {
  const [entradas, setEntradas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const data = await apiService.obtenerEntradas();
        setEntradas(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchEntradas();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasStandingsData = (entrada) => {
    return entrada.Carrera || entrada.Clasificacion || entrada.Sprint;
  };

  const getStandingsCount = (entrada) => {
    let count = 0;
    if (entrada.Carrera) count++;
    if (entrada.Clasificacion) count++;
    if (entrada.Sprint) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="Entrada-conteiner">
        <Header />
        <main>
          <div className="loading-container">
            <p>Cargando entradas...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="Entrada-conteiner">
      <Header />
      <main>
        <h2 className="tituloentradas">Mi Diario de Carreras</h2>
        <button className="boton-crear" onClick={() => navigate('/nuevaentrada')}>
          Crear Nueva Entrada
        </button>

        {error && <p className="error-message">{error}</p>}

        {entradas.length === 0 ? (
          <div className="empty-state">
            <p>No hay entradas disponibles.</p>
            <p>¡Crea tu primera entrada para comenzar tu diario de carreras!</p>
          </div>
        ) : (
          <div className="grid-entradas">
            {entradas.map((entrada) => (
              <div className="entrada-card" key={entrada.id}>
                <div className="entrada-header">
                  <h3>{entrada.Titulo}</h3>
                  <span className="entrada-date">{formatDate(entrada.fechacreacion)}</span>
                </div>
                
                <div className="entrada-info">
                  <p className="gran-premio">
                    <strong>Gran Premio:</strong> {entrada.GranPremio?.nombre || `#${entrada.GranPremioId}`}
                  </p>
                  
                  {entrada.resumengeneral && (
                    <p className="resumen">
                      <strong>Resumen:</strong> {entrada.resumengeneral.length > 100 
                        ? `${entrada.resumengeneral.substring(0, 100)}...` 
                        : entrada.resumengeneral}
                    </p>
                  )}
                </div>

                {hasStandingsData(entrada) && (
                  <div className="standings-info">
                    <h4>Datos de Puestos ({getStandingsCount(entrada)}/3)</h4>
                    <div className="standings-badges">
                      {entrada.Carrera && (
                        <span className="badge carrera">Carrera</span>
                      )}
                      {entrada.Clasificacion && (
                        <span className="badge clasificacion">Clasificación</span>
                      )}
                      {entrada.Sprint && (
                        <span className="badge sprint">Sprint</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="entrada-actions">
                  <button 
                    className="boton-detalle" 
                    onClick={() => navigate(`/detalleentrada/${entrada.id}`)}
                  >
                    Ver Detalle
                  </button>
                  <button 
                    className="boton-editar" 
                    onClick={() => navigate(`/editarentrada/${entrada.id}`)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Entradas;
