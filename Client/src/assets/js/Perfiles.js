import Swal from 'sweetalert2';
import {
  getCat_perfiles,
  createCat_perfil,
  updateCat_perfil,
  deleteCat_perfil
} from "../../api/Perfiles.api.js";

export const getCat_perfilesjs = async (setCat_perfilesjs) => {
  try {
    const data = await getCat_perfiles();
    setCat_perfilesjs(data);
  } catch (error) {
    console.error('Error al obtener los perfiles:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los perfiles.',
    });
  }
};

export const createCat_perfiljs = async (perfilData, setShowModal, getCat_perfilesjs) => {
  try {
    await createCat_perfil(perfilData);
    getCat_perfilesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Perfil registrado correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al agregar el perfil:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema registrando el perfil.',
    });
  }
};

export const updateCat_perfiljs = async (id, perfilData, setShowEditModal, getCat_perfilesjs) => {
  try {
    await updateCat_perfil(id, perfilData);
    getCat_perfilesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Perfil actualizado correctamente',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema actualizando el perfil.',
    });
  }
};

export const deleteCat_perfiljs = async (id, getCat_perfilesjs) => {
  try {
    await deleteCat_perfil(id);
    getCat_perfilesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Perfil eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar el perfil:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema eliminando el perfil.',
    });
  }
};
