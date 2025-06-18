import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NuevaEntrada() {
  const [titulo, setTitulo] = useState('');
  const [granPremioId, setGranPremioId] = useState('');
  const [formatoId, setFormatoId] = useState('');
  const [resumen, setResumen] = useState('');
  const [notasPersonales, setNotasPersonales] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/entradas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          Titulo: titulo,
          GranPremioId: parseInt(granPremioId),
          formatoId: parseInt(formatoId),
          resumen,
          notasPersonales,
          fecha,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      navigate('/entradas');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nueva entrada</h2>
      <label>Título:</label>
      <input value={titulo} onChange={e => setTitulo(e.target.value)} required />

      <label>Gran Premio ID:</label>
      <input value={granPremioId} onChange={e => setGranPremioId(e.target.value)} required type="number" />

      <label>Formato ID:</label>
      <input value={formatoId} onChange={e => setFormatoId(e.target.value)} required type="number" />

      <label>Fecha:</label>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />

      <label>Resumen:</label>
      <textarea value={resumen} onChange={e => setResumen(e.target.value)} />

      <label>Notas personales:</label>
      <textarea value={notasPersonales} onChange={e => setNotasPersonales(e.target.value)} />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Crear</button>
    </form>
  );
}
