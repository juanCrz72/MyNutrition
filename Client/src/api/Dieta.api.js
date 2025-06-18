import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todas las dietas
export const getPersonasDietas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Dietas`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener las dietas:", error.response?.data || error.message);
    throw new Error('Error al obtener las dietas');
  }
};

// Crear una nueva dieta
export const createPersonaDieta = async (
  idPersona, 
  calorias, 
  grasas, 
  carbohidratos, 
  proteinas, 
  peso_actual
) => {
  try {
    await axios.post(`${BASE_URL}/Dietas/create`, { 
      idPersona, 
      calorias, 
      grasas, 
      carbohidratos, 
      proteinas, 
      peso_actual 
    });
  } catch (error) {
    console.error("Error al registrar la dieta:", error.response?.data || error.message);
    throw new Error('Error al registrar la dieta');
  }
};

// Actualizar una dieta existente
export const updatePersonaDieta = async (
  id,
  calorias,
  grasas,
  carbohidratos,
  proteinas,
  peso_actual,
  activo
) => {
  try {
    await axios.put(`${BASE_URL}/Dietas/update/${id}`, { 
      calorias,
      grasas,
      carbohidratos,
      proteinas,
      peso_actual,
      activo
    });
  } catch (error) {
    console.error("Error al actualizar la dieta:", error.response?.data || error.message);
    throw new Error('Error al actualizar la dieta');
  }
};

// Desactivar una dieta (borrado lógico)
export const deactivateDieta = async (id) => {
  try {
    await axios.patch(`${BASE_URL}/Dietas/deactivate/${id}`);
  } catch (error) {
    console.error("Error al desactivar la dieta:", error.response?.data || error.message);
    throw new Error('Error al desactivar la dieta');
  }
};

// Eliminar físicamente una dieta
export const deletePersonaDieta = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/Dietas/delete/${id}`);
  } catch (error) {
    console.error("Error al eliminar la dieta:", error.response?.data || error.message);
    throw new Error('Error al eliminar la dieta');
  }
};

