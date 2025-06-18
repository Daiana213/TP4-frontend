import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditarEntrada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entrada, setEntrada] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/entradas/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setEntrada(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setEntrada({ ...entrada, [e.target.name]: e.target.value });
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
          GranPremioId: parseInt(entrada.GranPremioId),
          formatoId: parseInt(entrada.formatoId),
          resumen: entrada.resumengeneral,
          notasPersonales: entrada.notaspersonales,
          fecha: entrada.fechacreacion,
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      navigate(`/entradas/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!entrada) return <p>Cargando...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar entrada</h2>

      <input name="Titulo" value={entrada.Titulo} onChange={handleChange} required />
      <input name="GranPremioId" value={entrada.GranPremioId} type="number" onChange={handleChange} required />
      <input name="formatoId" value={entrada.formatoId} type="number" onChange={handleChange} required />
      <input name="fechacreacion" type="date" value={entrada.fechacreacion} onChange={handleChange} required />
      <textarea name="resumengeneral" value={entrada.resumengeneral} onChange={handleChange} />
      <textarea name="notaspersonales" value={entrada.notaspersonales} onChange={handleChange} />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Guardar cambios</button>
    </form>
  );
}
