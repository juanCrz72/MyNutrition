import Swal from 'sweetalert2';
import {
  getCat_plan,
  createCat_Plan,
  updateCat_Plan,
  deleteCat_Plan
} from "../../api/Plan.api.js";

// Obtener planes
export const getCat_planjs = async (setCat_planjs) => {
  try {
    const data = await getCat_plan();
    setCat_planjs(data);
  } catch (error) {
    console.error('Error al obtener los planes:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los planes.',
    });
  }
};

// Crear plan
export const createCat_Planjs = async (planData, setShowModal, getCat_planjs) => {
  try {
    await createCat_Plan(planData);
    getCat_planjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Plan registrado correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al agregar el plan:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema registrando el plan.',
    });
  }
};

// Actualizar plan
export const updateCat_Planjs = async (id, planData, setShowEditModal, getCat_planjs) => {
  try {
    await updateCat_Plan(id, planData);
    getCat_planjs();
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
      text: 'Hubo un problema actualizando el plan.',
    });
  }
};

// Eliminar plan
export const deleteCat_Planjs = async (id, getCat_planjs) => {
  try {
    await deleteCat_Plan(id);
    getCat_planjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Plan eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar el plan:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema eliminando el plan.',
    });
  }
};