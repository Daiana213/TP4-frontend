import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import './Entradas.css';

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
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener las entradas.');
        }

        const data = await response.json();
        console.log('Entrada recibida:', data);
        setEntradas(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEntradas();
  }, []);

  return (
    <div className="Entrada-conteiner">
      <Header />
      <main>
        <h2 className="tituloentradas">Listado de Entradas</h2>
        <button className="boton-crear" onClick={() => navigate('/nuevaentrada')}>
          Crear Nueva Entrada
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {entradas.length === 0 ? (
          <p>No hay entradas disponibles.</p>
        ) : (
          <div className="grid-entradas">
            {entradas.map((entrada) => (
              <div className="entrada-card" key={entrada.id}>
                <h3>{entrada.Titulo}</h3>
                <p>Gran Premio #{entrada.GranPremioId}</p>
                <button className="boton-detalle" onClick={() => navigate(`/detalleentrada/${entrada.id}`)}>
                  Ver Detalle
                </button>
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
