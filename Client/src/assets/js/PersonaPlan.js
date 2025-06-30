import Swal from 'sweetalert2';
import {
  getPersonasPlanes,
  createPersonaPlan,
  updatePersonaPlan,
  deactivatePlan,
  deletePersonaPlan
} from "../../api/PersonaPlan.api.js";

// Obtener todos los planes de personas
export const getPersonasPlanesjs = async (setPersonasPlanes, activo = null) => {
  try {
    const data = await getPersonasPlanes(activo);
    setPersonasPlanes(data);
  } catch (error) {
    console.error('Error al obtener los planes:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los planes de personas.',
    });
  }
};

// Crear un nuevo plan para una persona
export const createPersonaPlanjs = async (idPersona, idPlan, setShowModal, getPersonasPlanesjs) => {
  try {
    await createPersonaPlan(idPersona, idPlan);
    getPersonasPlanesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Plan asignado correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al asignar el plan:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Hubo un problema asignando el plan.',
    });
  }
};

// Actualizar un plan existente
export const updatePersonaPlanjs = async (id, idPlan, activo_plan, setShowEditModal, getPersonasPlanesjs) => {
  try {
    await updatePersonaPlan(id, idPlan, activo_plan);
    getPersonasPlanesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Plan actualizado correctamente',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar el plan:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Hubo un problema actualizando el plan.',
    });
  }
};

// Desactivar un plan (borrado lógico)
export const deactivatePlanjs = async (id, setShowDeactivateModal, getPersonasPlanesjs) => {
  try {
    await deactivatePlan(id);
    getPersonasPlanesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Plan desactivado correctamente',
    });
    setShowDeactivateModal(false);
  } catch (error) {
    console.error('Error al desactivar el plan:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Hubo un problema desactivando el plan.',
    });
  }
};

// Eliminar un plan físicamente
export const deletePersonaPlanjs = async (id, setShowDeleteModal, getPersonasPlanesjs) => {
  try {
    await deletePersonaPlan(id);
    getPersonasPlanesjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Plan eliminado correctamente',
    });
    setShowDeleteModal(false);
  } catch (error) {
    console.error('Error al eliminar el plan:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Hubo un problema eliminando el plan.',
    });
  }
};

/* // Obtener planes de una persona específica
export const getPlanesByPersonajs = async (idPersona, setPlanesPersona) => {
  try {
    const data = await getPlanesByPersona(idPersona);
    setPlanesPersona(data);
  } catch (error) {
    console.error('Error al obtener los planes de la persona:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los planes de esta persona.',
    });
  }
}; */

/* // Obtener planes que están por expirar
export const getPlanesPorExpirarjs = async (setPlanesPorExpirar, dias = 7) => {
  try {
    const data = await getPlanesPorExpirar(dias);
    setPlanesPorExpirar(data);
  } catch (error) {
    console.error('Error al obtener planes por expirar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los planes por expirar.',
    });
  }
}; */

// Confirmar antes de desactivar un plan
export const confirmDeactivatePlan = (id, getPersonasPlanesjs) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "El plan se marcará como inactivo pero no se eliminará.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, desactivar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      deactivatePlanjs(id, () => {}, getPersonasPlanesjs);
    }
  });
};

// Confirmar antes de eliminar un plan
export const confirmDeletePlan = (id, getPersonasPlanesjs) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto! El plan se eliminará permanentemente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      deletePersonaPlanjs(id, () => {}, getPersonasPlanesjs);
    }
  });
};