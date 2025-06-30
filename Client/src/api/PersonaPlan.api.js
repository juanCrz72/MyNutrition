import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todos los planes de personas con filtro opcional de estado activo
export const getPersonasPlanes = async (activo) => {
  try {
    const params = {};
    if (activo !== undefined) {
      params.activo = activo ? 1 : 0;
    }

    const response = await axios.get(`${BASE_URL}/PersonaPlan`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los planes:", error.response?.data || error.message);
    throw new Error('Error al obtener los planes');
  }
};

// Crear un nuevo plan para una persona
export const createPersonaPlan = async (idPersona, idPlan) => {
  try {
    const response = await axios.post(`${BASE_URL}/PersonaPlan/create`, { 
      idPersona, 
      idPlan 
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al crear el plan:", error.response?.data || error.message);
    throw new Error('Error al crear el plan');
  }
};

// Actualizar un plan existente
export const updatePersonaPlan = async (id, idPlan, activo_plan) => {
  try {
    const response = await axios.put(`${BASE_URL}/PersonaPlan/update/${id}`, { 
      idPlan,
      activo_plan 
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar el plan:", error.response?.data || error.message);
    throw new Error('Error al actualizar el plan');
  }
};

// Desactivar un plan (borrado lógico)
export const deactivatePlan = async (id) => {
  try {
    await axios.put(`${BASE_URL}/PersonaPlan/desactivate/${id}`);
  } catch (error) {
    console.error("Error al desactivar el plan:", error.response?.data || error.message);
    throw new Error('Error al desactivar el plan');
  }
};

// Eliminar un plan físicamente
export const deletePersonaPlan = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/PersonaPlan/delete/${id}`);
  } catch (error) {
    console.error("Error al eliminar el plan:", error.response?.data || error.message);
    throw new Error('Error al eliminar el plan');
  }
};

// Obtener planes activos de una persona específica
/* export const getPlanesByPersona = async (idPersona) => {
  try {
    const response = await axios.get(`${BASE_URL}/PersonaPlan/persona/${idPersona}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los planes de la persona:", error.response?.data || error.message);
    throw new Error('Error al obtener los planes de la persona');
  }
}; */

// Obtener planes que están por expirar (en los próximos X días)
/* export const getPlanesPorExpirar = async (dias = 7) => {
  try {
    const response = await axios.get(`${BASE_URL}/persona-plan/por-expirar`, {
      params: { dias }
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener planes por expirar:", error.response?.data || error.message);
    throw new Error('Error al obtener planes por expirar');
  }
}; */