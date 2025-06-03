import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Registro from './components/Registro/Registro';
import Login from './components/Login/Login';
import Inicio from './components/Inicio/Inicio';
import Pilotos from './components/Pilotos/Pilotos';
import Equipos from './components/Equipos/Equipos';
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
          <Route path="/pilotos" element={<Pilotos />} />
          <Route path="/equipos" element={<Equipos />} />
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
