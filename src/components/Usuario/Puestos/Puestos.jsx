import React, { useEffect, useState } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';

export default function Puestos({ ordenarDescendente = true }) {
  const [pilotos, setPilotos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [ordenDesc, setOrdenDesc] = useState(ordenarDescendente);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setCargando(true);
        setError(null);

        const [pilotosData, equiposData] = await Promise.all([
          apiService.obtenerPilotos(),
          apiService.obtenerEquipos()
        ]);

        setPilotos(pilotosData);
        setEquipos(equiposData);
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, []);

  const ordenarLista = (lista) => {
    return [...lista].sort((a, b) =>
      ordenDesc ? b.Puntos - a.Puntos : a.Puntos - b.Puntos
    );
  };

  if (cargando) return <div className="puestos-cargando">Cargando datos...</div>;
  if (error) return <div className="puestos-error">{error}</div>;

  return (
    <div className="puestos-container">
      <Header />
      <main className="puestos-main">
        <h2 className="puestos-titulo">STANDINGS</h2>

        <button className="boton-orden" onClick={() => setOrdenDesc(!ordenDesc)}>
          Ordenar puntos: {ordenDesc ? 'Menor a mayor' : 'Mayor a menor'}
        </button>

        <section className="tabla-seccion">
          <h3>Pilotos</h3>
          <table className="tabla-puntos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {ordenarLista(pilotos).map((piloto) => (
                <tr key={piloto.id}>
                  <td>{piloto.Nombre || piloto.nombre}</td>
                  <td>{piloto.Puntos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="tabla-seccion">
          <h3>Equipos</h3>
          <table className="tabla-puntos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {ordenarLista(equipos).map((equipo) => (
                <tr key={equipo.id}>
                  <td>{equipo.Nombre || equipo.nombre}</td>
                  <td>{equipo.Puntos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
      <Footer />
    </div>
  );
}
