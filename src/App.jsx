import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import { Registro } from './components/Registro/Registro';
import Login from './components/Login/Login';
import Inicio from './components/Usuario/Inicio/Inicio';
import Pilotos from './components/Usuario/Pilotos/Pilotos';
import Equipos from './components/Usuario/Equipos/Equipos';
import Calendario from './components/Usuario/Calendario/Calendario';
import Admin from './components/Admin/Admin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={
            <ProtectedRoute>
              <Inicio />
            </ProtectedRoute>
          } />
           <Route path="/pilotos" element={
            <ProtectedRoute>
              <Pilotos />
            </ProtectedRoute>
          } />
          
          <Route path="/equipos" element={
            <ProtectedRoute>
              <Equipos />
            </ProtectedRoute>
          } />
          
          <Route path="/calendario" element={
            <ProtectedRoute>
              <Calendario />
            </ProtectedRoute>
          } />

           <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />

          <Route path="/admin/pilotos" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />

          <Route path="/admin/equipos" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />

          <Route path="/admin/calendario" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
