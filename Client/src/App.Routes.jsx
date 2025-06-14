import { Routes, Route } from 'react-router-dom';

import Home from './pages/Superadmin/home.jsx';

// -------------------- Gestión Pacientes -------------------- //
import Paciente from './pages/Superadmin/Paciente';

// -------------------- Gestión Alimentos -------------------- //
import Pais from './pages/Superadmin/Paises.jsx';

// -------------------- Gestión de Usuarios -------------------- //
import NotFound from './pages/Superadmin/NotFound.jsx';
//import Login from './pages/Login/Login.jsx';

export default function AppRoutes() {
  return (
    <Routes>
{/*       <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/pacientes" element={<Paciente />} />
      <Route path="/paises" element={<Pais />} />
      
      
      {/* Ruta para manejar 404 Not Found */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
}

