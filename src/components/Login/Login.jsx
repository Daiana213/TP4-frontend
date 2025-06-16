import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { API_ENDPOINTS } from '../../../config/api';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    contrasena: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validación del lado del cliente
    let formErrors = {};
    if (!formData.email) {
      formErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = 'Formato de email inválido';
    }

    if (!formData.contrasena) {
      formErrors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena.length < 6) {
      formErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          contrasena: formData.contrasena
        })
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        setErrors({ general: data.error || 'Error en el inicio de sesión' });
        return;
      }

      if (!data.usuario) {
        setErrors({ general: 'Error al obtener datos del usuario' });
        return;
      }

      // Usar el método login del contexto
      login(data.usuario, data.token);

      // Redirigir según el rol del usuario
      if (data.usuario.isAdmin) {
        navigate('/admin'); 
      } else {
        login(data.usuario, data.token);
        navigate('/inicio');
      }
    } catch (error) {
      setErrors({ general: 'Error al conectar con el servidor' });
    }
  };

  return (
    <div className="login-container">
      <Header />
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message general">{errors.general}</div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena || ''}
              onChange={handleChange}
              className={errors.contrasena ? 'error' : ''}
            />
            {errors.contrasena && <span className="error-message">{errors.contrasena}</span>}
          </div>

          <button type="submit" className="submit-button">Iniciar Sesión</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
