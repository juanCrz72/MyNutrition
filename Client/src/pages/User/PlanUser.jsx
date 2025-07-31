import React, { useState, useEffect } from 'react';
import { useAuth } from '../Superadmin/AuthContext.jsx';
import { 
  FaList, FaPlus, FaSearch, FaEdit, FaTrash, 
  FaCalendarAlt, FaInfoCircle, FaSpinner 
} from 'react-icons/fa';
import { Modal, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { getPersonasPlanesjs, createPersonaPlanjs, updatePersonaPlanjs, deactivatePlanjs, deletePersonaPlanjs } from '../../assets/js/PersonaPlan.js';
import { getCat_plan } from '../../api/Plan.api.js';
import { PersonaPlanCRUD } from './../Superadmin/PersonaPlanCRUD.jsx';

const PlanesUser = () => {
  const { user } = useAuth();
  const [planesList, setPlanesList] = useState([]);
  const [filteredPlanes, setFilteredPlanes] = useState([]);
  const [planesCatalog, setPlanesCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');

  // Estados para gestión de planes
  const [idPlan, setIdPlan] = useState("");
  const [activo_plan, setActivoPlan] = useState(1);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showDeactivatePlanModal, setShowDeactivatePlanModal] = useState(false);
  const [showDeletePlanModal, setShowDeletePlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Cargar planes del usuario
  const cargarPlanes = async () => {
    setLoading(true);
    try {
      // Cargar planes del usuario
      await getPersonasPlanesjs(setPlanesList);
      
      // Cargar catálogo de planes
      const planesResponse = await getCat_plan();
      setPlanesCatalog(Array.isArray(planesResponse) ? planesResponse : []);
      
      setError('');
    } catch (error) {
      console.error('Error al cargar planes:', error);
      setError('Error al cargar los planes del usuario');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar planes por el ID del usuario y texto de búsqueda
  useEffect(() => {
    if (user?.idPersona && planesList.length > 0) {
      const filtered = planesList
        .filter(plan => plan.idPersona == user.idPersona)
        .filter(plan => {
          const searchLower = searchText.toLowerCase();
          return (
            (plan.plan_nombre?.toString() ?? "").toLowerCase().includes(searchLower) ||
            (plan.nombre?.toString() ?? "").toLowerCase().includes(searchLower) ||
            (plan.apellidos?.toString() ?? "").toLowerCase().includes(searchLower)
          );
        });
      setFilteredPlanes(filtered);
    }
  }, [user?.idPersona, planesList, searchText]);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarPlanes();
  }, []);

  // Handlers para CRUD de planes
  const handleAddPlan = () => {
    createPersonaPlanjs(user.idPersona, idPlan, setShowPlanModal, cargarPlanes);
  };

  const handleUpdatePlan = () => {
    updatePersonaPlanjs(selectedPlan.id, idPlan, activo_plan, setShowEditPlanModal, cargarPlanes);
  };

  const handleDeactivatePlan = () => {
    deactivatePlanjs(selectedPlan.id, setShowDeactivatePlanModal, cargarPlanes);
  };

  const handleDeletePlan = () => {
    deletePersonaPlanjs(selectedPlan.id, setShowDeletePlanModal, cargarPlanes);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h1 className="display-5">Planes del Usuario</h1>
        <p className="text-muted">Aquí puedes ver los planes asociados a tu cuenta</p>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="card-title">ID de la Persona</h5>
          <p className="card-text fs-4 fw-semibold text-info">
            {user?.idPersona || 'No disponible'}
          </p>
          <p className="text-muted">
            Todos los planes mostrados están asociados a este ID.
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="section-title">
          <FaList className="me-2" /> Mis Planes
        </h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setIdPlan("");
            setActivoPlan(1);
            setSelectedPlan(null);
            setShowPlanModal(true);
          }}
        >
          <FaPlus className="me-2" /> Nuevo Plan
        </button>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por nombre de plan..."
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando planes...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredPlanes.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Duración</th>
                <th>Inicio</th>
                <th>Término</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlanes.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <strong>{plan.plan_nombre}</strong>
                  </td>
                  <td>{plan.plan_duracion} días</td>
                  <td>{formatDate(plan.inicio_plan)}</td>
                  <td>{formatDate(plan.termino_plan)}</td>
                  <td>
                    <Badge bg={plan.activo_plan === 1 ? 'success' : 'secondary'}>
                      {plan.activo_plan === 1 ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                          setSelectedPlan(plan);
                          setIdPlan(plan.idPlan);
                          setActivoPlan(plan.activo_plan);
                          setShowEditPlanModal(true);
                        }}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setSelectedPlan(plan);
                          plan.activo_plan === 1 
                            ? setShowDeactivatePlanModal(true)
                            : setShowDeletePlanModal(true);
                        }}
                        title={plan.activo_plan === 1 ? 'Desactivar' : 'Eliminar'}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Alert variant="info">
          No se encontraron planes asociados a tu cuenta.
        </Alert>
      )}

      {/* Modal para gestión de planes */}
      <PersonaPlanCRUD
        formData={{ 
          idPersona: user?.idPersona, 
          idPlan, setIdPlan, 
          activo_plan, setActivoPlan,
          personasList: [{ idpersona: user?.idPersona, nombre: user?.nombre, apellidos: user?.apellidos }],
          planesCatalog
        }}
        modals={{ 
          showModal: showPlanModal, 
          setShowModal: setShowPlanModal, 
          showEditModal: showEditPlanModal, 
          setShowEditModal: setShowEditPlanModal, 
          showDeactivateModal: showDeactivatePlanModal, 
          setShowDeactivateModal: setShowDeactivatePlanModal,
          showDeleteModal: showDeletePlanModal, 
          setShowDeleteModal: setShowDeletePlanModal 
        }}
        handlers={{ 
          handleAdd: handleAddPlan, 
          handleUpdate: handleUpdatePlan, 
          handleDeactivate: handleDeactivatePlan, 
          handleDelete: handleDeletePlan 
        }}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default PlanesUser;