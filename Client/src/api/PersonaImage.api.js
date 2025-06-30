import axios from 'axios';
import { BASE_URL } from './config';

export const getPersonas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/PersonaImage`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener personas:", error);
    throw error;
  }
};

export const getPersonaById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/PersonaImage/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener persona:", error);
    throw error;
  }
};

export const createPersona = async (personaData) => {
  try {
    const formData = new FormData();
    
    // Agregar campos al formData
    Object.keys(personaData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, personaData[key]);
      }
    });
    
    // Agregar la imagen si existe
    if (personaData.image) {
      formData.append('image', personaData.image);
    }

    const response = await axios.post(`${BASE_URL}/PersonaImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear persona:", error);
    throw error;
  }
};

export const updatePersona = async (id, personaData) => {
  try {
    const formData = new FormData();
    
    // Agregar campos al formData
    Object.keys(personaData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, personaData[key]);
      }
    });
    
    // Agregar la imagen si existe
    if (personaData.image) {
      formData.append('image', personaData.image);
    }

    const response = await axios.put(`${BASE_URL}/PersonaImage/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar persona:", error);
    throw error;
  }
};

export const deletePersona = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/PersonaImage/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar persona:", error);
    throw error;
  }
};