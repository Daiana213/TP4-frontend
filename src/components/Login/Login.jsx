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
  const [formData, setFormData] = useState({ email: '', contrasena: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};

    if (!formData.email.trim()) formErrors.email = 'El email es obligatorio';
    if (!formData.contrasena.trim()) formErrors.contrasena = 'La contraseña es obligatoria';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Respuesta login:', data);

      if (!response.ok) {
        setErrors({ general: data.error || 'Error en el inicio de sesión' });
        return;
      }

      if (!data.token || !data.usuario) {
        setErrors({ general: 'Respuesta inválida del servidor' });
        return;
      }

      login(data.usuario, data.token);
      localStorage.setItem('token', data.token);

      navigate(data.usuario.isAdmin ? '/admin' : '/inicio');
    } catch (err) {
      console.error('Error en login:', err);
      setErrors({ general: 'Error al conectar con el servidor' });
    }
  };

  return (
    <div className="login-container">
      <Header />
      <div className="login-form">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && <div className="error-message general">{errors.general}</div>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={formData.contrasena}
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
