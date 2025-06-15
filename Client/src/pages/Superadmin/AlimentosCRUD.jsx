/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getPaises } from "../../api/Paises.api.js";

export const AlimentoCRUD = ({
  formData: {
    alimentoData, setAlimentoData
  },
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedAlimento
}) => {
  const [paises, setPaises] = useState([]);
  const [loadingPaises, setLoadingPaises] = useState(true);

  // Cargar países al montar el componente
  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const response = await getPaises();
        
        // Manejar diferentes estructuras de respuesta
        let paisesData;
        if (Array.isArray(response)) {
          paisesData = response;
        } else if (response && Array.isArray(response.data)) {
          paisesData = response.data;
        } else {
          console.error("Formato de respuesta inesperado:", response);
          return;
        }
        
        // Filtrar solo países activos (activo === 1)
        const paisesActivos = paisesData.filter(pais => pais.activo === 1);
        setPaises(paisesActivos);
      } catch (error) {
        console.error("Error al cargar países:", error);
      } finally {
        setLoadingPaises(false);
      }
    };
    
    fetchPaises();
  }, []);

  // -------------------------- Campos del formulario --------------------------
  const formFields = [
    {
      label: "Categoría",
      name: "Categoria",
      value: alimentoData.Categoria,
      setter: (value) => setAlimentoData(prev => ({...prev, Categoria: value})),
      type: "text",
      placeholder: "Ej: FRUTAS",
      col: 6
    },
    {
      label: "Alimento",
      name: "Alimento",
      value: alimentoData.Alimento,
      setter: (value) => setAlimentoData(prev => ({...prev, Alimento: value})),
      type: "text",
      placeholder: "Ej: MANZANA",
      col: 6
    },
    {
      label: "Cantidad Sugerida",
      name: "Cantidad_Sugerida",
      value: alimentoData.Cantidad_Sugerida,
      setter: (value) => setAlimentoData(prev => ({...prev, Cantidad_Sugerida: value})),
      type: "number",
      placeholder: "Ej: 1",
      col: 4
    },
    {
      label: "Unidad",
      name: "Unidad",
      value: alimentoData.Unidad,
      setter: (value) => setAlimentoData(prev => ({...prev, Unidad: value})),
      type: "text",
      placeholder: "Ej: PIEZA",
      col: 4
    },
    {
      label: "Estado",
      name: "activo",
      value: alimentoData.activo,
      setter: (value) => setAlimentoData(prev => ({...prev, activo: Number(value)})),
      type: "select",
      options: [1, 0],
      optionLabels: ["ACTIVO", "INACTIVO"],
      col: 4
    },
    {
      label: "Peso Bruto (g)",
      name: "Peso_Bruto_g",
      value: alimentoData.Peso_Bruto_g,
      setter: (value) => setAlimentoData(prev => ({...prev, Peso_Bruto_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 150.5",
      col: 4
    },
    {
      label: "Peso Neto (g)",
      name: "Peso_Neto_g",
      value: alimentoData.Peso_Neto_g,
      setter: (value) => setAlimentoData(prev => ({...prev, Peso_Neto_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 120.3",
      col: 4
    },
    {
      label: "Energía (kcal)",
      name: "Energia_kcal",
      value: alimentoData.Energia_kcal,
      setter: (value) => setAlimentoData(prev => ({...prev, Energia_kcal: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 52.3",
      col: 4
    },
    {
      label: "Proteína (g)",
      name: "Proteina_g",
      value: alimentoData.Proteina_g,
      setter: (value) => setAlimentoData(prev => ({...prev, Proteina_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 0.3",
      col: 4
    },
    {
      label: "Grasa (g)",
      name: "Grasa_g",
      value: alimentoData.Grasa_g,
      setter: (value) => setAlimentoData(prev => ({...prev, Grasa_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 0.2",
      col: 4
    },
    {
      label: "Carbohidratos (g)",
      name: "Carbohidratos_g",
      value: alimentoData.Carbohidratos_g,
      setter: (value) => setAlimentoData(prev => ({...prev, Carbohidratos_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 14",
      col: 4
    },
    {
      label: "Azúcar (g)",
      name: "Azucar_g",
      value: alimentoData.Azucar_g,
      setter: (value) => setAlimentoData(prev => ({...prev, Azucar_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 10",
      col: 4
    },
    {
      label: "Fibra (g)",
      name: "Fibra_g",
      value: alimentoData.Fibra_g,
      setter: (value) => setAlimentoData(prev => ({...prev, Fibra_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 2.4",
      col: 4
    },
  {
  label: "Países asociados",
  name: "idPais",
  value: alimentoData.idPais || [],
  setter: (value) => setAlimentoData(prev => ({...prev, idPais: Array.isArray(value) ? value : [value]})),
  type: "checkboxgroup", // Cambiamos de "multiselect" a "checkboxgroup"
  options: paises.map(pais => pais.idPais),
  optionLabels: paises.map(pais => pais.nombre_pais),
  col: 12,
  loading: loadingPaises
}
  ];

const renderField = (field) => (
  <div className={`col-md-${field.col}`} key={field.label}>
    <div className="input-group mb-3">
      <span className="input-group-text crud-input-label" style={{ minWidth: '150px' }}>{field.label}:</span>
      {field.type === "select" ? (
        <select
          className="form-select crud-search-input"
          value={field.value}
          onChange={(e) => field.setter(e.target.value)}
          style={{ padding: '0.5rem 0.75rem' }}
        >
          {field.options.map((option, index) => (
            <option key={option} value={option}>{field.optionLabels[index]}</option>
          ))}
        </select>
      ) : field.type === "checkboxgroup" ? (
        field.loading ? (
          <div className="form-control" style={{ padding: '0.5rem 0.75rem' }}>
            Cargando países...
          </div>
        ) : (
          <div className="form-control" style={{ padding: '0.5rem 0.75rem', height: 'auto' }}>
            <div className="d-flex flex-wrap gap-3">
              {field.options.map((option, index) => (
                <div key={option} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`pais-${option}`}
                    value={option}
                    checked={field.value.includes(option)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...field.value, option]
                        : field.value.filter(val => val !== option);
                      field.setter(newValue);
                    }}
                  />
                  <label className="form-check-label" htmlFor={`pais-${option}`}>
                    {field.optionLabels[index]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <input
          type={field.type}
          className="form-control crud-search-input"
          name={field.name}
          value={field.value || ''}
          onChange={(e) => field.setter(e.target.value)}
          placeholder={field.placeholder}
          step={field.step}
          style={{ padding: '0.5rem 0.75rem' }}
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

    const title = isAdd ? 'Registrar Alimento' : isEdit ? 'Editar Alimento' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Alimento' : isEdit ? 'Actualizar Alimento' : 'Eliminar Alimento';
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
                  ¿Estás seguro de eliminar el alimento:<br />
                  <strong style={{ color: '#343a40' }}>{selectedAlimento?.Alimento}</strong>?
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