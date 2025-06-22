import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import './Calendario.css';

function Calendario() {
  const [calendario, setCalendario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendario = async () => {
      try {
        const data = await apiService.obtenerCalendario();
        setCalendario(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el calendario');
        setLoading(false);
      }
    };

    fetchCalendario();
  }, []);

  // Función para formatear la fecha
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="cargando">Cargando calendario...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="calendario-container">
      <Header />
      <h1 className="titulocalendario">CALENDARIO 2025</h1>
      <main className="maincalendario">
        <div className="calendario-grid">
          {calendario.map((granPremio) => (
            <div key={granPremio.id} className="granpremio-card">
              <h2>{granPremio.nombre}</h2>
              <div className="granpremio-info">
                <p><strong>Ronda:</strong> {granPremio.id}</p>
                <p><strong>Fecha:</strong> {formatearFecha(granPremio.fecha)}</p>
                <p><strong>Circuito:</strong> {granPremio.circuito}</p>
                <p><strong>País:</strong> {granPremio.pais}</p>
                <p><strong>Número de vueltas:</strong> {granPremio.numero_vueltas}</p>
                <p><strong>Horario:</strong> {granPremio.horarios}:00 hrs</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Calendario;