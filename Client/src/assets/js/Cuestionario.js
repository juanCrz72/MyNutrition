import Swal from 'sweetalert2';
import {
  getQuestionarios,
  getQuestionarioByPersonaId,
  createQuestionario,
  updateQuestionario,
  deleteQuestionario
} from "../../api/Cuestionario.api.js";

export const getQuestionariosjs = async (setQuestionarios) => {
  try {
    const data = await getQuestionarios();
    setQuestionarios(data);
    return data; // Añade este return
  } catch (error) {
    console.error('Error al obtener los cuestionarios:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los cuestionarios.',
    });
    throw error; // Relanza el error
  }
};

// Obtener cuestionario por ID de persona
// Versión corregida de getQuestionarioByPersonaIdjs
export const getQuestionarioByPersonaIdjs = async (id_persona) => {
  try {
    const data = await getQuestionarioByPersonaId(id_persona);
    
    // Si no hay datos, retorna null
    if (!data) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error al obtener el cuestionario:', error);
    
    // Si es un 404 (no encontrado), retorna null
    if (error.response?.status === 404) {
      return null;
    }
    
    throw error;
  }
};

// Crear un nuevo cuestionario
export const createQuestionariojs = async (
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
  metas,
  setShowModal,
  refreshQuestionarios
) => {
   console.log('Datos enviados al js:', {
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
    await createQuestionario(
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
    );
    
    refreshQuestionarios();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Cuestionario registrado correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al registrar el cuestionario:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema registrando el cuestionario.',
    });
  }
};

// Actualizar un cuestionario existente
export const updateQuestionariojs = async (
  id,
  act_fisica,
  diabetes,
  hipertension,
  otra_enfermedad,
  toma_medicamento,
  medicamento_descrip,
  consumo_calorias,
  calorias_descrip,
  alergias,
  metas,
  setShowEditModal,
  refreshQuestionarios
) => {
  try {
    await updateQuestionario(
      id,
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
    );
    
    refreshQuestionarios();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Cuestionario actualizado correctamente',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar el cuestionario:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema actualizando el cuestionario.',
    });
  }
};

// Eliminar un cuestionario
export const deleteQuestionariojs = async (id, setShowDeleteModal, refreshQuestionarios) => {
  try {
    await deleteQuestionario(id);
    refreshQuestionarios();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Cuestionario eliminado correctamente',
    });
    setShowDeleteModal(false);
  } catch (error) {
    console.error('Error al eliminar el cuestionario:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema eliminando el cuestionario.',
    });
  }
};