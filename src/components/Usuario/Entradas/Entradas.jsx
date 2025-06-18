import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Entradas = () => {
  const [entradas, setEntradas] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntradas = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay token. Por favor iniciá sesión.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/entradas', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('No autorizado. Iniciá sesión nuevamente.');
          } else {
            throw new Error('Error al obtener las entradas.');
          }
        }

        const data = await response.json();
        setEntradas(data);
      } catch (err) {
        setError(err.message);
        console.error('Error al obtener entradas:', err.message);
      }
    };

    fetchEntradas();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Listado de Entradas</h2>
      <button onClick={() => navigate('/nuevaentrada')}>
        Crear Nueva Entrada
      </button>
      {entradas.length === 0 ? (
        <p>No hay entradas disponibles.</p>
      ) : (
        <ul>
          {entradas.map((entrada) => (
            <li key={entrada.id}>
              {entrada.Titulo} - {entrada.GranPremio?.nombre || 'Sin Gran Premio'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Entradas;
