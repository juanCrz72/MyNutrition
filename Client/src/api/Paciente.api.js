import axios from 'axios';

import { BASE_URL } from './config.js'; 

// Obtener todas los pacientes
export const getPaciente = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Paciente`); // Realiza una solicitud HTTP a la API de la base de datos
      return response.data.data; // Retorna los datos de los periodos
    } catch (error) {
      console.error("Error al obtener los pacientes:", error.response?.data || error.message);
      throw new Error('Error al obtener los pacientes');
    }
  };


// Crear un nuevo paciente
export const createPaciente = async (nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, fechaRegistro) => {
    try {
      await axios.post(`${BASE_URL}/Paciente/create`, { nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, fechaRegistro });
    } catch (error) {
      console.error("Error al registrar el paciente:", error.response?.data || error.message);
      throw new Error('Error al registrar el paciente');
    }
  };

// Actualizar un paciente existente
export const updatePaciente = async (idPaciente, nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones) => {
    try {
      await axios.put(`${BASE_URL}/Paciente/update/${idPaciente}`, { nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones });
    } catch (error) {
      console.error("Error al actualizar el paciente:", error.response?.data || error.message);
      throw new Error('Error al actualizar el paciente');
    }
  };

// Eliminar un paciente
export const deletePaciente = async (idPaciente) => {
    try {
      await axios.delete(`${BASE_URL}/Paciente/delete/${idPaciente}`);
    } catch (error) {
      console.error("Error al eliminar el paciente:", error.response?.data || error.message);
      throw new Error('Error al eliminar el paciente');
    }
  };