import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { API_ENDPOINTS } from '../../../config/api';
import './Registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Add this handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    let errores = {};
    
    if (!formData.nombreCompleto.trim()) {
      errores.nombreCompleto = 'El nombre completo es requerido';
    }

    if (!formData.email) {
      errores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errores.email = 'El email no es válido';
    }

    if (!formData.password) {
      errores.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errores.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      errores.confirmPassword = 'Las contraseñas no coinciden';
    }

    return errores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarFormulario();
    
    if (Object.keys(errores).length === 0) {
      try {
        const response = await fetch(API_ENDPOINTS.registro, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombreCompleto, // Cambiar nombreCompleto a nombre
            email: formData.email,
            contrasena: formData.password // Asegurar que coincida con el backend
          })
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          setErrors({ general: data.error || 'Error en el registro' });
          return;
        }
  
        alert('Registro exitoso. Por favor, inicia sesión.');
        navigate('/login');
      } catch (error) {
        setErrors({ general: 'Error al conectar con el servidor' });
      }
    } else {
      setErrors(errores);
    }
  };  

  return (
    <div className="registro-container">
      <Header />
      <div className="registro-form">
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message general">{errors.general}</div>
          )}
          <div className="form-group">
            <label htmlFor="nombreCompleto">Nombre Completo</label>
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              className={errors.nombreCompleto ? 'error' : ''}
            />
            {errors.nombreCompleto && <span className="error-message">{errors.nombreCompleto}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="submit-button">Registrarse</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Registro;