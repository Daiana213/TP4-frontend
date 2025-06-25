import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import { apiService } from '../../../config/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', contrasena: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // limpia errores campo a campo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};

    if (!formData.email.trim()) {
      formErrors.email = 'Por favor, ingresa tu correo electrónico.';
    }

    if (!formData.contrasena.trim()) {
      formErrors.contrasena = 'Por favor, ingresa tu contraseña.';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const data = await apiService.login(formData);

      if (!data.token || !data.usuario) {
        setErrors({ general: 'No se pudo iniciar sesión. Intenta nuevamente.' });
        return;
      }

      login(data.usuario, data.token);
      localStorage.setItem('token', data.token);
      navigate(data.usuario.isAdmin ? '/admin' : '/inicio');
    } catch (err) {
      console.error('Error en login:', err);
      setErrors({ general: err.message || 'Error al conectar con el servidor' });
    }
  };

  return (
    <div className="login-container">
      <Header />
      <main>
        <div className="login-form">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            {errors.general && <div className="error-message">{errors.general}</div>}

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="ejemplo@correo.com"
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
                placeholder="********"
              />
              {errors.contrasena && <span className="error-message">{errors.contrasena}</span>}
            </div>

            <button type="submit" className="submit-button">Iniciar Sesión</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
