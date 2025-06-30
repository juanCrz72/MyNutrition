import axios from 'axios';
import { BASE_URL } from './config';

export const subirImagenAlimento = async (idAlimento, file) => {
  const formData = new FormData();
  formData.append('imagen', file);
  formData.append('idAlimento', idAlimento);

  const response = await axios.post(`${BASE_URL}/DocumentosAlimentos/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/* export const obtenerImagenAlimento = async (idAlimento) => {
  try {
    const response = await axios.get(`${BASE_URL}/DocumentosAlimentos/imagen/${idAlimento}`);
    return response.data.imagen;
  } catch {
    return null;
  }
}; */

export const obtenerImagenAlimento = async (idAlimento) => {
  try {
    const response = await axios.get(`${BASE_URL}/DocumentosAlimentos/imagen/${idAlimento}`);
    // Asegúrate de devolver el objeto completo, no solo la localización
    return response.data.imagen || null; // Cambia esto según lo que realmente devuelve tu backend
  } catch {
    return null;
  }
};

export const obtenerTodasLasImagenesAlimentos = async () => {
  const response = await axios.get(`${BASE_URL}/DocumentosAlimentos/imagenes`);
  return response.data;
};

export const eliminarImagenAlimentoPorId = async (id) => {
  const response = await axios.delete(`${BASE_URL}/DocumentosAlimentos/imagen/${id}`);
  return response.data;
};