import { Routes, Route } from 'react-router-dom';

import Home from './pages/Superadmin/home.jsx';

// -------------------- Gestión Pacientes -------------------- //
import Paciente from './pages/Superadmin/Paciente';
import Persona from './pages/Superadmin/Persona.jsx';
import PersonaBitacora from './pages/Superadmin/PersonaBitacora.jsx';
import Dieta from './pages/Superadmin/Dieta.jsx';
import PersonaPlan from './pages/Superadmin/PersonaPlan.jsx';

// -------------------- Gestión Alimentos -------------------- //
import Pais from './pages/Superadmin/Paises.jsx';
import Alimentos from './pages/Superadmin/Alimentos.jsx';
import Plan from './pages/Superadmin/Plan.jsx'
import GestionPacientes from './pages/Superadmin/GestionPaciente.jsx';
import DocumentosPersonas from './pages/Superadmin/DocumentosPersonas.jsx';
import DocumentosAlimentos from './pages/Superadmin/DocumentosAlimentos.jsx';
import PersonaImage from './pages/Superadmin/PersonaImage.jsx';
import AlimentosImages from './pages/Superadmin/AlimentosImages.jsx';

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
      <Route path="/Alimentos" element={<Alimentos />} />
      <Route path="/personas" element={<Persona />} />
      {/* <Route path="/personaBitacora/:idpersona" element={<PersonaBitacora />} /> */}
       <Route path="/personaBitacora/:idpersona" element={<PersonaBitacora />} />
       <Route path="/plan" element={<Plan />} />
       <Route path="/gestionPacientes" element={<GestionPacientes />} />
      <Route path="/dieta" element={<Dieta />} />
      <Route path="/personaPlan" element={<PersonaPlan />} />
      <Route path="/DocumentosPersonas" element={<DocumentosPersonas />} />
      <Route path="/DocumentosAlimentos" element={<DocumentosAlimentos />} />
      <Route path="/PersonaImage" element={<PersonaImage />} />
      <Route path="/AlimentosImages" element={<AlimentosImages />} />

      
      
      {/* Ruta para manejar 404 Not Found */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
}

