import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaIdCard, FaCalendarAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import { getPersonasPlanesjs, createPersonaPlanjs, updatePersonaPlanjs, deactivatePlanjs, deletePersonaPlanjs } from '../../assets/js/PersonaPlan.js';
import { PersonaPlanCRUD } from './PersonaPlanCRUD.jsx';
import { getPersonas } from '../../api/Persona.api.js';
import { getCat_plan } from '../../api/Plan.api.js';

function PersonasPlan() {
  const [planesList, setPlanesList] = useState([]);
  const [personasList, setPersonasList] = useState([]);
  const [planesCatalog, setPlanesCatalog] = useState([]);
  
  const [idPersona, setIdPersona] = useState("");
  const [idPlan, setIdPlan] = useState("");
  const [activo_plan, setActivoPlan] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

 useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Opción 1: Si las APIs retornan los datos directamente (sin .data)
      const [personas, planes, personasPlanes] = await Promise.all([
        getPersonas(),
        getCat_plan(),
        getPersonasPlanesjs(setPlanesList)
      ]);

      console.log('Personas:', personas); // Ver estructura real
      console.log('Planes:', planes); // Ver estructura real

      setPersonasList(Array.isArray(personas) ? personas : []);
      setPlanesCatalog(Array.isArray(planes) ? planes : []);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error cargando datos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los datos iniciales',
      });
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

  const filteredData = planesList.filter(item =>
    (item?.nombre ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (item?.apellidos ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (item?.plan_nombre ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    createPersonaPlanjs(idPersona, idPlan, setShowModal, () => getPersonasPlanesjs(setPlanesList));
  };

  const handleUpdate = () => {
    updatePersonaPlanjs(selectedPlan.id, idPlan, activo_plan, setShowEditModal, () => getPersonasPlanesjs(setPlanesList));
  };

  const handleDeactivate = () => {
    deactivatePlanjs(selectedPlan.id, setShowDeactivateModal, () => getPersonasPlanesjs(setPlanesList));
  };

  const handleDelete = () => {
    deletePersonaPlanjs(selectedPlan.id, setShowDeleteModal, () => getPersonasPlanesjs(setPlanesList));
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaIdCard className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Planes de Personas
        </h2>
        <div className="d-flex flex-wrap gap-2">
          <button className="crud-btn crud-btn-primary text-white">
            <FaList className="me-1" /> Lista
          </button>
          <button
            className="crud-btn crud-btn-success text-white"
            onClick={() => {
              setIdPersona("");
              setIdPlan("");
              setActivoPlan(1);
              setSelectedPlan(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Asignar Plan
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
              placeholder="Buscar por Nombre, Apellido o Plan..."
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

      <div className="card crud-card">
        <div className="table-responsive">
          <table className="table table-hover crud-table mb-0">
            <thead>
              <tr>
                <th>Persona</th>
                <th>Plan</th>
                <th>Duración</th>
                <th>Inicio</th>
                <th>Término</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((plan) => (
                  <tr key={plan.id}>
                    <td>{plan.nombre} {plan.apellidos}</td>
                    <td>{plan.plan_nombre}</td>
                    <td>{plan.plan_duracion} días</td>
                    <td>{new Date(plan.inicio_plan).toLocaleDateString()}</td>
                    <td>{new Date(plan.termino_plan).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${plan.activo_plan === 1 ? 'bg-success' : 'bg-secondary'}`}>
                        {plan.activo_plan === 1 ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="crud-btn btn-warning text-white btn-sm"
                          onClick={() => {
                            setShowEditModal(true);
                            setSelectedPlan(plan);
                            setIdPlan(plan.idPlan);
                            setActivoPlan(plan.activo_plan);
                          }}
                        >
                          <FaEdit />
                        </button>
{/*                         <button
                          className="crud-btn btn-secondary btn-sm"
                          onClick={() => {
                            setShowDeactivateModal(true);
                            setSelectedPlan(plan);
                          }}
                          disabled={plan.activo_plan === 0}
                        >
                          <FaCalendarAlt />
                        </button> */}
                        <button
                          className="crud-btn btn-danger btn-sm"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedPlan(plan);
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
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No hay planes asignados
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
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

       {dataLoaded && (
        <PersonaPlanCRUD
          formData={{ 
            idPersona, setIdPersona, 
            idPlan, setIdPlan, 
            activo_plan, setActivoPlan,
            personasList,
            planesCatalog
          }}
          modals={{ 
            showModal, setShowModal, 
            showEditModal, setShowEditModal, 
            showDeactivateModal, setShowDeactivateModal,
            showDeleteModal, setShowDeleteModal 
          }}
          handlers={{ handleAdd, handleUpdate, handleDeactivate, handleDelete }}
          selectedPlan={selectedPlan}
        />
      )}
    </div>
  );
}

export default PersonasPlan;