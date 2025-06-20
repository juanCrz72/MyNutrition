/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getCat_plan } from "../../api/Plan.api.js";

export const Cat_planCRUD = ({
  formData: { Cat_planData, setCat_planData },
  modals: { showModal, setShowModal, showEditModal, setShowEditModal, showDeleteModal, setShowDeleteModal },
  handlers: { handleAdd, handleUpdate, handleDelete },
  selectedCat_plan
}) => {
  const [loadingCat_plan, setLoadingCat_plan] = useState(true);
  const [Cat_plan, setCat_plan] = useState([]);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await getCat_plan();

        let Cat_planDataFromApi;
        if (Array.isArray(response)) {
          Cat_planDataFromApi = response;
        } else if (response && Array.isArray(response.data)) {
          Cat_planDataFromApi = response.data;
        } else {
          console.error("Formato de respuesta inesperado:", response);
          return;
        }

        // Filtrar solo planes activos (plan_estado === 1)
        const Cat_planActivos = Cat_planDataFromApi.filter(plan => plan.plan_estado === 1);
        setCat_plan(Cat_planActivos);
      } catch (error) {
        console.error("Error al cargar planes:", error);
      } finally {
        setLoadingCat_plan(false);
      }
    };

    fetchPlanes();
  }, []);

  // Corregido planData a Cat_planData y setter correspondientes
  const formFields = [
    {
      label: "Nombre del Plan",
      name: "plan_nombre",
      value: Cat_planData.plan_nombre || "",
      setter: (value) => setCat_planData(prev => ({ ...prev, plan_nombre: value })),
      type: "text",
      placeholder: "Ej: Básico",
      col: 6
    },
    {
      label: "Duración (días)",
      name: "plan_duracion",
      value: Cat_planData.plan_duracion ?? "",
      setter: (value) => setCat_planData(prev => ({ ...prev, plan_duracion: Number(value) })),
      type: "number",
      placeholder: "Ej: 30",
      col: 6
    },
    {
      label: "Estado",
      name: "plan_estado",
      value: Cat_planData.plan_estado ?? 1,
      setter: (value) => setCat_planData(prev => ({ ...prev, plan_estado: Number(value) })),
      type: "select",
      options: [1, 0],
      optionLabels: ["Activo", "Inactivo"],
      col: 6
    }
  ];

  const renderField = (field) => (
    <div className={`col-md-${field.col}`} key={field.name}>
      <div className="input-group mb-3">
        <span className="input-group-text crud-input-label" style={{ minWidth: '150px' }}>{field.label}:</span>
        {field.type === "select" ? (
          <select
            className="form-select crud-search-input"
            value={field.value}
            onChange={e => field.setter(e.target.value)}
            style={{ padding: '0.5rem 0.75rem' }}
          >
            {field.options.map((opt, i) => (
              <option key={opt} value={opt}>{field.optionLabels[i]}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            className="form-control crud-search-input"
            name={field.name}
            value={field.value}
             onChange={(e) => field.setter(e.target.value.toUpperCase())}
            placeholder={field.placeholder}
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

    const title = isAdd ? 'Registrar Plan' : isEdit ? 'Editar Plan' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Plan' : isEdit ? 'Actualizar Plan' : 'Eliminar Plan';
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
              />
            </div>
            <div className="modal-body crud-card-body" style={{ padding: '1.5rem' }}>
              {isDelete ? (
                <p className="text-center mb-0" style={{ fontSize: '1rem' }}>
                  ¿Estás seguro de eliminar el plan:<br />
                  <strong style={{ color: '#343a40' }}>{selectedCat_plan?.plan_nombre}</strong>?
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
