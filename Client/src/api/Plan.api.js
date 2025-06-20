import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todos los planes
export const getCat_plan = async () => {   
  try {
    const response = await axios.get(`${BASE_URL}/Cat_plan`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los planes:", error.response?.data || error.message);
    throw new Error('Error al obtener los planes');
  }
};

// Crear un nuevo plan
export const createCat_Plan = async (planData) => {
    try {
        const response = await axios.post(`${BASE_URL}/Cat_plan/create`, planData);
        return response.data;
    } catch (error) {
        console.error("Error al registrar el plan:", error.response?.data || error.message);
        throw new Error('Error al registrar el plan');
    }
    };

    // Actualizar un plan
    export const updateCat_Plan = async (id, planData) => {
        try {
            const response = await axios.put(`${BASE_URL}/Cat_plan/update/${id}`, planData);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar el plan:", error.response?.data || error.message);
            throw new Error('Error al actualizar el plan');
        }
    };

    // Eliminar un plan
    export const deleteCat_Plan = async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/Cat_plan/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar el plan:", error.response?.data || error.message);
            throw new Error('Error al eliminar el plan');
        }
    };