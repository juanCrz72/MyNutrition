import Swal from 'sweetalert2';
import {
  getBitacoraComidas,
  createBitacoraComida,
  updateBitacoraComida,
  deleteBitacoraComida
} from "../../api/Bitacora.api.js";

// Mostrar todas las entradas de la bitácora
/* export const getBitacoraComidasjs = async (setBitacoraData) => {
  try {
    const data = await getBitacoraComidas();
    setBitacoraData(data);
  } catch (error) {
    console.error('Error al obtener la bitácora de comidas:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los registros de comidas.',
    });
  }
}; */

// Esta es la función que conecta con el componente y maneja errores
/* export const getBitacoraComidasjs = async (setBitacoraData, idPersona = null) => {
  try {
    const data = await getBitacoraComidas(idPersona); // pasamos el idPersona
    setBitacoraData(data);
  } catch (error) {
    console.error('Error al obtener la bitácora de comidas:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los registros de comidas.',
    });
  }
}; */

// Cambiar el parámetro de idPersona a id_usuario
export const getBitacoraComidasjs = async (setBitacoraData, id_usuario = null) => {
  try {
    const data = await getBitacoraComidas(id_usuario); // pasamos el id_usuario
    setBitacoraData(data);
  } catch (error) {
    console.error('Error al obtener la bitácora de comidas:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los registros de comidas.',
    });
  }
};




// Crear nueva entrada en la bitácora
export const createBitacoraComidajs = async (
  id_usuario,
  tipo_comida,
  id_alimento,
  fecha_registro,
  contador,
  setShowModal,
  refreshData
) => {
  try {
    await createBitacoraComida(
      id_usuario,
      tipo_comida,
      id_alimento,
      fecha_registro,
      contador
    );
    
    await refreshData();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Registro de comida agregado correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al agregar registro de comida:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema registrando la comida.',
    });
  }
};

// Actualizar entrada en la bitácora
export const updateBitacoraComidajs = async (
  id,
  id_usuario,
  tipo_comida,
  id_alimento,
  fecha_registro,
  contador,
  setShowEditModal,
  refreshData
) => {
  try {
    await updateBitacoraComida(
      id,
      id_usuario,
      tipo_comida,
      id_alimento,
      fecha_registro,
      contador
    );
    
    await refreshData();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Registro de comida actualizado correctamente',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar registro de comida:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema actualizando el registro de comida.',
    });
  }
};

// Eliminar entrada de la bitácora
export const deleteBitacoraComidajs = async (
  id,
  setShowDeleteModal,
  refreshData
) => {
  try {
    await deleteBitacoraComida(id);
    await refreshData();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Registro de comida eliminado correctamente',
    });
    setShowDeleteModal(false);
  } catch (error) {
    console.error('Error al eliminar registro de comida:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema eliminando el registro de comida.',
    });
  }
};