import { useState } from 'react';

export const UsuarioCRUD = ({
  formData: {
    nombre, setNombre,
    usuario, setUsuario,
    correo, setCorreo,
    contrasenia, setContrasenia,
    idPersona, setIdPersona,
    idPerfil, setIdPerfil
  },
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedUsuario
}) => {

  const formFields = [
    { label: "Nombre", value: nombre, setter: setNombre, type: "text", placeholder: "Ej: Mariana Díaz", col: 6 },
    { label: "Usuario", value: usuario, setter: setUsuario, type: "text", placeholder: "Ej: mariana123", col: 6 },
    { label: "Correo", value: correo, setter: setCorreo, type: "email", placeholder: "Ej: correo@ejemplo.com", col: 6 },
    { label: "Contraseña", value: contrasenia, setter: setContrasenia, type: "password", placeholder: "********", col: 6 },
    { label: "ID Persona", value: idPersona, setter: setIdPersona, type: "number", placeholder: "Ej: 1", col: 4 },
    { 
      label: "Perfil", 
      value: idPerfil, 
      setter: setIdPerfil, 
      type: "select", 
      options: [1, 2], 
      optionLabels: ["Administrador", "Usuario"],
      col: 4 
    },
  ];

  const renderField = (field) => (
    <div className={`col-md-${field.col}`} key={field.label}>
      <div className="input-group mb-3">
        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>
          {field.label}:
        </span>
        {field.type === "select" ? (
          <select
            className="form-select crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
          >
            <option value="">Seleccione una opción</option>
            {field.options.map((option, index) => (
              <option key={option} value={option}>
                {field.optionLabels?.[index] || option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            className="form-control crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            placeholder={field.placeholder}
          />
        )}
      </div>
    </div>
  );

  const renderModal = (type) => {
    const isAdd = type === 'add';
    const isEdit = type === 'edit';
    const isDelete = type === 'delete';
    const show = isAdd ? showModal : isEdit ? showEditModal : showDeleteModal;
    const setShow = isAdd ? setShowModal : isEdit ? setShowEditModal : setShowDeleteModal;

    const title = isAdd ? 'Registrar Usuario' : isEdit ? 'Editar Usuario' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Usuario' : isEdit ? 'Actualizar Usuario' : 'Eliminar';
    const actionBtnClass = isAdd ? 'crud-btn-success' : isEdit ? 'crud-btn-primary' : 'crud-btn-danger';

    return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered ${isDelete ? '' : 'modal-lg'}`}>
          <div className="modal-content crud-card">
            <div className="modal-header crud-card-header">
              <h5 className="modal-title text-white">{title}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShow(false)}></button>
            </div>
            <div className="modal-body crud-card-body">
              {isDelete ? (
                <p className="text-center">
                  ¿Estás seguro de eliminar al usuario:<br />
                  <strong>{selectedUsuario?.nombre}</strong>?
                </p>
              ) : (
                <div className="row g-3">
                  {formFields.map(renderField)}
                </div>
              )}
            </div>
            <div className="modal-footer crud-card-footer">
              <button className="crud-btn crud-cancel" onClick={() => setShow(false)}>
                Cancelar
              </button>
              <button className={`crud-btn ${actionBtnClass}`} onClick={actionHandler}>
                {actionText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div 
        className={`modal-backdrop fade ${showModal || showEditModal || showDeleteModal ? 'show' : ''}`} 
        style={{ 
          display: showModal || showEditModal || showDeleteModal ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}
      />
      {renderModal('add')}
      {renderModal('edit')}
      {renderModal('delete')}
    </>
  );
};

export default UsuarioCRUD;
