import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todas las personas
export const getPersonas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Personas`);
    return response.data.data; // Retorna solo el array de personas
  } catch (error) {
    console.error("Error al obtener las personas:", error.response?.data || error.message);
    throw new Error('Error al obtener las personas');
  }
};

export const getPersonaById = async (idpersona) => {
  try {
    const response = await axios.get(`${BASE_URL}/Personas/${idpersona}`);
    return response.data.data; // Retorna solo el objeto de la persona
  } catch (error) {
    console.error(`Error al obtener la persona con ID ${idpersona}:`, error.response?.data || error.message);
    throw new Error('Error al obtener la persona por ID');
  }
};


// Crear una nueva persona
export const createPersona = async (personaData) => {
  try {
    await axios.post(`${BASE_URL}/Personas/create`, personaData);
  } catch (error) {
    console.error("Error al registrar la persona:", error.response?.data || error.message);
    throw new Error('Error al registrar la persona');
  }
};

// Actualizar una persona existente
export const updatePersona = async (idpersona, personaData) => {
  try {
    await axios.put(`${BASE_URL}/Personas/update/${idpersona}`, personaData);
  } catch (error) {
    console.error("Error al actualizar la persona:", error.response?.data || error.message);
    throw new Error('Error al actualizar la persona');
  }
};

// Eliminar una persona
export const deletePersona = async (idpersona) => {
  try {
    await axios.delete(`${BASE_URL}/Personas/delete/${idpersona}`);
  } catch (error) {
    console.error("Error al eliminar la persona:", error.response?.data || error.message);
    throw new Error('Error al eliminar la persona');
  }
};
