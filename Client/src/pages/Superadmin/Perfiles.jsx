import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaInfoCircle
} from "react-icons/fa";
import {
  getCat_perfilesjs,
  createCat_perfiljs,
  updateCat_perfiljs,
  deleteCat_perfiljs
} from '../../assets/js/Perfiles.js';
import { Cat_perfilesCRUD } from './PerfilesCRUD.jsx';

function Cat_perfiles() {
  const [perfilList, setPerfilList] = useState([]);
  const [catPerfilData, setCatPerfilData] = useState({ nombre: '', activo: 1 });
  const [selectedPerfil, setSelectedPerfil] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPerfilModal, setShowPerfilModal] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    getCat_perfilesjs(setPerfilList);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetForm = () => {
    setCatPerfilData({ nombre: '', activo: 1 });
  };

  const showPerfilInfo = (perfil) => {
    setSelectedPerfil(perfil);
    setShowPerfilModal(true);
  };

  const handleCreatePerfil = async () => {
    await createCat_perfiljs(catPerfilData, setShowModal, () => getCat_perfilesjs(setPerfilList));
    resetForm();
  };

  const handleUpdatePerfil = async () => {
    if (!selectedPerfil) return;
    await updateCat_perfiljs(
      selectedPerfil.id_perfil,
      catPerfilData,
      setShowEditModal,
      () => getCat_perfilesjs(setPerfilList)
    );
    resetForm();
    setSelectedPerfil(null);
  };

  const handleDeletePerfil = async () => {
    if (!selectedPerfil) return;
    await deleteCat_perfiljs(
      selectedPerfil.id_perfil,
      () => getCat_perfilesjs(setPerfilList)
    );
    setShowDeleteModal(false);
    setSelectedPerfil(null);
  };

  const filteredPerfiles = perfilList.filter(perfil =>
    perfil.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPerfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPerfiles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 text-dark fw-bold">
          <FaList className="me-2" /> Perfiles
        </h2>
        <button className="crud-btn crud-btn-success text-white"
          onClick={() => { resetForm(); setSelectedPerfil(null); setShowModal(true); }}>
          <FaPlus className="me-1" /> Nuevo Perfil
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="crud-search-container">
            <FaSearch className="crud-search-icon" />
            <input
              type="text"
              className="form-control crud-search-input ps-4"
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nombre del perfil..."
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
          >
            {[5, 10, 25, 50].map(size => (
              <option key={size} value={size}>Mostrar {size}</option>
            ))}
          </select>
        </div>
      </div>

      {isMobile ? (
        <div className="row">
          {currentItems.length ? currentItems.map(perfil => (
            <div key={perfil.id_perfil} className="col-12 mb-3">
              <div className="card crud-card">
                <div className="card-body">
                  <h5 className="card-title">{perfil.nombre}</h5>
                  <p><strong>Estado:</strong> {perfil.activo === 1 ? "ACTIVO" : "INACTIVO"}</p>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-info btn-sm text-white" onClick={() => showPerfilInfo(perfil)}><FaInfoCircle /></button>
                    <button className="btn btn-warning btn-sm text-white" onClick={() => { setSelectedPerfil(perfil); setCatPerfilData(perfil); setShowEditModal(true); }}><FaEdit /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => { setSelectedPerfil(perfil); setShowDeleteModal(true); }}><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center py-4 text-muted">No hay perfiles registrados</div>
          )}
        </div>
      ) : (
        <div className="card crud-card">
          <div className="table-responsive">
            <table className="table table-hover crud-table mb-0">
              <thead>
                <tr><th>Nombre</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {currentItems.length ? currentItems.map(perfil => (
                  <tr key={perfil.id_perfil}>
                    <td>{perfil.nombre}</td>
                    <td>{perfil.activo === 1 ? "ACTIVO" : "INACTIVO"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-info btn-sm text-white" onClick={() => showPerfilInfo(perfil)}><FaInfoCircle /></button>
                        <button className="btn btn-warning btn-sm text-white" onClick={() => { setSelectedPerfil(perfil); setCatPerfilData(perfil); setShowEditModal(true); }}><FaEdit /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => { setSelectedPerfil(perfil); setShowDeleteModal(true); }}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="text-center py-4 text-muted">No hay perfiles registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">Página {currentPage} de {totalPages}</span>
        <div className="btn-group">
          <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Anterior</button>
          <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Siguiente</button>
        </div>
      </div>

      <Cat_perfilesCRUD
        formData={{ catPerfilData, setCatPerfilData }}
        modals={{ showModal, setShowModal, showEditModal, setShowEditModal, showDeleteModal, setShowDeleteModal }}
        handlers={{ handleAdd: handleCreatePerfil, handleUpdate: handleUpdatePerfil, handleDelete: handleDeletePerfil }}
        selectedCat_perfil={selectedPerfil}
      />

      {selectedPerfil && showPerfilModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header text-white" style={{ backgroundColor: 'rgba(52,73,94,255)' }}>
                <h5 className="modal-title">Información del Perfil</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPerfilModal(false)}></button>
              </div>
              <div className="modal-body">
                <h3>{selectedPerfil.nombre}</h3>
                <p><strong>Estado:</strong> {selectedPerfil.activo === 1 ? "ACTIVO" : "INACTIVO"}</p>
                <p><strong>Fecha de creación:</strong> {new Date(selectedPerfil.date_add).toLocaleString()}</p>
                <p><strong>Última actualización:</strong> {new Date(selectedPerfil.date_upt).toLocaleString()}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setShowPerfilModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cat_perfiles;
