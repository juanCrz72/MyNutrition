import axios from 'axios';
import { BASE_URL } from './config.js';

export const getCat_perfiles = async () => {   
  try {
    const response = await axios.get(`${BASE_URL}/Cat_perfiles`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los perfiles:", error.response?.data || error.message);
    throw new Error('Error al obtener los perfiles');
  }
};

export const createCat_perfil = async (perfilData) => {
  try {
    const response = await axios.post(`${BASE_URL}/Cat_perfiles/create`, perfilData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar el perfil:", error.response?.data || error.message);
    throw new Error('Error al registrar el perfil');
  }
};

export const updateCat_perfil = async (id, perfilData) => {
  try {
    const response = await axios.put(`${BASE_URL}/Cat_perfiles/update/${id}`, perfilData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el perfil:", error.response?.data || error.message);
    throw new Error('Error al actualizar el perfil');
  }
};

export const deleteCat_perfil = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Cat_perfiles/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el perfil:", error.response?.data || error.message);
    throw new Error('Error al eliminar el perfil');
  }
};
