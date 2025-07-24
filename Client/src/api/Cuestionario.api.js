import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todos los cuestionarios
export const getQuestionarios = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Cuestionario`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los cuestionarios:", error.response?.data || error.message);
    throw new Error('Error al obtener los cuestionarios');
  }
};

// Obtener cuestionario por ID de persona
export const getQuestionarioByPersonaId = async (id_persona) => {
  try {
    const response = await axios.get(`${BASE_URL}/Cuestionario/${id_persona}`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener el cuestionario:", error.response?.data || error.message);
    throw new Error('Error al obtener el cuestionario');
  }
};



// Crear un nuevo cuestionario
export const createQuestionario = async (
  id_persona,
  act_fisica,
  diabetes,
  hipertension,
  otra_enfermedad,
  toma_medicamento,
  medicamento_descrip = '',
  consumo_calorias,
  calorias_descrip = '',
  alergias = '',
  metas = ''
) => {

  console.log('Datos enviados a la API:', {
    id_persona,
    act_fisica,
    diabetes,
    hipertension,
    otra_enfermedad,
    toma_medicamento,
    medicamento_descrip,
    consumo_calorias,
    calorias_descrip,
    alergias,
    metas
  });

  try {
    await axios.post(`${BASE_URL}/Cuestionario`, {
      id_persona,
      act_fisica,
      diabetes,
      hipertension,
      otra_enfermedad,
      toma_medicamento,
      medicamento_descrip,
      consumo_calorias,
      calorias_descrip,
      alergias,
      metas
    });
    
  } catch (error) {
    console.error("Error al registrar el cuestionario:", error.response?.data || error.message);
    throw new Error('Error al registrar el cuestionario');
  }
};

// Actualizar un cuestionario existente
export const updateQuestionario = async (
  id,
  act_fisica,
  diabetes,
  hipertension,
  otra_enfermedad,
  toma_medicamento,
  medicamento_descrip = '',
  consumo_calorias,
  calorias_descrip = '',
  alergias = '',
  metas = ''
) => {
  try {
    await axios.put(`${BASE_URL}/Cuestionario/${id}`, {
      act_fisica,
      diabetes,
      hipertension,
      otra_enfermedad,
      toma_medicamento,
      medicamento_descrip,
      consumo_calorias,
      calorias_descrip,
      alergias,
      metas
    });
  } catch (error) {
    console.error("Error al actualizar el cuestionario:", error.response?.data || error.message);
    throw new Error('Error al actualizar el cuestionario');
  }
};

// Eliminar un cuestionario
export const deleteQuestionario = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/Cuestionario/${id}`);
  } catch (error) {
    console.error("Error al eliminar el cuestionario:", error.response?.data || error.message);
    throw new Error('Error al eliminar el cuestionario');
  }
};