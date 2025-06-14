import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaGlobeAmericas } from "react-icons/fa";

import { getPaisesjs, createPaisjs, updatePaisjs, deletePaisjs } from '../../assets/js/Paises.js';
import { PaisCRUD } from './PaisesCRUD.jsx';

function Pais() {
  const [paisList, setPaisList] = useState([]);
  const [nombre_pais, setNombrePais] = useState("");
  const [activo, setActivo] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedPais, setSelectedPais] = useState(null);

  //Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getPaisesjs(setPaisList);
  }, []);

  const filteredData = paisList.filter(item =>
    (item?.nombre_pais ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    createPaisjs(nombre_pais, activo, setShowModal, () => getPaisesjs(setPaisList));
  };

  const handleUpdate = () => {
    updatePaisjs(selectedPais.idPais, nombre_pais, activo, setShowEditModal, () => getPaisesjs(setPaisList));
  };

  const handleDelete = () => {
    deletePaisjs(selectedPais.idPais, setShowDeleteModal, () => getPaisesjs(setPaisList));
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaGlobeAmericas className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Catálogo de Países
        </h2>
        <div className="d-flex flex-wrap gap-2">
          <button className="crud-btn crud-btn-primary text-white">
            <FaList className="me-1" /> Lista
          </button>
          <button
            className="crud-btn crud-btn-success text-white"
            onClick={() => {
              setNombrePais("");
              setActivo(1);
              setSelectedPais(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nuevo País
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="crud-search-container">
            <FaSearch className="crud-search-icon" />
            <input
              type="text"
              className="form-control crud-search-input ps-4"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1); // Reinicia página al buscar
              }}
              placeholder="Buscar por Nombre del País..."
            />
          </div>
        </div>

        {/* Paginación y selección de items por página */}
        <div className="col-md-3">
  <div className="crud-search-container">
    <FaList className="crud-search-icon" />
    <select
      className="form-select crud-search-input ps-4"
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
      }}
    >
      {[5, 10, 25, 50].map((size) => (
        <option key={size} value={size}>
          Mostrar {size}
        </option>
      ))}
    </select>
  </div>
</div>
        </div>

      <div className="card crud-card">
        <div className="table-responsive">
          <table className="table table-hover crud-table mb-0">
            <thead>
              <tr>
                <th>País</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((pais) => (
                  <tr key={pais.idPais}>
                    <td>{pais.nombre_pais}</td>
                    <td>{pais.activo === 1 ? "ACTIVO" : "INACTIVO"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="crud-btn btn-warning text-white btn-sm"
                          onClick={() => {
                            setShowEditModal(true);
                            setSelectedPais(pais);
                            setNombrePais(pais.nombre_pais);
                            setActivo(pais.activo);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="crud-btn btn-danger btn-sm"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedPais(pais);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No hay países registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Controles de paginación */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">
          Página {currentPage} de {totalPages}
        </span>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      <PaisCRUD
        formData={{ nombre_pais, setNombrePais, activo, setActivo }}
        modals={{ showModal, setShowModal, showEditModal, setShowEditModal, showDeleteModal, setShowDeleteModal }}
        handlers={{ handleAdd, handleUpdate, handleDelete }}
        selectedPais={selectedPais}
      />
    </div>
  );
}

export default Pais;
