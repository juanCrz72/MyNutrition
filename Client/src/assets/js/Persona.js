import Swal from 'sweetalert2';

import {
  getPersonas,
  createPersona,
  updatePersona,
  deletePersona,
} from '../../api/Persona.api.js';

// Obtener personas con animación
export const getPersonasjs = async (setPersonaList) => {
  try {
    const data = await getPersonas();
    setPersonaList(data);
  } catch (error) {
    console.error('Error al obtener las personas:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al obtener las personas.',
    });
  }
};

// Crear persona con animación
export const createPersonajs = async (personaData, setShowModal, getPersonasjs) => {
  console.log('Creando persona:', personaData);
  try {
    await createPersona(personaData);
    await getPersonasjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Persona registrada correctamente.',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al crear la persona:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al registrar la persona.',
    });
  }
};

// Actualizar persona con animación
export const updatePersonajs = async (idpersona, personaData, setShowEditModal, getPersonasjs) => {
  try {
    await updatePersona(idpersona, personaData);
    await getPersonasjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Persona actualizada correctamente.',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar la persona:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar la persona.',
    });
  }
};

// Eliminar persona con animación
export const deletePersonajs = async (idpersona, setShowDeleteModal, getPersonasjs) => {
  try {
    await deletePersona(idpersona);
    await getPersonasjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Persona eliminada correctamente.',
    });
    setShowDeleteModal(false);
  } catch (error) {
    console.error('Error al eliminar la persona:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al eliminar la persona.',
    });
  }
};
