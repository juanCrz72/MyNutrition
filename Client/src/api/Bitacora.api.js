import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todas las entradas de la bitácora de comidas
/* export const getBitacoraComidas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Bitacora`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener la bitácora de comidas:", error.response?.data || error.message);
    throw new Error('Error al obtener la bitácora de comidas');
  }
}; */

export const getBitacoraComidas = async (idPersona = null) => {
  try {
    let url = `${BASE_URL}/Bitacora`;

    // Si se pasa un idPersona, agrega el parámetro a la URL
    if (idPersona) {
      url += `?idpersona=${idPersona}`;
    }

    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener la bitácora de comidas:", error.response?.data || error.message);
    throw new Error('Error al obtener la bitácora de comidas');
  }
};



// Crear una nueva entrada en la bitácora
export const createBitacoraComida = async (
  id_usuario,
  tipo_comida,
  id_alimento,
  fecha_registro,
  contador = 1
) => {
  try {
    const response = await axios.post(`${BASE_URL}/Bitacora/create`, {
      id_usuario,
      tipo_comida,
      contador,
      id_alimento,
      fecha_registro
    });
    return response.data; // Retorna el ID de la nueva entrada
  } catch (error) {
    console.error("Error al crear entrada en bitácora:", error.response?.data || error.message);
    throw new Error('Error al crear entrada en bitácora');
  }
};

// Actualizar una entrada existente en la bitácora
export const updateBitacoraComida = async (
  id,
  id_usuario,
  tipo_comida,
  id_alimento,
  fecha_registro,
  contador
) => {
  try {
    await axios.put(`${BASE_URL}/Bitacora/update/${id}`, {
      id_usuario,
      tipo_comida,
      id_alimento,
      fecha_registro,
      contador
    });
  } catch (error) {
    console.error("Error al actualizar entrada en bitácora:", error.response?.data || error.message);
    throw new Error('Error al actualizar entrada en bitácora');
  }
};

// Eliminar una entrada de la bitácora
export const deleteBitacoraComida = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/Bitacora/delete/${id}`);
  } catch (error) {
    console.error("Error al eliminar entrada de bitácora:", error.response?.data || error.message);
    throw new Error('Error al eliminar entrada de bitácora');
  }
};
