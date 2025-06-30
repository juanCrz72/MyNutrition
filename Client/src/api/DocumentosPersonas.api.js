import axios from 'axios';
import { BASE_URL } from './config';

export const subirImagenPersona = async (idPersona, file) => {
  const formData = new FormData();
  formData.append('imagen', file);
  formData.append('idPersona', idPersona);

  const response = await axios.post(`${BASE_URL}/DocumentosPersonas/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/* export const obtenerImagenPersona = async (idPersona) => {
  try {
    const response = await axios.get(`${BASE_URL}/DocumentosPersonas/imagen/${idPersona}`);
    return response.data.imagen;
  } catch {
    return null;
  }
}; */

export const obtenerImagenPersona = async (idPersona) => {
  try {
    const response = await axios.get(`${BASE_URL}/DocumentosPersonas/imagen/${idPersona}`);
    
    // Debug: Verifica la estructura de la respuesta
    console.log('Respuesta completa:', response);
    
    // Devuelve un array de imágenes o array vacío si no hay
    return response.data?.imagenes || [];
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    return [];
  }
};



export const obtenerTodasLasImagenes = async () => {
  const response = await axios.get(`${BASE_URL}/DocumentosPersonas/imagenes`);
  return response.data;
};

/* export const eliminarImagenPorId = async (id) => {
  const response = await axios.delete(`${BASE_URL}/DocumentosPersonas/imagen/${id}`);
  return response.data;
};
 */

export const eliminarImagenPorId = async (rutaImagen) => {
  const url = `${BASE_URL}/DocumentosPersonas/imagen/${rutaImagen}`;

  // Opcional: también puedes loguearlo por consola
  console.log('Eliminando imagen con URL:', url);

  const response = await axios.delete(url);
  return response.data;
};

