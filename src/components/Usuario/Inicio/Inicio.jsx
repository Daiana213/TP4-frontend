import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import './Inicio.css';

function Inicio() {
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const data = await apiService.obtenerCalendario();
        setCarreras(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el calendario');
        setLoading(false);
      }
    };

    fetchCarreras();
  }, []);

  if (loading) return <div className="cargando">Cargando calendario...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inicio-container">
      <Header />
      <main>
        <h1 className="titulo">Calendario F1 2025</h1>
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
            {carreras.map((carrera) => (
              <tr key={carrera.id}>
                <td>{carrera.ronda}</td>
                <td>{carrera.nombre}</td>
                <td>{carrera.fecha}</td>
                <td>{carrera.pais}</td>
                <td>{carrera.circuito}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
}

export default Inicio;