import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaUtensils, FaUser, FaInfoCircle } from "react-icons/fa";

import { 
  getPersonasDietasjs, 
  createPersonaDietajs, 
  updatePersonaDietajs, 
  deactivateDietajs,
  deletePersonaDietajs
} from '../../assets/js/Dieta.js';
import { getPersonas } from "../../api/Persona.api.js";
import { PersonaDietaCRUD } from './DietaCRUD.jsx';

function PersonasDietas() {
  // Estados para la lista y formulario
  const [dietaList, setDietaList] = useState([]);
  const [personasList, setPersonasList] = useState([]);
  const [dietaData, setDietaData] = useState({
    idPersona: '',
    calorias: '',
    grasas: '',
    carbohidratos: '',
    proteinas: '',
    peso_actual: '',
    activo: 1
  });

  // Estados para los modales
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Estados para búsqueda y selección
  const [searchText, setSearchText] = useState("");
  const [selectedDieta, setSelectedDieta] = useState(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estado para controlar el ancho de la pantalla
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Obtener personas y dietas al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personas, dietas] = await Promise.all([
          getPersonas(),
          getPersonasDietasjs(setDietaList)
        ]);
        
        setPersonasList(personas);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    
    fetchData();
  }, []);

  // Actualizar estado de mobile al cambiar el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtrar datos según búsqueda
  const filteredData = dietaList.filter(item => {
    const persona = personasList.find(p => p.idpersona === item.idPersona);
    const personaNombre = persona ? `${persona.nombre} ${persona.apellido}` : '';
    
    return (
      (personaNombre.toLowerCase().includes(searchText.toLowerCase())) ||
      (item?.calorias ?? "").toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Obtener nombre de persona por ID
  const getPersonaNombre = (idPersona) => {
    const persona = personasList.find(p => p.idpersona === idPersona);
    return persona ? `${persona.nombre} ${persona.apellidos}` : 'Desconocido';
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handlers para CRUD
  const handleAdd = () => {
    createPersonaDietajs(dietaData, setShowModal, () => getPersonasDietasjs(setDietaList));
  };

  const handleUpdate = () => {
    updatePersonaDietajs(selectedDieta.id, dietaData, setShowEditModal, () => getPersonasDietasjs(setDietaList));
  };

  const handleDeactivate = () => {
    deactivateDietajs(selectedDieta.id, setShowDeactivateModal, () => getPersonasDietasjs(setDietaList));
  };

  const handleDelete = () => {
    deletePersonaDietajs(selectedDieta.id, setShowDeleteModal, () => getPersonasDietasjs(setDietaList));
  };

  // Resetear formulario
  const resetForm = () => {
    setDietaData({
      idPersona: '',
      calorias: '',
      grasas: '',
      carbohidratos: '',
      proteinas: '',
      peso_actual: '',
      activo: 1
    });
  };

  // Mostrar detalles de la dieta
  const showDietaDetails = (dieta) => {
    setSelectedDieta(dieta);
    setShowDetailsModal(true);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaUtensils className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Gestión de Dietas por Persona
        </h2>
        <div className="d-flex flex-wrap gap-2">
          <button className="crud-btn crud-btn-primary text-white">
            <FaList className="me-1" /> Lista
          </button>
          <button
            className="crud-btn crud-btn-success text-white"
            onClick={() => {
              resetForm();
              setSelectedDieta(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nueva Dieta
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
                setCurrentPage(1);
              }}
              placeholder="Buscar por Nombre de Persona o Calorías..."
            />
          </div>
        </div>

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

      {/* Vista para dispositivos móviles (cards) */}
      {isMobile ? (
        <div className="row">
          {currentItems.length > 0 ? (
            currentItems.map((dieta) => (
              <div key={dieta.id} className="col-12 mb-3">
                <div className="card crud-card">
                  <div className="card-body">
                    <h5 className="card-title">{getPersonaNombre(dieta.idPersona)}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Calorías: {dieta.calorias}</h6>
                    <p className="card-text">
                      <strong>Peso Actual:</strong> {dieta.peso_actual} kg<br />
                      <strong>Estado:</strong> {dieta.activo === 1 ? "ACTIVO" : "INACTIVO"}
                    </p>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="crud-btn btn-info btn-sm text-white"
                        onClick={() => showDietaDetails(dieta)}
                      >
                        <FaInfoCircle />
                      </button>
                      <button
                        className="crud-btn btn-warning text-white btn-sm"
                        onClick={() => {
                          setShowEditModal(true);
                          setSelectedDieta(dieta);
                          setDietaData({
                            idPersona: dieta.idPersona,
                            calorias: dieta.calorias,
                            grasas: dieta.grasas,
                            carbohidratos: dieta.carbohidratos,
                            proteinas: dieta.proteinas,
                            peso_actual: dieta.peso_actual,
                            activo: dieta.activo
                          });
                        }}
                      >
                        <FaEdit />
                      </button>
                      {dieta.activo === 1 ? (
                        <button
                          className="crud-btn btn-danger btn-sm"
                          onClick={() => {
                            setShowDeactivateModal(true);
                            setSelectedDieta(dieta);
                          }}
                        >
                          <FaTrash />
                        </button>
                      ) : (
                        <button
                          className="crud-btn btn-danger btn-sm"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedDieta(dieta);
                          }}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 text-muted">
              No hay dietas registradas
            </div>
          )}
        </div>
      ) : (
        /* Vista para escritorio (tabla) */
        <div className="card crud-card">
          <div className="table-responsive">
            <table className="table table-hover crud-table mb-0">
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Calorías</th>
                  <th>Peso Actual</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((dieta) => (
                    <tr key={dieta.id}>
                      <td>{getPersonaNombre(dieta.idPersona)}</td>
                      <td>{dieta.calorias}</td>
                      <td>{dieta.peso_actual} kg</td>
                      <td>{dieta.activo === 1 ? "ACTIVO" : "INACTIVO"}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="crud-btn btn-info btn-sm text-white"
                            onClick={() => showDietaDetails(dieta)}
                          >
                            <FaInfoCircle />
                          </button>
                          <button
                            className="crud-btn btn-warning text-white btn-sm"
                            onClick={() => {
                              setShowEditModal(true);
                              setSelectedDieta(dieta);
                              setDietaData({
                                idPersona: dieta.idPersona,
                                calorias: dieta.calorias,
                                grasas: dieta.grasas,
                                carbohidratos: dieta.carbohidratos,
                                proteinas: dieta.proteinas,
                                peso_actual: dieta.peso_actual,
                                activo: dieta.activo
                              });
                            }}
                          >
                            <FaEdit />
                          </button>
                          {dieta.activo === 1 ? (
                            <button
                              className="crud-btn btn-danger btn-sm"
                              onClick={() => {
                                setShowDeactivateModal(true);
                                setSelectedDieta(dieta);
                              }}
                            >
                              <FaTrash />
                            </button>
                          ) : (
                            <button
                              className="crud-btn btn-danger btn-sm"
                              onClick={() => {
                                setShowDeleteModal(true);
                                setSelectedDieta(dieta);
                              }}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No hay dietas registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      <PersonaDietaCRUD
        formData={{ dietaData, setDietaData }}
        modals={{ 
          showModal, setShowModal, 
          showEditModal, setShowEditModal, 
          showDeactivateModal, setShowDeactivateModal,
          showDeleteModal, setShowDeleteModal 
        }}
        handlers={{ handleAdd, handleUpdate, handleDeactivate, handleDelete }}
        selectedDieta={selectedDieta}
        personasList={personasList}
      />

      {/* Modal de detalles de dieta */}
      {selectedDieta && (
        <div className={`modal fade ${showDetailsModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showDetailsModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header text-white sticky-top" style={{ backgroundColor: 'rgba(52,73,94,255)' }}>
                <h5 className="modal-title fw-bold">Detalles de la Dieta</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6><FaUser className="me-2" /> Persona</h6>
                      <p className="text-muted">{getPersonaNombre(selectedDieta.idPersona)}</p>
                    </div>
                    
                    <div className="mb-3">
                      <h6><FaUtensils className="me-2" /> Macronutrientes</h6>
                      <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Calorías
                          <span className="badge bg-primary rounded-pill">{selectedDieta.calorias}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Proteínas (g)
                          <span className="badge bg-primary rounded-pill">{selectedDieta.proteinas}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Carbohidratos (g)
                          <span className="badge bg-primary rounded-pill">{selectedDieta.carbohidratos}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Grasas (g)
                          <span className="badge bg-primary rounded-pill">{selectedDieta.grasas}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6>Peso Actual</h6>
                      <p className="text-muted">{selectedDieta.peso_actual} kg</p>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Estado</h6>
                      <p className={selectedDieta.activo === 1 ? "text-success fw-bold" : "text-danger fw-bold"}>
                        {selectedDieta.activo === 1 ? "ACTIVO" : "INACTIVO"}
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <h6>Fecha de Creación</h6>
                      <p className="text-muted">{new Date(selectedDieta.created).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer sticky-bottom bg-light">
                <button
                  type="button"
                  className="crud-btn crud-btn-primary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonasDietas;