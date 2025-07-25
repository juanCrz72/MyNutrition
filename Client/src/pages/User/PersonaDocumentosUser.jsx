import React from 'react';
import { useAuth } from '../Superadmin/AuthContext.jsx';

const PersonaDocumentosUser = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <h1>Aquí van las fotos de la persona {user?.idPersona}</h1>
      
      <div className="info-box">
        <h2>ID de Persona para Filtrado</h2>
        <p className="id-display">{user?.idPersona}</p>
        <p>Usa este ID para filtrar en otras tablas relacionadas</p>
      </div>
    </div>
  );
};

export default PersonaDocumentosUser;

