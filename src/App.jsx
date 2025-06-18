import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import { Registro } from './components/Registro/Registro';
import Login from './components/Login/Login';
import Inicio from './components/Usuario/Inicio/Inicio';
import Pilotos from './components/Usuario/Pilotos/Pilotos';
import Equipos from './components/Usuario/Equipos/Equipos';
import Calendario from './components/Usuario/Calendario/Calendario';
import Entradas from './components/Usuario/Entradas/Entradas';
import Admin from './components/Admin/Admin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';
import AdminPilotos from './components/Admin/Pilotos/AdminPilotos';
import AdminEquipos from './components/Admin/Equipos/AdminEquipos';
import AdminCalendario from './components/Admin/Calendario/AdminCalendario';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
          <Route path="/pilotos" element={<ProtectedRoute><Pilotos /></ProtectedRoute>} />
          <Route path="/equipos" element={<ProtectedRoute><Equipos /></ProtectedRoute>} />
          <Route path="/calendario" element={<ProtectedRoute><Calendario /></ProtectedRoute>} />
          <Route path="/entradas" element={<ProtectedRoute><Entradas /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
