import React from 'react';
import { useAuth } from '../Superadmin/AuthContext.jsx';

const BitacoraUser = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <h1>Aquí va mi bitácora idPersona: {user?.idPersona} --- y este es el id usuario: {user?.id_usuario}</h1>
      
      <div className="info-box">
        <h2>ID de Persona para Filtrado</h2>
        <p className="id-display">{user?.idPersona}</p>
        <p>Usa este ID para filtrar en otras tablas relacionadas</p>
      </div>
    </div>
  );
};

export default BitacoraUser;


