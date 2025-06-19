// ✅ DetalleEntrada.jsx (actualizado sin uso de formato y corregido botón editar)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import './DetalleEntrada.css';

const DetalleEntrada = () => {
  const { id } = useParams();
  const [entrada, setEntrada] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntrada = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3001/api/entradas/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Error al obtener la entrada');

        const data = await response.json();
        // En caso de recibir un array (por ejemplo, [entrada]), extraer primer elemento
        setEntrada(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEntrada();
  }, [id]);

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás segura/o de eliminar esta entrada?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/entradas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error al eliminar la entrada');
      navigate('/entradas');
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p className="error-text">{error}</p>;
  if (!entrada) return <p className="loading-text">Cargando...</p>;

  return (
    <div className="detalle-entrada-container">
      <Header />
      <main className="detalle-content">
        <h2>Detalle de la Entrada</h2>
        <div className="entrada-info">
          <p><strong>Título:</strong> {entrada.Titulo}</p>
          <p><strong>Gran Premio:</strong> {entrada.GranPremioId}</p>
          <p><strong>Resumen General:</strong> {entrada.resumengeneral}</p>
          <p><strong>Notas Personales:</strong> {entrada.notaspersonales}</p>
          <p><strong>Fecha de Creación:</strong> {entrada.fechacreacion}</p>
        </div>
        <div className="detalle-botones">
          <button className="btn editar" onClick={() => navigate(`/editarentrada/${entrada.id || id}`)}>Editar</button>
          <button className="btn eliminar" onClick={handleEliminar}>Eliminar</button>
          <button className="btn volver" onClick={() => navigate('/entradas')}>Volver</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DetalleEntrada;