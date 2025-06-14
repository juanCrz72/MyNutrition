import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todos los países
export const getPaises = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/paises`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los países:", error.response?.data || error.message);
    throw new Error('Error al obtener los países');
  }
};

// Crear un nuevo país
export const createPais = async (nombre_pais, activo) => {
  try {
    await axios.post(`${BASE_URL}/paises/create`, { nombre_pais, activo });
  } catch (error) {
    console.error("Error al registrar el país:", error.response?.data || error.message);
    throw new Error('Error al registrar el país');
  }
};

// Actualizar un país
export const updatePais = async (idPais, nombre_pais, activo) => {
  try {
    await axios.put(`${BASE_URL}/paises/update/${idPais}`, { nombre_pais, activo });
  } catch (error) {
    console.error("Error al actualizar el país:", error.response?.data || error.message);
    throw new Error('Error al actualizar el país');
  }
};

// Eliminar un país
export const deletePais = async (idPais) => {
  try {
    await axios.delete(`${BASE_URL}/paises/delete/${idPais}`);
  } catch (error) {
    console.error("Error al eliminar el país:", error.response?.data || error.message);
    throw new Error('Error al eliminar el país');
  }
};
