import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import './Inicio.css';

function Inicio() {
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const data = await apiService.obtenerCalendario();
        setCarreras(data);
      } catch (err) {
        setError(`Error al cargar el calendario: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCarreras();
  }, []);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Filtrar las próximas dos carreras
  const hoy = new Date();
  const proximasCarreras = carreras
    .filter((carrera) => new Date(carrera.fecha) > hoy) // Solo carreras futuras
    .slice(0, 2); // Tomar las primeras dos

  if (loading) return <div className="cargando"><span className="spinner"></span> Cargando calendario...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inicio-container">
      <Header />
        <h1 className="titulo">Hola, {user?.nombre || 'Usuario'}</h1>
        <section className="calendario">
          <h2>Próximas Carreras</h2>
          {proximasCarreras.length === 0 ? (
            <p>No hay carreras próximas disponibles.</p>
          ) : (
            <table className="tabla-carreras">
              <thead>
                <tr>
                  <th>Ronda</th>
                  <th>Gran Premio</th>
                  <th>Fecha</th>
                  <th>País</th>
                  <th>Circuito</th>
                </tr>
              </thead>
              <tbody>
                {proximasCarreras.map((carrera) => (
                  <tr key={carrera.id}>
                    <td>{carrera.ronda}</td>
                    <td>{carrera.nombre}</td>
                    <td>{formatearFecha(carrera.fecha)}</td>
                    <td>{carrera.pais}</td>
                    <td>{carrera.circuito}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      <Footer />
    </div>
  );
}

export default Inicio;
