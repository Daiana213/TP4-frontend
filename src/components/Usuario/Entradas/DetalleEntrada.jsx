import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function DetalleEntrada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entrada, setEntrada] = useState(null);

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

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta entrada?')) return;

    await fetch(`http://localhost:3001/api/entradas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    navigate('/entradas');
  };

  if (!entrada) return <p>Cargando entrada...</p>;

  return (
    <div>
      <h2>{entrada.Titulo}</h2>
      <p>Gran Premio ID: {entrada.GranPremioId}</p>
      <p>Formato ID: {entrada.formatoId}</p>
      <p>Fecha: {entrada.fechacreacion}</p>
      <p><strong>Resumen:</strong> {entrada.resumengeneral}</p>
      <p><strong>Notas:</strong> {entrada.notaspersonales}</p>

      <button onClick={() => navigate(`/entradas/${id}/editar`)}>Editar</button>
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  );
}
