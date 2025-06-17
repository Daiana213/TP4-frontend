import React, { useState, useEffect } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import './Entradas.css';

function Entradas() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const response = await fetch('http://localhost:3001/diario');
        const data = await response.json();
        setEntradas(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las entradas');
        setLoading(false);
      }
    };

    fetchEntradas();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="entradas-container">
      <Header />
      <h1 className="titulo-entradas">Mis Entradas</h1>
      
      <div className="nueva-entrada-container">
        <button className="nueva-entrada-btn">Nueva Entrada</button>
      </div>

      <div className="entradas-grid">
        {entradas.map((entrada) => (
          <div key={entrada.id} className="entrada-card">
            <h2>{entrada.Titulo}</h2>
            <p className="fecha">{new Date(entrada.fechacreacion).toLocaleDateString('es-ES')}</p>
            <p className="formato">Formato: {entrada.formatoId === 1 ? 'CARRERA' : entrada.formatoId === 2 ? 'CLASIFICACIÓN' : 'SPRINT'}</p>
            <p className="resumen">{entrada.resumengeneral}</p>
            <p className="notas">{entrada.notaspersonales}</p>
          </div>
        ))}
      </div>
      
      <Footer />
    </div>
  );
}

export default Entradas;