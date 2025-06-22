import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import { Registro } from './components/Registro/Registro';
import Login from './components/Login/Login';
import Inicio from './components/Usuario/Inicio/Inicio';
import Pilotos from './components/Usuario/Pilotos/Pilotos';
import Equipos from './components/Usuario/Equipos/Equipos';
import Calendario from './components/Usuario/Calendario/Calendario';
import Entradas from './components/Usuario/Entradas/Entradas';
import Admin from './components/Admin/Inicio/Admin';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/AdminRoute/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';
import AdminPilotos from './components/Admin/Pilotos/AdminPilotos';
import AdminEquipos from './components/Admin/Equipos/AdminEquipos';
import AdminCalendario from './components/Admin/Calendario/AdminCalendario';
import DetalleEntrada from './components/Usuario/Entradas/DetalleEntrada';
import EditarEntrada from './components/Usuario/Entradas/EditarEntrada';
import NuevaEntrada from './components/Usuario/Entradas/NuevaEntrada';
import Puestos from './components/Usuario/Puestos/Puestos';


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
          <Route path="/admin/pilotos" element={<AdminRoute><AdminPilotos /></AdminRoute>} />
          <Route path="/admin/equipos" element={<AdminRoute><AdminEquipos /></AdminRoute>} />
          <Route path="/admin/calendario" element={<AdminRoute><AdminCalendario /></AdminRoute>} />
          <Route path="/detalleentrada/:id" element={<ProtectedRoute><DetalleEntrada /></ProtectedRoute>} />
          <Route path="/editarentrada/:id" element={<ProtectedRoute><EditarEntrada /></ProtectedRoute>} />
          <Route path="/nuevaentrada" element={<ProtectedRoute><NuevaEntrada /></ProtectedRoute>} />
          <Route path="/puestos" element={<ProtectedRoute><Puestos /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
