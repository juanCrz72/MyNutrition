import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todos los alimentos
export const getAlimentos = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/alimentos`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los alimentos:", error.response?.data || error.message);
    throw new Error('Error al obtener los alimentos');
  }
};

// Crear un nuevo alimento
export const createAlimento = async (alimentoData) => {
  try {
    const response = await axios.post(`${BASE_URL}/alimentos/create`, alimentoData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar el alimento:", error.response?.data || error.message);
    throw new Error('Error al registrar el alimento');
  }
};

// Actualizar un alimento
export const updateAlimento = async (id, alimentoData) => {
  try {
    const response = await axios.put(`${BASE_URL}/alimentos/update/${id}`, alimentoData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el alimento:", error.response?.data || error.message);
    throw new Error('Error al actualizar el alimento');
  }
};

// Eliminar un alimento
export const deleteAlimento = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/alimentos/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el alimento:", error.response?.data || error.message);
    throw new Error('Error al eliminar el alimento');
  }
};