import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from  './pages/Superadmin/ProtectedRoute.jsx';

import Home from './pages/Superadmin/home.jsx';
import Login from './pages/Superadmin/Login.jsx';
import Register from './pages/Superadmin/Register.jsx';

// -------------------- Gestión de Usuarios -------------------- //
import PerfilPage from './pages/Superadmin/PerfilPage.jsx';
import CambiarContrasena from './pages/Superadmin/CambiarContrasenaPage.jsx';

// -------------------- Gestión Pacientes -------------------- //
// import Paciente from './pages/Superadmin/Paciente';
import Bitacora from './pages/Superadmin/Bitacora.jsx';
import Persona from './pages/Superadmin/Persona.jsx';
//import PersonaBitacora from './pages/Superadmin/PersonaBitacora.jsx';
import Dieta from './pages/Superadmin/Dieta.jsx';
import PersonaPlan from './pages/Superadmin/PersonaPlan.jsx';
import Perfiles from './pages/Superadmin/Perfiles.jsx';
import Cuestionario from './pages/Superadmin/Cuestionario.jsx';

// -------------------- Gestión Alimentos -------------------- //
import Pais from './pages/Superadmin/Paises.jsx';
import Alimentos from './pages/Superadmin/Alimentos.jsx';
import Plan from './pages/Superadmin/Plan.jsx'
import GestionPacientes from './pages/Superadmin/GestionPaciente.jsx';
import DocumentosPersonas from './pages/Superadmin/DocumentosPersonas.jsx';
import DocumentosAlimentos from './pages/Superadmin/DocumentosAlimentos.jsx';
import PersonaImage from './pages/Superadmin/PersonaImage.jsx';
import AlimentosImages from './pages/Superadmin/AlimentosImages.jsx';
import GestionUsuarios from './pages/Superadmin/Usuarios.jsx';
import Reportes from './pages/Superadmin/registroComidas.jsx'; 

// --------------------  Usuarios -------------------- //
import Usuarios from './pages/User/User.jsx';
import CuestionarioUser from './pages/User/CuestionarioUser.jsx';
import PersonaUser from './pages/User/PersonaUser.jsx';
import BitacoraUser from './pages/User/BitacoraUser.jsx';
import DietaUser from './pages/User/DietaUser.jsx';
import PlanUser from './pages/User/PlanUser.jsx';
import DocumentosPersonasUser from './pages/User/PersonaDocumentosUser.jsx'; 

// -------------------- Gestión de Usuarios -------------------- //
import NotFound from './pages/Superadmin/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas protegidas para Superadmin (rol 1) */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Home />
        </ProtectedRoute>
      } />

        <Route path="/CambiarContrasena" element={
        <ProtectedRoute allowedRoles={[1,2]}>
          <CambiarContrasena />
        </ProtectedRoute>
      } />

        <Route path="/Perfil" element={
        <ProtectedRoute allowedRoles={[1,2]}>
          <PerfilPage />
        </ProtectedRoute>
      } />
      
{/*       <Route path="/pacientes" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Paciente />
        </ProtectedRoute>
      } /> */}
      
      <Route path="/paises" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Pais />
        </ProtectedRoute>
      } />
      
      <Route path="/Alimentos" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Alimentos />
        </ProtectedRoute>
      } />
      
      <Route path="/personas" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Persona />
        </ProtectedRoute>
      } />
      
 <Route path="/PersonaBitacora/:idpersona" element={
        <ProtectedRoute allowedRoles={[1]}>
          <PersonaBitacora />
        </ProtectedRoute>
      } /> 


       <Route path="/personaBitacora/:id_usuario" element={
        <ProtectedRoute allowedRoles={[1]}>
          <PersonaBitacora />
        </ProtectedRoute>
      } />
*/}

        <Route path="/personaBitacora/:id_usuario" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Bitacora />
        </ProtectedRoute>
      } />
      
      <Route path="/plan" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Plan />
        </ProtectedRoute>
      } />
      
      <Route path="/gestionPacientes" element={
        <ProtectedRoute allowedRoles={[1]}>
          <GestionPacientes />
        </ProtectedRoute>
      } />
      
      <Route path="/dieta" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Dieta />
        </ProtectedRoute>
      } />
      
      <Route path="/personaPlan" element={
        <ProtectedRoute allowedRoles={[1]}>
          <PersonaPlan />
        </ProtectedRoute>
      } />
      
      <Route path="/DocumentosPersonas" element={
        <ProtectedRoute allowedRoles={[1]}>
          <DocumentosPersonas />
        </ProtectedRoute>
      } />
      
      <Route path="/DocumentosAlimentos" element={
        <ProtectedRoute allowedRoles={[1]}>
          <DocumentosAlimentos />
        </ProtectedRoute>
      } />
      
      <Route path="/PersonaImage" element={
        <ProtectedRoute allowedRoles={[1]}>
          <PersonaImage />
        </ProtectedRoute>
      } />
      
      <Route path="/AlimentosImages" element={
        <ProtectedRoute allowedRoles={[1]}>
          <AlimentosImages />
        </ProtectedRoute>
      } />

         <Route path="/reportes" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Reportes />
        </ProtectedRoute>
      } />


           <Route path="/Perfiles" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Perfiles />
        </ProtectedRoute>
      } />

    <Route path="/GestionUsuarios" element={
        <ProtectedRoute allowedRoles={[1]}>
          <GestionUsuarios />
        </ProtectedRoute>
      } />


      <Route path="/Cuestionario" element={
        <ProtectedRoute allowedRoles={[1]}>
          <Cuestionario />
        </ProtectedRoute>
      } />


      {/* ---------------------------------------------- Ruta para Usuarios normales (rol 2) -------------------------------------------------------------------------------*/}
      <Route path="/usuarios" element={
        <ProtectedRoute allowedRoles={[2]}>
          <Usuarios />
        </ProtectedRoute>
      } />

      <Route path="/vistaCuestionario" element={
        <ProtectedRoute allowedRoles={[2]}>
          <CuestionarioUser />
        </ProtectedRoute>
      } />

  <Route path="/PersonaUser" element={
        <ProtectedRoute allowedRoles={[2]}>
          <PersonaUser />
        </ProtectedRoute>
      } />

      <Route path="/bitacoraUser" element={
        <ProtectedRoute allowedRoles={[2]}>
          <BitacoraUser />
        </ProtectedRoute>
      } />

      <Route path="/dietaUser" element={
        <ProtectedRoute allowedRoles={[2]}> 
          <DietaUser />
        </ProtectedRoute>
      } />

      <Route path="/planUser" element={
        <ProtectedRoute allowedRoles={[2]}>
          <PlanUser />
        </ProtectedRoute>
      } />

      <Route path="/DocumentosUser" element={
        <ProtectedRoute allowedRoles={[2]}>
          <DocumentosPersonasUser />
        </ProtectedRoute> 
      } />

      
      {/* ---------------------------------------------- Ruta para manejar 404 Not Found ---------------------------------------------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
