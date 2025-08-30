import React, { useState, useEffect } from 'react';
import { useAuth } from '../Superadmin/AuthContext.jsx';
import { 
  FaList, FaPlus, FaSearch, FaEdit, FaTrash, 
  FaCalendarAlt, FaClock, FaInfoCircle, FaSpinner,
  FaUser
} from 'react-icons/fa';
import { Modal, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { getPersonasPlanesjs, createPersonaPlanjs, updatePersonaPlanjs, deactivatePlanjs, deletePersonaPlanjs } from '../../assets/js/PersonaPlan.js';
import { getCat_plan } from '../../api/Plan.api.js';
import { PersonaPlanCRUD } from './../Superadmin/PersonaPlanCRUD.jsx';
import './css/Estilos.css';

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
      await getPersonasPlanesjs(setPlanesList);
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

  // Filtrar planes
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
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener iniciales para el avatar
  const getInitials = (name = '', lastName = '') => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="plans-management">
      <div className="plans-container">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="plans-header"
        >
          <h1 className="plans-title">Gestión de Planes</h1>
          <p className="plans-subtitle">Administra los planes asociados a tu cuenta</p>
        </motion.div>



        {/* Sección de planes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">
              <FaList /> Mis Planes
            </h2>
            <motion.button
              className="add-plan-btn"
              onClick={() => {
                setIdPlan("");
                setActivoPlan(1);
                setSelectedPlan(null);
                setShowPlanModal(true);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> Nuevo Plan
            </motion.button>
          </div>
          
          {/* Buscador */}
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar planes por nombre..."
            />
          </div>
          
          {/* Contenido */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <h3 className="empty-title">Cargando tus planes...</h3>
              <p className="empty-description">Por favor espera un momento</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">{error}</Alert>
          ) : filteredPlanes.length > 0 ? (
            <div className="plans-grid">
              {filteredPlanes.map((plan) => (
                <motion.div
                  key={plan.id}
                  className="plan-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                >
                  <div className="plan-header">
                    <h3 className="plan-name">{plan.plan_nombre}</h3>
                    <span className={`plan-status ${plan.activo_plan === 1 ? 'status-active' : 'status-inactive'}`}>
                      {plan.activo_plan === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <div className="plan-details">
                    <div className="plan-detail">
                      <span className="plan-icon"><FaClock /></span>
                      Duración: {plan.plan_duracion} días
                    </div>
                    <div className="plan-detail">
                      <span className="plan-icon"><FaCalendarAlt /></span>
                      Inicio: {formatDate(plan.inicio_plan)}
                    </div>
                    <div className="plan-detail">
                      <span className="plan-icon"><FaCalendarAlt /></span>
                      Termino: {formatDate(plan.termino_plan)}
                    </div>
                  </div>
                  
               <div className="plan-actions">
 {/*  <motion.button
    className="action-icon-btn edit-icon-btn"
    onClick={() => {
      setSelectedPlan(plan);
      setIdPlan(plan.idPlan);
      setActivoPlan(plan.activo_plan);
      setShowEditPlanModal(true);
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    title="Editar plan"
  >
    <FaEdit />
  </motion.button> */}

  <motion.button
    className="action-icon-btn delete-icon-btn"
    onClick={() => {
      setSelectedPlan(plan);
      plan.activo_plan === 1 
        ? setShowDeactivatePlanModal(true)
        : setShowDeletePlanModal(true);
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    title={plan.activo_plan === 1 ? 'Desactivar plan' : 'Eliminar plan'}
  >
    <FaTrash />
  </motion.button>
</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <FaInfoCircle />
              </div>
              <h3 className="empty-title">No tienes planes registrados</h3>
              <p className="empty-description">
                Comienza agregando un nuevo plan para disfrutar de todos los beneficios
              </p>
              <motion.button
                className="add-plan-btn"
                onClick={() => setShowPlanModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus /> Agregar Primer Plan
              </motion.button>
            </div>
          )}
        </motion.div>

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
    </div>
  );
};

export default PlanesUser;