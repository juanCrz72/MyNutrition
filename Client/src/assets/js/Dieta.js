import Swal from 'sweetalert2';
import {
  getPersonasDietas,
  createPersonaDieta,
  updatePersonaDieta,
  deactivateDieta,
  deletePersonaDieta
} from "../../api/Dieta.api.js";

// Obtener dietas de personas
export const getPersonasDietasjs = async (setPersonasDietasjs) => {
  try {
    const data = await getPersonasDietas();
    setPersonasDietasjs(data);
  } catch (error) {
    console.error('Error al obtener las dietas:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo las dietas.',
    });
  }
};

// Crear dieta para persona
export const createPersonaDietajs = async (dietaData, setShowModal, getPersonasDietasjs) => {
  try {
    console.log('Datos enviados para registrar dieta:', dietaData);
    await createPersonaDieta(
      dietaData.idPersona,
      dietaData.calorias,
      dietaData.grasas,
      dietaData.carbohidratos,
      dietaData.proteinas,
      dietaData.peso_actual
    );
    getPersonasDietasjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Dieta registrada correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al registrar la dieta:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema registrando la dieta.',
    });
  }
};

// Actualizar dieta de persona
export const updatePersonaDietajs = async (id, dietaData, setShowEditModal, getPersonasDietasjs) => {
  try {
    await updatePersonaDieta(
      id,
      dietaData.calorias,
      dietaData.grasas,
      dietaData.carbohidratos,
      dietaData.proteinas,
      dietaData.peso_actual,
      dietaData.activo
    );
    getPersonasDietasjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Dieta actualizada correctamente',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar la dieta:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema actualizando la dieta.',
    });
  }
};

// Desactivar dieta (borrado lógico)
export const deactivateDietajs = async (id, setShowDeactivateModal, getPersonasDietasjs) => {
  try {
    await deactivateDieta(id);
    getPersonasDietasjs();
    Swal.fire(
      '¡Desactivada!',
      'La dieta ha sido desactivada.',
      'success'
    );
    setShowDeactivateModal(false);
  } catch (error) {
    console.error('Error al desactivar la dieta:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema desactivando la dieta.',
    });
  }
};

// Eliminar dieta físicamente
export const deletePersonaDietajs = async (id, setShowDeleteModal, getPersonasDietasjs) => {
  try {
    await deletePersonaDieta(id);
    getPersonasDietasjs();
    Swal.fire(
      '¡Eliminada!',
      'La dieta ha sido eliminada permanentemente.',
      'success'
    );
    setShowDeleteModal(false);
  } catch (error) {
    console.error('Error al eliminar la dieta:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema eliminando la dieta.',
    });
  }
};