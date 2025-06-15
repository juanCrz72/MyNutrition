import Swal from 'sweetalert2';
import {
  getAlimentos,
  createAlimento,
  updateAlimento,
  deleteAlimento
} from "../../api/Alimentos.api.js";

// Obtener alimentos
export const getAlimentosjs = async (setAlimentosjs) => {
  try {
    const data = await getAlimentos();
    setAlimentosjs(data);
  } catch (error) {
    console.error('Error al obtener los alimentos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los alimentos.',
    });
  }
};

// Crear alimento
export const createAlimentojs = async (alimentoData, setShowModal, getAlimentosjs) => {
  try {
    await createAlimento(alimentoData);
    getAlimentosjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Alimento registrado correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al agregar el alimento:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema registrando el alimento.',
    });
  }
};

// Actualizar alimento
export const updateAlimentojs = async (id, alimentoData, setShowEditModal, getAlimentosjs) => {
  try {
    await updateAlimento(id, alimentoData);
    getAlimentosjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Alimento actualizado correctamente',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar el alimento:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema actualizando el alimento.',
    });
  }
};

// Eliminar alimento 
export const deleteAlimentojs = async (id, setShowDeleteModal, getAlimentosjs) => {
  try {
    await deleteAlimento(id);
    getAlimentosjs();
    Swal.fire(
      '¡Eliminado!',
      'El alimento ha sido eliminado.',
      'success'
    );
    setShowDeleteModal(false);
  } catch (error) {
    console.error('Error al eliminar el alimento:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema eliminando el alimento.',
    });
  }
};
