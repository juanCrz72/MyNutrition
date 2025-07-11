/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getCat_perfiles } from "../../api/Perfiles.api.js";

export const Cat_perfilesCRUD = ({
  formData: { catPerfilData, setCatPerfilData },
  modals: { showModal, setShowModal, showEditModal, setShowEditModal, showDeleteModal, setShowDeleteModal },
  handlers: { handleAdd, handleUpdate, handleDelete },
  selectedCat_perfil
}) => {
  const [loadingCat_perfiles, setLoadingCat_perfiles] = useState(true);
  const [catPerfiles, setCatPerfiles] = useState([]);

  useEffect(() => {
    const fetchPerfiles = async () => {
      try {
        const response = await getCat_perfiles();

        let catPerfilesFromApi;
        if (Array.isArray(response)) {
          catPerfilesFromApi = response;
        } else if (response && Array.isArray(response.data)) {
          catPerfilesFromApi = response.data;
        } else {
          console.error("Formato de respuesta inesperado:", response);
          return;
        }

        const catPerfilesActivos = catPerfilesFromApi.filter(perfil => perfil.activo === 1);
        setCatPerfiles(catPerfilesActivos);
      } catch (error) {
        console.error("Error al cargar perfiles:", error);
      } finally {
        setLoadingCat_perfiles(false);
      }
    };

    fetchPerfiles();
  }, []);

  const formFields = [
    {
      label: "Nombre del Perfil",
      name: "nombre",
      value: catPerfilData.nombre || "",
      setter: (value) => setCatPerfilData(prev => ({ ...prev, nombre: value })),
      type: "text",
      placeholder: "Ej: Administrador",
      col: 6
    },
    {
      label: "Estado",
      name: "activo",
      value: catPerfilData.activo ?? 1,
      setter: (value) => setCatPerfilData(prev => ({ ...prev, activo: Number(value) })),
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

    const title = isAdd ? 'Registrar Perfil' : isEdit ? 'Editar Perfil' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Perfil' : isEdit ? 'Actualizar Perfil' : 'Eliminar Perfil';
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
                  ¿Estás seguro de eliminar el perfil:<br />
                  <strong style={{ color: '#343a40' }}>{selectedCat_perfil?.nombre}</strong>?
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
