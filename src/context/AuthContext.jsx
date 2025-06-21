import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
  
    // También podés usar JSON.parse si guardas objetos
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userIsAdmin = localStorage.getItem('userIsAdmin') === 'true';
  
    if (userId && userEmail && userName) {
      setCurrentUser({
        id: userId,
        email: userEmail,
        nombre: userName,
      });
      setIsAuthenticated(true);
      setIsAdmin(userIsAdmin);
    }
    setLoading(false);
  }, []);
  

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.nombre);
    localStorage.setItem('userIsAdmin', userData.isAdmin || false);
    
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.isAdmin || false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userIsAdmin');
    
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const value = {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};