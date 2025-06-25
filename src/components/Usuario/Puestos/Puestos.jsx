import React, { useEffect, useState } from 'react';
import Header from '../../Header/UserHeader';
import Footer from '../../Footer/Footer';
import { apiService } from '../../../../config/api';
import './Puestos.css';

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

        const data = await apiService.obtenerPuntosUsuario();

        setPilotos(data.pilotos || []);
        setEquipos(data.equipos || []);
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, []);

  console.log('Pilotos:', pilotos);
  console.log('Equipos:', equipos);

  const ordenarLista = (lista) => {
    return [...lista].sort((a, b) =>
      ordenDesc ? b.puntos - a.puntos : a.puntos - b.puntos
    );
  };

  return (
    <div className="container-exterior">
      <Header />
      <div className="puestos-container">
        <main className="puestos-main">
          <h2 className="puestos-titulo">STANDINGS</h2>

          <button className="boton-orden" onClick={() => setOrdenDesc(!ordenDesc)}>
            Ordenar puntos: {ordenDesc ? 'Menor a mayor' : 'Mayor a menor'}
          </button>

          {cargando && <div className="puestos-cargando">Cargando datos...</div>}
          {error && <div className="puestos-error">{error}</div>}

          {!cargando && !error && (
            <>
              <section className="tabla-seccion">
                <h3>Standings Pilotos</h3>
                <ul className="ranking-lista">
                  {ordenarLista(pilotos).map((piloto) => (
                    <li
                      className="ranking-item"
                      key={piloto.id ?? piloto.pilotoId ?? piloto.nombre}
                    >
                      <span className="ranking-nombre">{piloto.nombre}</span>
                      <span className="ranking-puntos">{piloto.puntos}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="tabla-seccion">
                <h3>Standings Equipos</h3>
                <ul className="ranking-lista">
                  {ordenarLista(equipos).map((equipo) => (
                    <li
                      className="ranking-item"
                      key={equipo.id ?? equipo.equipo ?? equipo.nombre}
                    >
                      <span className="ranking-nombre">{equipo.equipo || equipo.Nombre || equipo.nombre}</span>
                      <span className="ranking-puntos">{equipo.puntos}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
