/* eslint-disable react/prop-types */

export const PacienteCRUD = ({
  // Campos del formulario como objeto para simplificar
  formData: {
    nombre, setNombre,
    apellido, setApellido,
    edad, setEdad,
    sexo, setSexo,
    ocupacion, setOcupacion,
    direccion, setDireccion,
    localidad, setLocalidad,
    estado, setEstado,
    telefono, setTelefono,
    observaciones, setObservaciones
  },
  // Estados modales
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  // Funciones
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedPaciente
}) => {
  // Configuración común para los campos del formulario
  const formFields = [
    { label: "Nombre", value: nombre, setter: setNombre, type: "text", placeholder: "Ej: Manuel", col: 6 },
    { label: "Apellido", value: apellido, setter: setApellido, type: "text", placeholder: "Ej: Pérez", col: 6 },
    { label: "Edad", value: edad, setter: setEdad, type: "number", placeholder: "Ej: 30", col: 6 },
    { 
      label: "Sexo", 
      value: sexo, 
      setter: setSexo, 
      type: "select", 
      options: ["Masculino", "Femenino", "Otro"],
      optionLabels: ["Masculino", "Femenino", "Otro"],
      col: 6 
    },
    { label: "Ocupación", value: ocupacion, setter: setOcupacion, type: "text", placeholder: "Ej: Ingeniero", col: 6 },
    { label: "Dirección", value: direccion, setter: setDireccion, type: "text", placeholder: "Ej: Calle Principal #123", col: 6 },
    { label: "Localidad", value: localidad, setter: setLocalidad, type: "text", placeholder: "Ej: Centro", col: 6 },
    { label: "Estado", value: estado, setter: setEstado, type: "text", placeholder: "Ej: Jalisco", col: 6 },
    { label: "Teléfono", value: telefono, setter: setTelefono, type: "tel", placeholder: "Ej: 3312345678", col: 6 },
    { label: "Observaciones", value: observaciones, setter: setObservaciones, type: "text", placeholder: "Notas importantes...", col: 12 }
  ];

  // Componente para renderizar cada campo del formulario
  const renderField = (field) => (
    <div className={`col-md-${field.col}`} key={field.label}>
      <div className="input-group mb-3">
        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>{field.label}:</span>
        {field.type === "select" ? (
          <select
            className="form-select crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            style={{ padding: '0.5rem 0.75rem' }}
          >
            <option value="">Seleccione una opción</option>
            {field.options.map((option, index) => (
              <option key={option} value={option}>{field.optionLabels[index]}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            className="form-control crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            placeholder={field.placeholder}
            style={{ padding: '0.5rem 0.75rem' }}
          />
        )}
      </div>
    </div>
  );

  // Componente para renderizar los modales
  const renderModal = (type) => {
    const isAdd = type === 'add';
    const isEdit = type === 'edit';
    const isDelete = type === 'delete';
    const show = isAdd ? showModal : isEdit ? showEditModal : showDeleteModal;
    const setShow = isAdd ? setShowModal : isEdit ? setShowEditModal : setShowDeleteModal;

    // Titulos y acciones de los botones
    const title = isAdd ? 'Registrar Paciente' : isEdit ? 'Editar Información de Paciente' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Paciente' : isEdit ? 'Actualizar Paciente' : 'Eliminar';
    const actionBtnClass = isAdd ? 'crud-btn-success' : isEdit ? 'crud-btn-primary' : 'crud-btn-danger';

    return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered ${isDelete ? '' : 'modal-lg'}`}>
          <div className="modal-content crud-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <div className="modal-header crud-card-header" style={{ padding: '1rem 1.5rem' }}>
              <h5 className="modal-title text-white" style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShow(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body crud-card-body" style={{ padding: '1.5rem' }}>
              {isDelete ? (
                <p className="text-center mb-0" style={{ fontSize: '1rem' }}>
                  ¿Estás seguro de eliminar al paciente:<br />
                  <strong style={{ color: '#343a40' }}>{selectedPaciente?.nombre} {selectedPaciente?.apellido}</strong>?
                </p>
              ) : (
                <div className="row g-3">
                  {formFields.map(renderField)}
                </div>
              )}
            </div>
            <div className="modal-footer crud-card-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                type="button"
                className={`crud-btn ${isDelete ? 'crud-cancel' : 'crud-btn-danger'}`}
                onClick={() => setShow(false)}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`crud-btn ${actionBtnClass}`}
                onClick={actionHandler}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
              >
                {actionText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fondo oscuro para todos los modales
  return (
    <>
      <div 
        className={`modal-backdrop fade ${showModal || showEditModal || showDeleteModal ? 'show' : ''}`} 
        style={{ 
          display: showModal || showEditModal || showDeleteModal ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}
      />
      
      {/* Modales */}
      {renderModal('add')}
      {renderModal('edit')}
      {renderModal('delete')}
    </>
  );
};