import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todos los usuarios
export const getUsuarios = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Usuarios`);
        return response.data.data; // Retorna solo el array de usuarios
    } catch (error) {
        console.error("Error al obtener los usuarios:", error.response?.data || error.message);
        throw new Error('Error al obtener los usuarios');
    }
    };

//Filtrar usuario por ID 
    export const getUsuario = async (idusuario) => {
    try {
        const response = await axios.get(`${BASE_URL}/Usuarios/${idusuario}`);
        return response.data.data; // Retorna el usuario individual
    } catch (error) {
        console.error("Error al obtener el usuario:", error.response?.data || error.message);
        throw new Error('Error al obtener el usuario');
    }
};


    // Crear un nuevo usuario
    export const createUsuario = async (usuarioData) => {
        try {
            await axios.post(`${BASE_URL}/Usuarios/create`, usuarioData);
        } catch (error) {
            console.error("Error al registrar el usuario:", error.response?.data || error.message);
            throw new Error('Error al registrar el usuario');
        }
    };

    // Actualizar un usuario existente
    export const updateUsuario = async (idusuario, usuarioData) => {
        try {
            await axios.put(`${BASE_URL}/Usuarios/update/${idusuario}`, usuarioData);
        } catch (error) {
            console.error("Error al actualizar el usuario:", error.response?.data || error.message);
            throw new Error('Error al actualizar el usuario');
        }
    };

    

    // Eliminar un usuario
    export const deleteUsuario = async (idusuario) => {
        try {
            await axios.delete(`${BASE_URL}/Usuarios/delete/${idusuario}`);
        } catch (error) {
            console.error("Error al eliminar el usuario:", error.response?.data || error.message);
            throw new Error('Error al eliminar el usuario');
        }
    };