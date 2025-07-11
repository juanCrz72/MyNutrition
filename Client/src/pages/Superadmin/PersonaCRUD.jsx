import { useState, useEffect } from 'react';
import { getPaises } from "../../api/Paises.api.js";
/* import { getCat_plan } from "../../api/Plan.api.js"; */

export const PersonaCRUD = ({
  formData: {
    nombre, setNombre,
    apellidos, setApellidos,
    fecha_nacimiento, setFechaNacimiento,
    sexo, setSexo,
    edad, setEdad,
    altura, setAltura,
    peso, setPeso,
    idPais, setIdPais,
    idPlan, setIdPlan,
    img_perfil, setImgPerfil
  },
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedPersona
}) => {
  const [paises, setPaises] = useState([]);
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [errorPaises, setErrorPaises] = useState(null);

  // Función para cargar países
  const cargarPaises = async () => {
    try {
      setLoadingPaises(true);
      setErrorPaises(null);
      const response = await getPaises();
      
      // Verificar si la respuesta es un array
      if (Array.isArray(response)) {
        setPaises(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setPaises(response.data);
      } else {
        setErrorPaises("Formato de datos no válido");
        console.error("La respuesta de países no contiene un array válido:", response);
      }
    } catch (error) {
      setErrorPaises("Error al cargar los países");
      console.error("Error al cargar países:", error);
    } finally {
      setLoadingPaises(false);
    }
  };

  useEffect(() => {
    cargarPaises();
  }, []);

  // Configuración de campos del formulario
  const formFields = [
    { label: "Nombre", value: nombre, setter: setNombre, type: "text", placeholder: "Ej: Juan", col: 6 },
    { label: "Apellidos", value: apellidos, setter: setApellidos, type: "text", placeholder: "Ej: García López", col: 6 },
    { 
      label: "Sexo", 
      value: sexo, 
      setter: setSexo, 
      type: "select", 
      options: ["M", "F"],
      optionLabels: ["Masculino", "Femenino"],
      col: 6 
    },
    { label: "Edad", value: edad, setter: setEdad, type: "number", placeholder: "Ej: 30", col: 4 },
    { label: "Altura (cm)", value: altura, setter: setAltura, type: "text", placeholder: "Ej: 170", col: 4 },
    { label: "Peso (kg)", value: peso, setter: setPeso, type: "text", placeholder: "Ej: 70", col: 4 },
    { 
      label: "País", 
      value: idPais, 
      setter: setIdPais, 
      type: "select", 
      options: paises.map(p => p.idPais || p.id), // Asegurar compatibilidad con diferentes estructuras
      optionLabels: paises.map(p => p.nombre_pais || p.nombre), // Asegurar compatibilidad
      col: 6,
      loading: loadingPaises,
      error: errorPaises
    }
  ];

  const renderField = (field) => {
    // Manejo especial para el select de países
    if (field.label === "País") {
      if (field.loading) {
        return (
          <div className={`col-md-${field.col}`} key={field.label}>
            <div className="input-group mb-3">
              <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>
                {field.label}:
              </span>
              <select className="form-select crud-search-input" disabled>
                <option>Cargando países...</option>
              </select>
            </div>
          </div>
        );
      }
      
      if (field.error) {
        return (
          <div className={`col-md-${field.col}`} key={field.label}>
            <div className="input-group mb-3">
              <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>
                {field.label}:
              </span>
              <select className="form-select crud-search-input" disabled>
                <option>{field.error}</option>
              </select>
            </div>
          </div>
        );
      }
    }

    return (
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
              style={{ padding: '0.5rem 0.75rem' }}
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
              style={{ padding: '0.5rem 0.75rem' }}
            />
          )}
        </div>
      </div>
    );
  };

  const renderModal = (type) => {
    const isAdd = type === 'add';
    const isEdit = type === 'edit';
    const isDelete = type === 'delete';
    const show = isAdd ? showModal : isEdit ? showEditModal : showDeleteModal;
    const setShow = isAdd ? setShowModal : isEdit ? setShowEditModal : setShowDeleteModal;

    const title = isAdd ? 'Registrar Persona' : isEdit ? 'Editar Información de Persona' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Persona' : isEdit ? 'Actualizar Persona' : 'Eliminar';
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
                  ¿Estás seguro de eliminar a la persona:<br />
                  <strong style={{ color: '#343a40' }}>{selectedPersona?.nombre} {selectedPersona?.apellidos}</strong>?
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
                disabled={loadingPaises && (isAdd || isEdit)}
              >
                {loadingPaises && (isAdd || isEdit) ? 'Cargando...' : actionText}
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