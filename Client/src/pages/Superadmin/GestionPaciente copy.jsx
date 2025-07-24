import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPersonaById } from '../../api/PersonaImage.api.js';
import { 
  FaArrowLeft, FaCalendarAlt, FaUser, FaWeight, FaRulerVertical, 
  FaGlobe, FaVenusMars, FaUtensils, FaPlus, FaSearch, FaEdit, 
  FaTrash, FaInfoCircle, FaFileUpload, FaTimes, FaIdCard, FaList,
  FaFire, FaBreadSlice, FaEgg, FaCheese, FaChartLine, FaHistory,
  FaRunning, FaAllergies, FaBullseye, FaHeartbeat, FaExclamationTriangle
} from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import { MdOutlineMedicalServices } from 'react-icons/md';
import { RiMentalHealthLine } from 'react-icons/ri';
import { Tab, Tabs, Alert, Spinner, ButtonGroup, Button, Badge, Modal } from 'react-bootstrap';
import { 
  getPersonasDietasjs, 
  createPersonaDietajs, 
  updatePersonaDietajs, 
  deactivateDietajs,
  deletePersonaDietajs
} from '../../assets/js/Dieta.js';
import { PersonaDietaCRUD } from './DietaCRUD.jsx';
import {
  subirImagenPersona,
  obtenerImagenPersona,
  eliminarImagenPorId
} from '../../api/DocumentosPersonas.api.js';
import { getPersonasPlanesjs, createPersonaPlanjs, updatePersonaPlanjs, deactivatePlanjs, deletePersonaPlanjs } from '../../assets/js/PersonaPlan.js';
import { PersonaPlanCRUD } from './PersonaPlanCRUD.jsx';
import { getCat_plan } from '../../api/Plan.api.js';
import { getQuestionariosjs } from '../../assets/js/Cuestionario.js';
import './css/Kardex.css'; // Archivo CSS adicional para estilos personalizados

const NutritionDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingImagenes, setLoadingImagenes] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('datos-generales');
  const [imc, setImc] = useState(null);

  // Estados para la gestión de dietas
  const [dietaList, setDietaList] = useState([]);
  const [dietaData, setDietaData] = useState({
    idPersona: '',
    calorias: '',
    grasas: '',
    carbohidratos: '',
    proteinas: '',
    peso_actual: ''
  });
  const [showDietaModal, setShowDietaModal] = useState(false);
  const [showEditDietaModal, setShowEditDietaModal] = useState(false);
  const [showDeactivateDietaModal, setShowDeactivateDietaModal] = useState(false);
  const [showDeleteDietaModal, setShowDeleteDietaModal] = useState(false);
  const [showDetailsDietaModal, setShowDetailsDietaModal] = useState(false);
  const [selectedDieta, setSelectedDieta] = useState(null);
  const [searchDietaText, setSearchDietaText] = useState("");

  // Estados para la gestión de planes
  const [planesList, setPlanesList] = useState([]);
  const [planesCatalog, setPlanesCatalog] = useState([]);
  const [idPlan, setIdPlan] = useState("");
  const [activo_plan, setActivoPlan] = useState(1);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showDeactivatePlanModal, setShowDeactivatePlanModal] = useState(false);
  const [showDeletePlanModal, setShowDeletePlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchPlanText, setSearchPlanText] = useState("");
  const [loadingPlanes, setLoadingPlanes] = useState(false);

  // Estados para la gestión de imágenes/documentos
  const [imagenes, setImagenes] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [mensajeImagenes, setMensajeImagenes] = useState({ texto: '', tipo: '' });
  const [showSubirImagenModal, setShowSubirImagenModal] = useState(false);
  const [showConfirmDeleteImage, setShowConfirmDeleteImage] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // Estados para el cuestionario de salud
  const [questionarios, setQuestionarios] = useState([]);
  const [cuestionarioPaciente, setCuestionarioPaciente] = useState(null);

  // Obtener el ID de la URL
  const searchParams = new URLSearchParams(location.search);
  const idpersona = searchParams.get('idpersona');

  // Calcular IMC
  const calcularIMC = (peso, altura) => {
    if (!peso || !altura) return null;
    const alturaMetros = altura / 100;
    return (peso / (alturaMetros * alturaMetros)).toFixed(1);
  };

  // Formatear respuestas Sí/No
  const formatSiNo = (value) => value === '1' ? 'Sí' : 'No';

  // Obtener descripción de actividad física
  const getActividadDescripcion = (nivel) => {
    switch(nivel) {
      case 'sedentario':
        return 'Trabaja en una oficina, muy poca actividad física (sedentario)';
      case 'ligero':
        return 'Trabaja en una oficina, pero lleva mascota a pasear algunos días, o toma algunas escaleras';
      case 'moderado':
        return 'Moderadamente activo, algo de ejercicio y algunas actividades físicas adicionales';
      case 'activo':
        return 'Camarera a tiempo completo, enfermera, agente de bienes raíces y algo de ejercicio';
      case 'intenso':
        return 'Trabajo de alta intensidad como trabajador de construcción, o un atleta que hace ejercicio dos veces al día';
      default:
        return 'No especificado';
    }
  };

  // Estilo para nivel de actividad
  const getActivityLevelStyle = (level) => {
    const styles = {
      sedentario: 'bg-secondary',
      ligero: 'bg-info',
      moderado: 'bg-primary',
      activo: 'bg-warning text-dark',
      intenso: 'bg-danger'
    };
    return styles[level] || 'bg-light text-dark';
  };

  // Cargar imágenes del paciente
  const cargarImagenes = async () => {
    setLoadingImagenes(true);
    try {
      const response = await obtenerImagenPersona(idpersona);
      setImagenes(Array.isArray(response) ? response : (response.data || []));
      setMensajeImagenes({ texto: '', tipo: '' });
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
      setMensajeImagenes({ texto: 'Error al cargar las imágenes', tipo: 'danger' });
      setImagenes([]);
    } finally {
      setLoadingImagenes(false);
    }
  };

  // Cargar planes del paciente
  const cargarPlanes = async () => {
    setLoadingPlanes(true);
    try {
      await getPersonasPlanesjs(setPlanesList);
      
      // Cargar catálogo de planes
      const planesResponse = await getCat_plan();
      setPlanesCatalog(Array.isArray(planesResponse) ? planesResponse : []);
    } catch (error) {
      console.error('Error al cargar planes:', error);
    } finally {
      setLoadingPlanes(false);
    }
  };

  // Cargar cuestionarios de salud
  const cargarCuestionarios = async () => {
    try {
      await getQuestionariosjs(setQuestionarios);
      
      // Filtrar cuestionario del paciente actual
      const cuestionario = questionarios.find(q => q.id_persona == idpersona);
      setCuestionarioPaciente(cuestionario || null);
    } catch (error) {
      console.error('Error al cargar cuestionarios:', error);
    }
  };

  // Manejar subida de imagen
  const handleSubirImagen = async (e) => {
    e.preventDefault();
    if (!archivo || !idpersona) {
      setMensajeImagenes({ texto: 'Por favor, selecciona un archivo', tipo: 'warning' });
      return;
    }

    setLoadingImagenes(true);
    try {
      await subirImagenPersona(idpersona, archivo);
      setMensajeImagenes({ texto: 'Imagen subida correctamente.', tipo: 'success' });
      setArchivo(null);
      setShowSubirImagenModal(false);
      await cargarImagenes();
    } catch (error) {
      setMensajeImagenes({ texto: 'Error al subir la imagen.', tipo: 'danger' });
    } finally {
      setLoadingImagenes(false);
    }
  };

  // Manejar eliminación de imagen
  const handleEliminarImagen = async (idImagen) => {
    setImageToDelete(idImagen);
    setShowConfirmDeleteImage(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;
    
    setLoadingImagenes(true);
    try {
      await eliminarImagenPorId(imageToDelete);
      setImagenes(prev => prev.filter(img => img.id !== imageToDelete));
      setMensajeImagenes({ texto: 'Imagen eliminada correctamente.', tipo: 'success' });
    } catch (err) {
      console.error('Error al eliminar imagen:', err);
      setMensajeImagenes({ texto: err.message || 'Error al eliminar la imagen.', tipo: 'danger' });
    } finally {
      setLoadingImagenes(false);
      setShowConfirmDeleteImage(false);
      setImageToDelete(null);
    }
  };

  // Handlers para CRUD de planes
  const handleAddPlan = () => {
    createPersonaPlanjs(idpersona, idPlan, setShowPlanModal, cargarPlanes);
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

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!idpersona) {
          setError('No se ha especificado un ID de paciente');
          setLoading(false);
          return;
        }

        // Cargar datos del paciente
        const response = await getPersonaById(idpersona);
        if (!response.data) {
          setError('No se encontró información del paciente');
          setLoading(false);
          return;
        }
        
        setPaciente(response.data);
        
        // Calcular IMC
        if (response.data.peso && response.data.altura) {
          setImc(calcularIMC(response.data.peso, response.data.altura));
        }
        
        // Cargar dietas del paciente
        await getPersonasDietasjs(setDietaList);
        
        // Cargar planes del paciente
        await cargarPlanes();
        
        // Cargar imágenes del paciente
        await cargarImagenes();
        
        // Cargar cuestionarios de salud
        await cargarCuestionarios();
        
        // Setear el idPersona en dietaData
        setDietaData(prev => ({
          ...prev,
          idPersona: idpersona
        }));
        
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del paciente');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idpersona]);

  // Filtrar dietas por el ID del paciente y por búsqueda
  const filteredDietas = dietaList
    .filter(dieta => dieta.idPersona == idpersona)
    .filter(dieta => {
      const searchLower = searchDietaText.toLowerCase();
      return (
        (dieta.calorias?.toString() ?? "").toLowerCase().includes(searchLower) ||
        (dieta.peso_actual?.toString() ?? "").toLowerCase().includes(searchLower)
      );
    });

  // Filtrar planes por el ID del paciente y por búsqueda
  const filteredPlanes = planesList
    .filter(plan => plan.idPersona == idpersona)
    .filter(plan => {
      const searchLower = searchPlanText.toLowerCase();
      return (
        (plan.plan_nombre?.toString() ?? "").toLowerCase().includes(searchLower) ||
        (plan.nombre?.toString() ?? "").toLowerCase().includes(searchLower) ||
        (plan.apellidos?.toString() ?? "").toLowerCase().includes(searchLower)
      );
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Handlers para CRUD de dietas
  const handleAddDieta = () => {
    createPersonaDietajs(dietaData, setShowDietaModal, () => getPersonasDietasjs(setDietaList));
  };

  const handleUpdateDieta = () => {
    updatePersonaDietajs(selectedDieta.id, dietaData, setShowEditDietaModal, () => getPersonasDietasjs(setDietaList));
  };

  const handleDeactivateDieta = () => {
    deactivateDietajs(selectedDieta.id, setShowDeactivateDietaModal, () => getPersonasDietasjs(setDietaList));
  };

  const handleDeleteDieta = () => {
    deletePersonaDietajs(selectedDieta.id, setShowDeleteDietaModal, () => getPersonasDietasjs(setDietaList));
  };

  const resetDietaForm = () => {
    setDietaData({
      idPersona: idpersona,
      calorias: '',
      grasas: '',
      carbohidratos: '',
      proteinas: '',
      peso_actual: ''
    });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3">Cargando información del paciente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-2" />
            Volver
          </button>
        </Alert>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          <p>No se encontró información del paciente</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-2" />
            Volver
          </button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="nutrition-dashboard">
      {/* Cabecera del Paciente */}
      <div className="patient-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button className="btn btn-back" onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-2" />
              Volver
            </button>
            
            <div className="patient-status-badge">
              <Badge bg={paciente.activo ? 'success' : 'secondary'}>
                {paciente.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>

          <div className="patient-profile-card">
            <div className="profile-section">
              {paciente.img_perfil ? (
                <img 
                  src={paciente.img_perfil} 
                  alt={`${paciente.nombre} ${paciente.apellidos}`}
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <FaUser size={24} className="text-secondary" />
                </div>
              )}
              
              <div className="profile-info">
                <h2 className="patient-name">{paciente.nombre} {paciente.apellidos}</h2>
                <p className="patient-id">ID: {paciente.idpersona}</p>
              </div>
            </div>

            <div className="patient-metrics">
              <div className="metric-card">
                <div className="metric-icon">
                  <FaWeight />
                </div>
                <div className="metric-content">
                  <h5>Peso Actual</h5>
                  <p>{paciente.peso || '--'} kg</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <FaRulerVertical />
                </div>
                <div className="metric-content">
                  <h5>Altura</h5>
                  <p>{paciente.altura || '--'} cm</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <FaFire />
                </div>
                <div className="metric-content">
                  <h5>IMC</h5>
                  <p>{imc || '--'}</p>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon">
                  <FaChartLine />
                </div>
                <div className="metric-content">
                  <h5>Plan Actual</h5>
                  <p>{filteredPlanes.find(p => p.activo_plan === 1)?.plan_nombre || '--'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="container">
        <div className="dashboard-tabs">
          <ButtonGroup className="tab-navigation">
            <Button
              variant={activeTab === 'datos-generales' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('datos-generales')}
            >
              <FaUser className="me-2" /> Datos Generales
            </Button>
            <Button
              variant={activeTab === 'dietas' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('dietas')}
            >
              <FaUtensils className="me-2" /> Dietas
            </Button>
            <Button
              variant={activeTab === 'documentos' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('documentos')}
            >
              <FaFileUpload className="me-2" /> Documentos/Fotos
            </Button>
            <Button
              variant={activeTab === 'planes' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('planes')}
            >
              <FaList className="me-2" /> Planes
            </Button>
          </ButtonGroup>
        </div>

        {/* Contenido de las pestañas */}
        <div className="tab-content">
          {/* Pestaña de Datos Generales */}
          {activeTab === 'datos-generales' && (
            <div className="tab-pane fade show active">
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="info-card">
                    <h4 className="card-title">
                      <FaUser className="me-2" /> Información Personal
                    </h4>
                    <ul className="info-list">
                      <li className="info-item">
                        <span className="info-label"><FaVenusMars className="me-2" />Sexo</span>
                        <span className="info-value">{paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'Otro'}</span>
                      </li>
                      <li className="info-item">
                        <span className="info-label"><FaCalendarAlt className="me-2" />Fecha de Nacimiento</span>
                        <span className="info-value">{formatDate(paciente.fecha_nacimiento)}</span>
                      </li>
                      <li className="info-item">
                        <span className="info-label"><FaUser className="me-2" />Edad</span>
                        <span className="info-value">{paciente.edad} años</span>
                      </li>
                    </ul>
                  </div>

                  {/* Información de Salud */}
                  {cuestionarioPaciente && (
                    <div className="info-card mt-4">
                      <h4 className="card-title">
                        <GiHealthNormal className="me-2" /> Información de Salud
                      </h4>
                      <div className="health-info-section">
                        <div className="health-info-item">
                          <h6><FaRunning className="me-2" /> Nivel de Actividad</h6>
                          <div className="d-flex align-items-center">
                            <Badge pill className={`me-2 ${getActivityLevelStyle(cuestionarioPaciente.act_fisica)}`}>
                              {cuestionarioPaciente.act_fisica}
                            </Badge>
                            <small className="text-muted">
                              {getActividadDescripcion(cuestionarioPaciente.act_fisica)}
                            </small>
                          </div>
                        </div>

                        <div className="health-info-item">
                          <h6><MdOutlineMedicalServices className="me-2" /> Condiciones Médicas</h6>
                          <ul className="health-conditions-list">
                            <li className={cuestionarioPaciente.diabetes === '1' ? 'text-danger fw-bold' : ''}>
                              Diabetes: {formatSiNo(cuestionarioPaciente.diabetes)}
                            </li>
                            <li className={cuestionarioPaciente.hipertension === '1' ? 'text-danger fw-bold' : ''}>
                              Hipertensión: {formatSiNo(cuestionarioPaciente.hipertension)}
                            </li>
                            <li className={cuestionarioPaciente.otra_enfermedad === '1' ? 'text-danger fw-bold' : ''}>
                              Otras condiciones: {formatSiNo(cuestionarioPaciente.otra_enfermedad)}
                              {cuestionarioPaciente.otra_enfermedad === '1' && cuestionarioPaciente.otra_enfermedad_desc && (
                                <div className="small text-muted mt-1">
                                  {cuestionarioPaciente.otra_enfermedad_desc}
                                </div>
                              )}
                            </li>
                          </ul>
                        </div>

                        {cuestionarioPaciente.alergias && (
                          <div className="health-info-item">
                            <h6><FaAllergies className="me-2 text-warning" /> Alergias</h6>
                            <div className="alert alert-warning p-2 mb-0">
                              {cuestionarioPaciente.alergias}
                            </div>
                          </div>
                        )}

                        {cuestionarioPaciente.metas && (
                          <div className="health-info-item">
                            <h6><FaBullseye className="me-2 text-info" /> Metas de Salud</h6>
                            <div className="alert alert-info p-2 mb-0">
                              {cuestionarioPaciente.metas}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <div className="info-card">
                    <h4 className="card-title">
                      <FaWeight className="me-2" /> Medidas Físicas
                    </h4>
                    <ul className="info-list">
                      <li className="info-item">
                        <span className="info-label"><FaRulerVertical className="me-2" />Altura</span>
                        <span className="info-value">{paciente.altura} cm</span>
                      </li>
                      <li className="info-item">
                        <span className="info-label"><FaWeight className="me-2" />Peso</span>
                        <span className="info-value">{paciente.peso} kg</span>
                      </li>
                      <li className="info-item">
                        <span className="info-label"><FaFire className="me-2" />IMC</span>
                        <span className="info-value">{imc || '--'}</span>
                      </li>
                      <li className="info-item">
                        <span className="info-label"><FaGlobe className="me-2" />País</span>
                        <span className="info-value">{paciente.nombre_pais || 'No especificado'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Información adicional si no hay cuestionario */}
                  {!cuestionarioPaciente && (
                    <div className="info-card mt-4">
                      <h4 className="card-title">
                        <GiHealthNormal className="me-2" /> Información de Salud
                      </h4>
                      <Alert variant="info" className="mb-0">
                        No se ha completado el cuestionario de salud para este paciente.
                      </Alert>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="d-flex justify-content-end mt-4">
                {/*     <button 
                      className="btn btn-edit"
                      onClick={() => navigate(`/editar-paciente?idpersona=${paciente.idpersona}`)}
                    >
                      <FaEdit className="me-2" /> Editar Paciente
                    </button> */}
              </div>
            </div>
          )}

          {/* Pestaña de Dietas */}
          {activeTab === 'dietas' && (
            <div className="tab-pane fade show active">
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="section-title">
                    <FaUtensils className="me-2" /> Dietas del Paciente
                  </h3>
<button
  className="btn btn-add p-2 p-md-2 rounded-pill shadow-sm"
  onClick={() => {
    resetDietaForm();
    setSelectedDieta(null);
    setShowDietaModal(true);
  }}
>
  <div className="d-flex align-items-center justify-content-center">
    <FaPlus className="flex-shrink-0" />
    <span className="d-none d-md-inline ms-2">Nueva Dieta</span>
  </div>
</button>

                  
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="search-box">
                      <FaSearch className="search-icon" />
                      <input
                        type="text"
                        className="form-control search-input"
                        value={searchDietaText}
                        onChange={(e) => setSearchDietaText(e.target.value)}
                        placeholder="Buscar por calorías o peso..."
                      />
                    </div>
                  </div>
                </div>
                
                {filteredDietas.length > 0 ? (
                  <>
                    {/* Vista de tarjetas para móvil */}
                    <div className="d-block d-md-none">
                      {filteredDietas.map((dieta) => (
                        <div key={`dieta-card-${dieta.id}`} className="card dieta-card mb-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="card-title">
                                  <FaFire className="text-warning me-2" />
                                  {dieta.calorias} kcal
                                </h5>
                                <p className="card-text">{dieta.peso_actual} kg</p>
                              </div>
                              <span className={`status-badge ${dieta.activo === 1 ? 'active' : 'inactive'}`}>
                                {dieta.activo === 1 ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                            
                            <div className="macronutrients-card mt-2">
                              <div className="macronutrient-item">
                                <span className="badge bg-protein me-1">
                                  <FaEgg className="me-1" /> {dieta.proteinas}g
                                </span>
                                <span className="badge bg-carbs me-1">
                                  <FaBreadSlice className="me-1" /> {dieta.carbohidratos}g
                                </span>
                                <span className="badge bg-fat">
                                  <FaCheese className="me-1" /> {dieta.grasas}g
                                </span>
                              </div>
                            </div>
                            
                            <div className="d-flex justify-content-end mt-3">
                              <button
                                className="btn btn-sm btn-info me-2"
                                onClick={() => {
                                  setSelectedDieta(dieta);
                                  setShowDetailsDietaModal(true);
                                }}
                                title="Detalles"
                              >
                                <FaInfoCircle />
                              </button>
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => {
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
                                  setShowEditDietaModal(true);
                                }}
                                title="Editar"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                  setSelectedDieta(dieta);
                                  dieta.activo === 1 
                                    ? setShowDeactivateDietaModal(true)
                                    : setShowDeleteDietaModal(true);
                                }}
                                title={dieta.activo === 1 ? 'Desactivar' : 'Eliminar'}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Vista de tabla para escritorio */}
                    <div className="d-none d-md-block">
                      <div className="table-responsive">
                        <table className="table table-hover dietas-table">
                          <thead>
                            <tr>
                              <th>Calorías</th>
                              <th>Peso Actual</th>
                              <th>Macronutrientes</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDietas.map((dieta) => (
                              <tr key={`dieta-${dieta.id}`}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <FaFire className="text-warning me-2" />
                                    {dieta.calorias} kcal
                                  </div>
                                </td>
                                <td>{dieta.peso_actual} kg</td>
                                <td>
                                  <div className="macronutrients">
                                    <span className="badge bg-protein me-1">
                                      <FaEgg className="me-1" /> {dieta.proteinas}g
                                    </span>
                                    <span className="badge bg-carbs me-1">
                                      <FaBreadSlice className="me-1" /> {dieta.carbohidratos}g
                                    </span>
                                    <span className="badge bg-fat">
                                      <FaCheese className="me-1" /> {dieta.grasas}g
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span className={`status-badge ${dieta.activo === 1 ? 'active' : 'inactive'}`}>
                                    {dieta.activo === 1 ? 'Activo' : 'Inactivo'}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-buttons">
                                    <button
                                      className="btn btn-sm btn-info"
                                      onClick={() => {
                                        setSelectedDieta(dieta);
                                        setShowDetailsDietaModal(true);
                                      }}
                                      title="Detalles"
                                    >
                                      <FaInfoCircle />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-warning"
                                      onClick={() => {
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
                                        setShowEditDietaModal(true);
                                      }}
                                      title="Editar"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => {
                                        setSelectedDieta(dieta);
                                        dieta.activo === 1 
                                          ? setShowDeactivateDietaModal(true)
                                          : setShowDeleteDietaModal(true);
                                      }}
                                      title={dieta.activo === 1 ? 'Desactivar' : 'Eliminar'}
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
                    </div>
                  </>
                ) : (
                  <Alert variant="info" className="no-results-alert">
                    No se encontraron dietas registradas para este paciente.
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Pestaña de Documentos/Fotos */}
          {activeTab === 'documentos' && (
            <div className="tab-pane fade show active">
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="section-title">
                    <FaFileUpload className="me-2" /> Documentos y Fotos del Paciente
                  </h3>

                  <button
                    className="btn btn-add p-2 p-md-2 rounded-pill shadow-sm"
                    onClick={() => setShowSubirImagenModal(true)}
                  >
                     <div className="d-flex align-items-center justify-content-center">
                     <FaPlus className="flex-shrink-0" />
                     <span className="d-none d-md-inline ms-2">Subir Documento/Foto</span>
                    </div>
                  </button>
                </div>


                {mensajeImagenes.texto && (
                  <Alert variant={mensajeImagenes.tipo} onClose={() => setMensajeImagenes({ texto: '', tipo: '' })} dismissible>
                    {mensajeImagenes.texto}
                  </Alert>
                )}
                
                {loadingImagenes ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Cargando documentos/fotos...</p>
                  </div>
                ) : (
                  <>
                    {imagenes && imagenes.length > 0 ? (
                      <div className="gallery-container">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                          {imagenes.map((img) => (
                            <div key={img.id} className="col">
                              <div className="gallery-card">
                                <div className="gallery-image-container">
                                  <img
                                    src={`/${img.localizacion}`}
                                    className="gallery-image"
                                    alt={img.nombre_original}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/images/no-image.png';
                                    }}
                                  />
                                  <button
                                    className="btn btn-delete-image"
                                    onClick={() => handleEliminarImagen(img.id)}
                                    disabled={loadingImagenes}
                                    title="Eliminar"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                                <div className="gallery-caption">
                                  <p className="gallery-caption-text">
                                    {img.nombre_original}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Alert variant="info" className="no-results-alert">
                        No se encontraron documentos ni fotos para este paciente.
                      </Alert>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Pestaña de Planes */}
          {activeTab === 'planes' && (
            <div className="tab-pane fade show active">
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="section-title">
                    <FaList className="me-2" /> Planes del Paciente
                  </h3>
                  <button
                     className="btn btn-add p-2 p-md-2 rounded-pill shadow-sm"
                    onClick={() => {
                      setIdPlan("");
                      setActivoPlan(1);
                      setSelectedPlan(null);
                      setShowPlanModal(true);
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                     <FaPlus className="flex-shrink-0" />
                     <span className="d-none d-md-inline ms-2">Asignar Plan</span>
                    </div>
                  </button>
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="search-box">
                      <FaSearch className="search-icon" />
                      <input
                        type="text"
                        className="form-control search-input"
                        value={searchPlanText}
                        onChange={(e) => setSearchPlanText(e.target.value)}
                        placeholder="Buscar por nombre de plan..."
                      />
                    </div>
                  </div>
                </div>
                
                {loadingPlanes ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Cargando planes...</p>
                  </div>
                ) : filteredPlanes.length > 0 ? (
                  <>
                    {/* Vista de tarjetas para móvil */}
                    <div className="d-block d-md-none">
                      {filteredPlanes.map((plan) => (
                        <div key={`plan-card-${plan.id}`} className="card plan-card mb-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="card-title">{plan.plan_nombre}</h5>
                                <p className="card-text">
                                  <small className="text-muted">
                                    {plan.plan_duracion} días | {new Date(plan.inicio_plan).toLocaleDateString()} - {new Date(plan.termino_plan).toLocaleDateString()}
                                  </small>
                                </p>
                              </div>
                              <span className={`status-badge ${plan.activo_plan === 1 ? 'active' : 'inactive'}`}>
                                {plan.activo_plan === 1 ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                            
                            <div className="d-flex justify-content-end mt-3">
                              <button
                                className="btn btn-sm btn-warning me-2"
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
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Vista de tabla para escritorio */}
                    <div className="d-none d-md-block">
                      <div className="table-responsive">
                        <table className="table table-hover planes-table">
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
                              <tr key={`plan-${plan.id}`}>
                                <td>
                                  <strong>{plan.plan_nombre}</strong>
                                </td>
                                <td>{plan.plan_duracion} días</td>
                                <td>{new Date(plan.inicio_plan).toLocaleDateString()}</td>
                                <td>{new Date(plan.termino_plan).toLocaleDateString()}</td>
                                <td>
                                  <span className={`status-badge ${plan.activo_plan === 1 ? 'active' : 'inactive'}`}>
                                    {plan.activo_plan === 1 ? 'Activo' : 'Inactivo'}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-buttons">
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
                    </div>
                  </>
                ) : (
                  <Alert variant="info" className="no-results-alert">
                    No se encontraron planes asignados para este paciente.
                  </Alert>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modales para gestión de dietas */}
      <PersonaDietaCRUD
        formData={{ dietaData, setDietaData }}
        modals={{ 
          showModal: showDietaModal, 
          setShowModal: setShowDietaModal, 
          showEditModal: showEditDietaModal, 
          setShowEditModal: setShowEditDietaModal, 
          showDeactivateModal: showDeactivateDietaModal, 
          setShowDeactivateModal: setShowDeactivateDietaModal,
          showDeleteModal: showDeleteDietaModal, 
          setShowDeleteModal: setShowDeleteDietaModal 
        }}
        handlers={{ 
          handleAdd: handleAddDieta, 
          handleUpdate: handleUpdateDieta, 
          handleDeactivate: handleDeactivateDieta, 
          handleDelete: handleDeleteDieta 
        }}
        selectedDieta={selectedDieta}
        personasList={[paciente]}
      />

      {/* Modales para gestión de planes */}
      <PersonaPlanCRUD
        formData={{ 
          idPersona: idpersona, 
          idPlan, setIdPlan, 
          activo_plan, setActivoPlan,
          personasList: [paciente],
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

      {/* Modal de detalles de dieta */}
      {selectedDieta && (
        <div className={`modal fade ${showDetailsDietaModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showDetailsDietaModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Detalles de la Dieta</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowDetailsDietaModal(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <h6><FaUser className="me-2" /> Paciente</h6>
                      <p className="text-muted">{paciente.nombre} {paciente.apellidos}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h6><FaUtensils className="me-2" /> Macronutrientes</h6>
                      <ul className="macronutrients-list">
                        <li className="macronutrient-item">
                          <div className="macronutrient-icon bg-calories">
                            <FaFire />
                          </div>
                          <div className="macronutrient-info">
                            <span className="macronutrient-name">Calorías</span>
                            <span className="macronutrient-value">{selectedDieta.calorias} kcal</span>
                          </div>
                        </li>
                        <li className="macronutrient-item">
                          <div className="macronutrient-icon bg-protein">
                            <FaEgg />
                          </div>
                          <div className="macronutrient-info">
                            <span className="macronutrient-name">Proteínas</span>
                            <span className="macronutrient-value">{selectedDieta.proteinas}g</span>
                          </div>
                        </li>
                        <li className="macronutrient-item">
                          <div className="macronutrient-icon bg-carbs">
                            <FaBreadSlice />
                          </div>
                          <div className="macronutrient-info">
                            <span className="macronutrient-name">Carbohidratos</span>
                            <span className="macronutrient-value">{selectedDieta.carbohidratos}g</span>
                          </div>
                        </li>
                        <li className="macronutrient-item">
                          <div className="macronutrient-icon bg-fat">
                            <FaCheese />
                          </div>
                          <div className="macronutrient-info">
                            <span className="macronutrient-name">Grasas</span>
                            <span className="macronutrient-value">{selectedDieta.grasas}g</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-4">
                      <h6>Peso Actual</h6>
                      <div className="weight-display">
                        <FaWeight className="me-2" />
                        <span>{selectedDieta.peso_actual} kg</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h6>Estado</h6>
                      <div className={`status-display ${selectedDieta.activo === 1 ? 'active' : 'inactive'}`}>
                        {selectedDieta.activo === 1 ? "ACTIVO" : "INACTIVO"}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h6>Fecha de Creación</h6>
                      <div className="date-display">
                        <FaCalendarAlt className="me-2" />
                        <span>{new Date(selectedDieta.created).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h6>Última Actualización</h6>
                      <div className="date-display">
                        <FaHistory className="me-2" />
                        <span>{new Date(selectedDieta.updated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Objetivos de macronutrientes en tarjetas */}
          <div className="row g-3 mt-4">

  <div className="col-md-4">
    <div className="card macronutrient-goal-card border-0 shadow-sm h-100 bg-protein bg-opacity-10 hover-effect">
      <div className="card-body text-center p-4">
        <h6 className="card-title fw-bold text-protein mb-3">OBJETIVO DE PROTEÍNAS</h6>
        <div className="display-5 fw-bold text-protein mb-2">
          {selectedDieta.proteinas}<small className="text-muted fs-6">g</small>
        </div>
        <div className="badge bg-protein bg-opacity-25 text-protein py-2 px-3 rounded-pill">
          {selectedDieta.proteinas >= 100 ? 'Alto en proteínas' : 'Moderado en proteínas'}
        </div>
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card macronutrient-goal-card border-0 shadow-sm h-100 bg-carbs bg-opacity-10 hover-effect">
      <div className="card-body text-center p-4">
        <h6 className="card-title fw-bold text-carbs mb-3">OBJETIVO DE CARBOHIDRATOS</h6>
        <div className="display-5 fw-bold text-carbs mb-2">
          {selectedDieta.carbohidratos}<small className="text-muted fs-6">g</small>
        </div>
        <div className="badge bg-carbs bg-opacity-25 text-carbs py-2 px-3 rounded-pill">
          {selectedDieta.carbohidratos >= 150 ? 'Alto en carbohidratos' : 'Moderado en carbohidratos'}
        </div>
      </div>
    </div>
  </div>


  <div className="col-md-4">
    <div className="card macronutrient-goal-card border-0 shadow-sm h-100 bg-fat bg-opacity-10 hover-effect">
      <div className="card-body text-center p-4">
        <h6 className="card-title fw-bold text-fat mb-3">OBJETIVO DE GRASAS</h6>
        <div className="display-5 fw-bold text-fat mb-2">
          {selectedDieta.grasas}<small className="text-muted fs-6">g</small>
        </div>
        <div className="badge bg-fat bg-opacity-25 text-fat py-2 px-3 rounded-pill">
          {selectedDieta.grasas >= 70 ? 'Alto en grasas' : 'Moderado en grasas'}
        </div>
      </div>
    </div>
  </div>
</div></div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-close-modal"
                  onClick={() => setShowDetailsDietaModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para subir imágenes/documentos */}
      <div className={`modal fade ${showSubirImagenModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showSubirImagenModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Subir Documento/Foto</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  setShowSubirImagenModal(false);
                  setArchivo(null);
                }}
              ></button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubirImagen}>
                <div className="mb-4">
                  <label htmlFor="documentoFile" className="form-label">
                    Seleccionar archivo (imagen o documento)
                  </label>
                  <div className="file-upload-container">
                    <input
                      className="form-control file-upload-input"
                      type="file"
                      id="documentoFile"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => setArchivo(e.target.files[0])}
                      required
                    />
                    <div className="file-upload-label">
                      <FaFileUpload className="me-2" />
                      <span>Seleccionar archivo</span>
                    </div>
                  </div>
                </div>
                
                {archivo && (
                  <div className="file-preview">
                    <strong>Archivo seleccionado:</strong> {archivo.name}
                  </div>
                )}
                
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => {
                      setShowSubirImagenModal(false);
                      setArchivo(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-upload"
                    disabled={loadingImagenes}
                  >
                    {loadingImagenes ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        Subiendo...
                      </>
                    ) : (
                      'Subir Archivo'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar imagen */}
      <Modal show={showConfirmDeleteImage} onHide={() => setShowConfirmDeleteImage(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning">
            <FaInfoCircle className="me-2" />
            ¿Estás seguro de que deseas eliminar esta imagen/documento?
          </div>
          <p>Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDeleteImage(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteImage} disabled={loadingImagenes}>
            {loadingImagenes ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NutritionDashboard;
