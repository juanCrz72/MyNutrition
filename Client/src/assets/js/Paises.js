import Swal from 'sweetalert2';

import {
  getPaises,
  createPais,
  updatePais,
  deletePais
} from "../../api/Paises.api.js";


export const getPaisesjs = async (setPaisesjs) => {
  try {
    const data = await getPaises();
    setPaisesjs(data);
  } catch (error) {
    console.error('Error al obtener los países:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los países.',
    });
  }
};


export const createPaisjs = async (nombre_pais, activo, setShowModal, getPaisesjs) => {
  try {
    await createPais(nombre_pais, activo);
    getPaisesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'País registrado correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al agregar el país:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema registrando el país.',
    });
  }
};


export const updatePaisjs = async (idPais, nombre_pais, activo, setShowEditModal, getPaisesjs) => {
  try {
    await updatePais(idPais, nombre_pais, activo);
    getPaisesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'País actualizado correctamente',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar el país:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema actualizando el país.',
    });
  }
};


export const deletePaisjs = async (idPais, setShowDeleteModal, getPaisesjs) => {
  try {
    await deletePais(idPais);
    getPaisesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'País eliminado correctamente',
    });
    setShowDeleteModal(false);
  } catch (error) {
    console.error('Error al eliminar el país:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema eliminando el país.',
    });
  }
};
