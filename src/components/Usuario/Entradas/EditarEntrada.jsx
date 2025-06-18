import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import './EditarEntrada.css';

export default function EditarEntrada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entrada, setEntrada] = useState(null);
  const [error, setError] = useState(null);

  // Para el select formato manejamos directamente en el objeto entrada
  // pero podés usar un estado separado si preferís

  useEffect(() => {
    fetch(`http://localhost:3001/api/entradas/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener la entrada');
        return res.json();
      })
      .then(data => {
        setEntrada(data);
      })
      .catch(err => setError(err.message));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntrada(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3001/api/entradas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          Titulo: entrada.Titulo,
          GranPremioId: parseInt(entrada.GranPremioId, 10),
          resumengeneral: entrada.resumengeneral,
          notaspersonales: entrada.notaspersonales,
          fechacreacion: entrada.fechacreacion,
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      navigate('/entradas'); // redirige al listado
    } catch (err) {
      setError(err.message);
    }
  };

  if (!entrada) return <p>Cargando...</p>;

  return (
    <div className="editar-container">
      <Header />
      <form onSubmit={handleSubmit} className="editar-form">
        <h2>Editar entrada</h2>

        <input
          name="Titulo"
          value={entrada.Titulo}
          onChange={handleChange}
          placeholder="Título"
          required
        />

        <input
          name="GranPremioId"
          value={entrada.GranPremioId}
          type="number"
          onChange={handleChange}
          placeholder="ID del Gran Premio"
          required
        />

        <input
          name="fechacreacion"
          type="date"
          value={entrada.fechacreacion}
          onChange={handleChange}
          required
        />

        <textarea
          name="resumengeneral"
          value={entrada.resumengeneral}
          onChange={handleChange}
          placeholder="Resumen general"
        />

        <textarea
          name="notaspersonales"
          value={entrada.notaspersonales}
          onChange={handleChange}
          placeholder="Notas personales"
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn-guardar">Guardar cambios</button>
      </form>
      <Footer />
    </div>
  );
}
