import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export const PersonaDietaCRUD = ({ formData, modals, handlers, selectedDieta, personasList }) => {
  const { dietaData, setDietaData } = formData;
  const { 
    showModal, setShowModal, 
    showEditModal, setShowEditModal, 
    showDeactivateModal, setShowDeactivateModal,
    showDeleteModal, setShowDeleteModal 
  } = modals;
  const { handleAdd, handleUpdate, handleDeactivate, handleDelete } = handlers;

  // -------------------------- Campos del formulario --------------------------
  const formFields = [
    {
      label: "Persona",
      value: dietaData.idPersona,
      setter: (value) => setDietaData({...dietaData, idPersona: value}),
      type: "select",
      options: personasList.map(p => p.idpersona),
      optionLabels: personasList.map(p => `${p.nombre} ${p.apellidos}`),
      placeholder: "Seleccione una persona",
      col: 6,
      disabled: showEditModal
    },
    {
      label: "Peso Actual (kg)",
      value: dietaData.peso_actual,
      setter: (value) => setDietaData({...dietaData, peso_actual: value}),
      type: "number",
      step: "0.01",
      placeholder: "Ingrese peso actual",
      col: 6
    },
    {
      label: "Calorías (kcal)",
      value: dietaData.calorias,
      setter: (value) => setDietaData({...dietaData, calorias: value}),
      type: "number",
      placeholder: "Ingrese calorías",
      col: 6
    },
    {
      label: "Proteínas (g)",
      value: dietaData.proteinas,
      setter: (value) => setDietaData({...dietaData, proteinas: value}),
      type: "number",
      step: "0.01",
      placeholder: "Ingrese proteínas",
      col: 6
    },
    {
      label: "Carbohidratos (g)",
      value: dietaData.carbohidratos,
      setter: (value) => setDietaData({...dietaData, carbohidratos: value}),
      type: "number",
      step: "0.01",
      placeholder: "Ingrese carbohidratos",
      col: 6
    },
    {
      label: "Grasas (g)",
      value: dietaData.grasas,
      setter: (value) => setDietaData({...dietaData, grasas: value}),
      type: "number",
      step: "0.01",
      placeholder: "Ingrese grasas",
      col: 6
    }
  ];

  const editFields = [
    ...formFields,
    {
      label: "Estado",
      value: dietaData.activo,
      setter: (value) => setDietaData({...dietaData, activo: value}),
      type: "switch",
      labelOn: "Dieta activa",
      col: 12
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
            disabled={field.disabled}
          >
            <option value="">{field.placeholder}</option>
            {field.options.map((option, index) => (
              <option key={option} value={option}>{field.optionLabels[index]}</option>
            ))}
          </select>
        ) : field.type === "switch" ? (
          <div className="form-control" style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Check
              type="switch"
              label={field.labelOn}
              checked={field.value === 1}
              onChange={(e) => field.setter(e.target.checked ? 1 : 0)}
              style={{ marginLeft: '10px' }}
            />
          </div>
        ) : (
          <input
            type={field.type}
            className="form-control crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            placeholder={field.placeholder}
            style={{ padding: '0.5rem 0.75rem' }}
            step={field.step}
          />
        )}
      </div>
    </div>
  );

  const renderModal = (type) => {
    const isAdd = type === 'add';
    const isEdit = type === 'edit';
    const isDeactivate = type === 'deactivate';
    const isDelete = type === 'delete';
    
    const show = isAdd ? showModal : 
                 isEdit ? showEditModal : 
                 isDeactivate ? showDeactivateModal : 
                 showDeleteModal;
                 
    const setShow = isAdd ? setShowModal : 
                    isEdit ? setShowEditModal : 
                    isDeactivate ? setShowDeactivateModal : 
                    setShowDeleteModal;

    const title = isAdd ? 'Registrar Nueva Dieta' : 
                  isEdit ? 'Editar Dieta' : 
                  isDeactivate ? 'Desactivar Dieta' : 
                  'Eliminar Dieta Permanentemente';
                  
    const actionHandler = isAdd ? handleAdd : 
                         isEdit ? handleUpdate : 
                         isDeactivate ? handleDeactivate : 
                         handleDelete;
                         
    const actionText = isAdd ? 'Registrar Dieta' : 
                       isEdit ? 'Actualizar Dieta' : 
                       isDeactivate ? 'Desactivar' : 
                       'Eliminar Permanentemente';
                       
    const actionBtnClass = isAdd ? 'crud-btn-success' : 
                          isEdit ? 'crud-btn-primary' : 
                          'crud-btn-danger';

    return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered ${isDelete || isDeactivate ? '' : 'modal-lg'}`}>
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
                <div className="alert alert-danger mb-0">
                  <strong>¡Advertencia!</strong> Esta acción eliminará permanentemente la dieta y no podrá recuperarse. ¿Estás seguro que deseas continuar?
                </div>
              ) : isDeactivate ? (
                <p className="text-center mb-0" style={{ fontSize: '1rem' }}>
                  ¿Estás seguro que deseas desactivar esta dieta? La dieta ya no estará disponible pero podrás reactivarla editándola.
                </p>
              ) : (
                <div className="row g-3">
                  {(isEdit ? editFields : formFields).map(renderField)}
                </div>
              )}
            </div>
            <div className="modal-footer crud-card-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                type="button"
                className={`crud-btn ${isDelete || isDeactivate ? 'crud-cancel' : 'crud-btn-danger'}`}
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
        className={`modal-backdrop fade ${showModal || showEditModal || showDeactivateModal || showDeleteModal ? 'show' : ''}`} 
        style={{ 
          display: showModal || showEditModal || showDeactivateModal || showDeleteModal ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}
      />
      {renderModal('add')}
      {renderModal('edit')}
      {renderModal('deactivate')}
      {renderModal('delete')}
    </>
  );
};



/* 
import React, { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export const PersonaDietaCRUD = ({ formData, modals, handlers, selectedDieta, personasList }) => {
  const { dietaData, setDietaData } = formData;
  const { 
    showModal, setShowModal, 
    showEditModal, setShowEditModal, 
    showDeactivateModal, setShowDeactivateModal,
    showDeleteModal, setShowDeleteModal 
  } = modals;
  const { handleAdd, handleUpdate, handleDeactivate, handleDelete } = handlers;

  // Constantes para las proporciones de macronutrientes (pueden ajustarse)
  const MACRO_RATIOS = {
    carbohidratos: 0.5,   // 50% de las calorías
    proteinas: 0.2,       // 20% de las calorías
    grasas: 0.3           // 30% de las calorías
  };

  // Calorías por gramo de cada macronutriente
  const CALORIES_PER_GRAM = {
    carbohidratos: 4,
    proteinas: 4,
    grasas: 9
  };

  // Función para calcular los macronutrientes basados en calorías
  const calculateMacros = (calories) => {
    if (!calories || isNaN(calories)) return;
    
    const carbsGrams = Math.round((calories * MACRO_RATIOS.carbohidratos) / CALORIES_PER_GRAM.carbohidratos * 100) / 100;
    const proteinGrams = Math.round((calories * MACRO_RATIOS.proteinas) / CALORIES_PER_GRAM.proteinas * 100) / 100;
    const fatGrams = Math.round((calories * MACRO_RATIOS.grasas) / CALORIES_PER_GRAM.grasas * 100) / 100;

    return {
      carbohidratos: carbsGrams,
      proteinas: proteinGrams,
      grasas: fatGrams
    };
  };

  // Efecto que se dispara cuando cambian las calorías
  useEffect(() => {
    if (dietaData.calorias && !isNaN(dietaData.calorias)) {
      const macros = calculateMacros(dietaData.calorias);
      if (macros) {
        setDietaData({
          ...dietaData,
          ...macros
        });
      }
    }
  }, [dietaData.calorias]);

  // -------------------------- Campos del formulario --------------------------
  const formFields = [
    {
      label: "Persona",
      value: dietaData.idPersona,
      setter: (value) => setDietaData({...dietaData, idPersona: value}),
      type: "select",
      options: personasList.map(p => p.idpersona),
      optionLabels: personasList.map(p => `${p.nombre} ${p.apellidos}`),
      placeholder: "Seleccione una persona",
      col: 6,
      disabled: showEditModal
    },
    {
      label: "Peso Actual (kg)",
      value: dietaData.peso_actual,
      setter: (value) => setDietaData({...dietaData, peso_actual: value}),
      type: "number",
      step: "0.01",
      placeholder: "Ingrese peso actual",
      col: 6
    },
    {
      label: "Calorías (kcal)",
      value: dietaData.calorias,
      setter: (value) => setDietaData({...dietaData, calorias: value}),
      type: "number",
      placeholder: "Ingrese calorías",
      col: 6,
      onBlur: (e) => {
        if (e.target.value && !isNaN(e.target.value)) {
          const macros = calculateMacros(e.target.value);
          if (macros) {
            setDietaData({
              ...dietaData,
              calorias: e.target.value,
              ...macros
            });
          }
        }
      }
    },
    {
      label: "Proteínas (g)",
      value: dietaData.proteinas,
      setter: (value) => setDietaData({...dietaData, proteinas: value}),
      type: "number",
      step: "0.01",
      placeholder: "Ingrese proteínas",
      col: 6
    },
    {
      label: "Carbohidratos (g)",
      value: dietaData.carbohidratos,
      setter: (value) => setDietaData({...dietaData, carbohidratos: value}),
      type: "number",
      step: "0.01",
      placeholder: "Ingrese carbohidratos",
      col: 6
    },
    {
      label: "Grasas (g)",
      value: dietaData.grasas,
      setter: (value) => setDietaData({...dietaData, grasas: value}),
      type: "number",
      step: "0.01",
      placeholder: "Ingrese grasas",
      col: 6
    }
  ];
 */