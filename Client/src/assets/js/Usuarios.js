import Swal from 'sweetalert2';

import {
  getUsuarios,
  createUsuario,    
  updateUsuario,
  deleteUsuario,
} from '../../api/Usuarios.api.js';

export const getUsuariosjs = async (setUsuarioList) => {
  try {
    const data = await getUsuarios();
    setUsuarioList(data);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al obtener los usuarios.',
    });
  }
};

export const createUsuariosjs = async (usuarioData, setShowModal, getUsuariosjs) => {
  console.log('Creando usuario:', usuarioData);
  try {
    await createUsuario(usuarioData);
    await getUsuariosjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Usuario registrado correctamente.',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al registrar el usuario.',
    });
  }
};

export const updateUsuariosjs = async (idusuario, usuarioData, setShowEditModal, getUsuariosjs) => {
  try {
    await updateUsuario(idusuario, usuarioData);
    await getUsuariosjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Usuario actualizado correctamente.',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar el usuario.',
    });
  }
};

export const deleteUsuariosjs = async (idusuario, getUsuariosjs) => {
  try {
    await deleteUsuario(idusuario);
    await getUsuariosjs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Usuario eliminado correctamente.',
    });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al eliminar el usuario.',
    });
  }
};