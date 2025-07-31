import React, { useState, useEffect } from 'react';
import { useAuth } from '../Superadmin/AuthContext.jsx';
import { PersonaDietaCRUD } from './../Superadmin/DietaCRUD.jsx';
import { 
  getPersonasDietasjs, 
  createPersonaDietajs, 
  updatePersonaDietajs, 
  deactivateDietajs,
  deletePersonaDietajs
} from '../../assets/js/Dieta.js';
import { 
  FaUtensils, FaPlus, FaSearch, FaEdit, 
  FaTrash, FaInfoCircle, FaFire, FaBreadSlice, 
  FaEgg, FaCheese, FaWeight, FaUser, FaHeart,
  FaCalendarAlt, FaWater, FaAppleAlt
} from 'react-icons/fa';
import { Alert, Spinner, Button, Badge, Modal, ProgressBar } from 'react-bootstrap';
import './css/Estilos.css';

const DietaUser = () => {
  const { user } = useAuth();
  const [dietaList, setDietaList] = useState([]);
  const [filteredDietas, setFilteredDietas] = useState([]);
  const [dietaData, setDietaData] = useState({
    idPersona: user?.idPersona || '',
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDietas();
  }, []);

  useEffect(() => {
    if (user?.idPersona && dietaList.length > 0) {
      const filtered = dietaList.filter(dieta => dieta.idPersona == user.idPersona);
      setFilteredDietas(filtered);
    }
  }, [user, dietaList]);

  const loadDietas = async () => {
    setIsLoading(true);
    try {
      await getPersonasDietasjs(setDietaList);
    } catch (err) {
      setError('Error al cargar dietas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDieta = () => {
    createPersonaDietajs(dietaData, setShowDietaModal, () => getPersonasDietasjs(setDietaList));
  };

  const handleUpdateDieta = () => {
    if (selectedDieta?.idPersona != user?.idPersona) {
      setError('Solo puedes editar tus propias dietas');
      return;
    }
    updatePersonaDietajs(selectedDieta.id, dietaData, setShowEditDietaModal, () => getPersonasDietasjs(setDietaList));
  };

  const handleDeactivateDieta = () => {
    if (selectedDieta?.idPersona != user?.idPersona) {
      setError('Solo puedes desactivar tus propias dietas');
      return;
    }
    deactivateDietajs(selectedDieta.id, setShowDeactivateDietaModal, () => getPersonasDietasjs(setDietaList));
  };

  const handleDeleteDieta = () => {
    if (selectedDieta?.idPersona != user?.idPersona) {
      setError('Solo puedes eliminar tus propias dietas');
      return;
    }
    deletePersonaDietajs(selectedDieta.id, setShowDeleteDietaModal, () => getPersonasDietasjs(setDietaList));
  };

  const resetDietaForm = () => {
    setDietaData({
      idPersona: user?.idPersona || '',
      calorias: '',
      grasas: '',
      carbohidratos: '',
      proteinas: '',
      peso_actual: ''
    });
  };

  // Calcular porcentaje de macronutrientes
  const calculateMacroPercentage = (dieta) => {
    const total = parseInt(dieta.proteinas) + parseInt(dieta.carbohidratos) + parseInt(dieta.grasas);
    return {
      proteinas: Math.round((dieta.proteinas / total) * 100),
      carbohidratos: Math.round((dieta.carbohidratos / total) * 100),
      grasas: Math.round((dieta.grasas / total) * 100)
    };
  };

  return (
    <div className="dieta-container">
      <div className="dieta-header">
        <h1 className="dieta-title">Mi Plan Nutricional</h1>
        <p className="dieta-subtitle">Sigue tu progreso y alcanza tus objetivos</p>
      </div>

      {error && <Alert variant="danger" className="dieta-alert">{error}</Alert>}

      {/* Sección de resumen (solo visible en móvil) */}
      <div className="d-block d-md-none dieta-mobile-summary">
        {filteredDietas.length > 0 && (
          <div className="dieta-card">
            <div className="dieta-card-header">
              <h3>Tu dieta actual</h3>
              <Badge bg={filteredDietas[0].activo === 1 ? 'success' : 'secondary'}>
                {filteredDietas[0].activo === 1 ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <div className="dieta-card-body">
              <div className="dieta-macro-circle">
                <div className="circle-progress">
                  <div className="circle-progress-fill" style={{ 
                    background: `conic-gradient(
                      #4e73df 0% ${calculateMacroPercentage(filteredDietas[0]).proteinas}%,
                      #1cc88a ${calculateMacroPercentage(filteredDietas[0]).proteinas}% ${calculateMacroPercentage(filteredDietas[0]).proteinas + calculateMacroPercentage(filteredDietas[0]).carbohidratos}%,
                      #f6c23e ${calculateMacroPercentage(filteredDietas[0]).proteinas + calculateMacroPercentage(filteredDietas[0]).carbohidratos}% 100%
                    )`
                  }}>
                    <div className="circle-progress-inner">
                      <FaFire className="text-warning" />
                      <span>{filteredDietas[0].calorias}</span>
                      <small>kcal</small>
                    </div>
                  </div>
                </div>
                <div className="macro-legend">
                  <div className="macro-legend-item">
                    <span className="color-dot protein"></span>
                    <span>Proteína: {filteredDietas[0].proteinas}g ({calculateMacroPercentage(filteredDietas[0]).proteinas}%)</span>
                  </div>
                  <div className="macro-legend-item">
                    <span className="color-dot carbs"></span>
                    <span>Carbs: {filteredDietas[0].carbohidratos}g ({calculateMacroPercentage(filteredDietas[0]).carbohidratos}%)</span>
                  </div>
                  <div className="macro-legend-item">
                    <span className="color-dot fat"></span>
                    <span>Grasas: {filteredDietas[0].grasas}g ({calculateMacroPercentage(filteredDietas[0]).grasas}%)</span>
                  </div>
                </div>
              </div>
              <div className="dieta-card-stats">
                <div className="stat-item">
                  <FaWeight />
                  <span>Peso: {filteredDietas[0].peso_actual} kg</span>
                </div>
                <div className="stat-item">
                  <FaCalendarAlt />
                  <span>Creada: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <Button 
                variant="outline-primary" 
                className="w-100 mt-3"
                onClick={() => {
                  setSelectedDieta(filteredDietas[0]);
                  setShowDetailsDietaModal(true);
                }}
              >
                Ver detalles completos
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Versión Desktop */}
      <div className="d-none d-md-block dieta-desktop-view">
        <div className="dieta-info-box">
          <div className="dieta-user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <h3>Tu Plan Nutricional</h3>
              <p>Personalizado según tus necesidades</p>
            </div>
          </div>

          <div className="dieta-stats-grid">
            {filteredDietas.length > 0 ? (
              <>
                <div className="stat-card main-stat">
                  <div className="stat-icon">
                    <FaFire />
                  </div>
                  <div className="stat-content">
                    <h4>Calorías diarias</h4>
                    <p className="stat-value">{filteredDietas[0].calorias} <span>kcal</span></p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaWeight />
                  </div>
                  <div className="stat-content">
                    <h4>Peso actual</h4>
                    <p className="stat-value">{filteredDietas[0].peso_actual} <span>kg</span></p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaAppleAlt />
                  </div>
                  <div className="stat-content">
                    <h4>Distribución de macros</h4>
                    <div className="macro-bars">
                      <div className="macro-bar protein" style={{ width: `${calculateMacroPercentage(filteredDietas[0]).proteinas}%` }}>
                        <span>P {calculateMacroPercentage(filteredDietas[0]).proteinas}%</span>
                      </div>
                      <div className="macro-bar carbs" style={{ width: `${calculateMacroPercentage(filteredDietas[0]).carbohidratos}%` }}>
                        <span>C {calculateMacroPercentage(filteredDietas[0]).carbohidratos}%</span>
                      </div>
                      <div className="macro-bar fat" style={{ width: `${calculateMacroPercentage(filteredDietas[0]).grasas}%` }}>
                        <span>G {calculateMacroPercentage(filteredDietas[0]).grasas}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stat-card macro-details">
                  <div className="macro-detail-item">
                    <div className="macro-detail-header">
                      <FaEgg className="protein" />
                      <span>Proteínas</span>
                    </div>
                    <p className="macro-detail-value">{filteredDietas[0].proteinas}g</p>
                  </div>
                  <div className="macro-detail-item">
                    <div className="macro-detail-header">
                      <FaBreadSlice className="carbs" />
                      <span>Carbohidratos</span>
                    </div>
                    <p className="macro-detail-value">{filteredDietas[0].carbohidratos}g</p>
                  </div>
                  <div className="macro-detail-item">
                    <div className="macro-detail-header">
                      <FaCheese className="fat" />
                      <span>Grasas</span>
                    </div>
                    <p className="macro-detail-value">{filteredDietas[0].grasas}g</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-diet-message">
                <h4>No tienes un plan nutricional asignado</h4>
                <p>Comienza creando tu primer plan para alcanzar tus objetivos</p>
                <Button
                  variant="primary"
                  onClick={() => {
                    resetDietaForm();
                    setSelectedDieta(null);
                    setShowDietaModal(true);
                  }}
                >
                  <FaPlus className="me-2" /> Crear Plan Nutricional
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Historial de dietas */}
        {filteredDietas.length > 0 && (
          <div className="dieta-history">
            <h3 className="section-title">
              <FaCalendarAlt className="me-2" /> Historial de Planes
            </h3>
            <div className="history-cards">
              {filteredDietas.map((dieta, index) => (
                <div key={`dieta-${dieta.id}`} className={`history-card ${index === 0 ? 'active' : ''}`}>
                  <div className="history-card-header">
                    <h4>Plan #{filteredDietas.length - index}</h4>
                    <Badge bg={dieta.activo === 1 ? 'success' : 'secondary'}>
                      {dieta.activo === 1 ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="history-card-body">
                    <div className="history-stat">
                      <FaFire className="text-warning" />
                      <span>{dieta.calorias} kcal</span>
                    </div>
                    <div className="history-stat">
                      <FaWeight />
                      <span>{dieta.peso_actual} kg</span>
                    </div>
                    <div className="history-macros">
                      <div className="macro-chip protein">
                        <FaEgg /> {dieta.proteinas}g
                      </div>
                      <div className="macro-chip carbs">
                        <FaBreadSlice /> {dieta.carbohidratos}g
                      </div>
                      <div className="macro-chip fat">
                        <FaCheese /> {dieta.grasas}g
                      </div>
                    </div>
                  </div>
                  <div className="history-card-actions">
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => {
                        setSelectedDieta(dieta);
                        setShowDetailsDietaModal(true);
                      }}
                    >
                      <FaInfoCircle />
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
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
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setSelectedDieta(dieta);
                        dieta.activo === 1 
                          ? setShowDeactivateDietaModal(true)
                          : setShowDeleteDietaModal(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal para CRUD de dietas */}
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
        personasList={[{ idpersona: user?.idPersona, nombre: 'Tu', apellidos: 'Información' }]}
      />

      {/* Modal de detalles de dieta */}
      {selectedDieta && (
        <Modal show={showDetailsDietaModal} onHide={() => setShowDetailsDietaModal(false)} size="lg" centered>
          <Modal.Header closeButton className="dieta-modal-header">
            <Modal.Title>Detalles Completos del Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body className="dieta-modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="dieta-modal-section">
                  <h5><FaUser className="me-2" /> Información Personal</h5>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Peso Actual</span>
                      <span className="info-value">{selectedDieta.peso_actual} kg</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Estado</span>
                      <Badge bg={selectedDieta.activo === 1 ? 'success' : 'secondary'}>
                        {selectedDieta.activo === 1 ? "ACTIVO" : "INACTIVO"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="dieta-modal-section">
                  <h5><FaFire className="me-2" /> Resumen Calórico</h5>
                  <div className="calories-display">
                    <div className="calories-circle">
                      <div className="calories-value">{selectedDieta.calorias}</div>
                      <div className="calories-unit">kcal/día</div>
                    </div>
                    <div className="calories-recommendation">
                      <p>Esta es tu ingesta calórica diaria recomendada para alcanzar tus objetivos.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="dieta-modal-section">
                  <h5><FaUtensils className="me-2" /> Distribución de Macronutrientes</h5>
                  <div className="macros-distribution">
                    <div className="macros-chart">
                      <div className="macros-chart-inner">
                        <div 
                          className="macros-slice protein" 
                          style={{ '--percentage': `${calculateMacroPercentage(selectedDieta).proteinas}%` }}
                        >
                          <span>P {calculateMacroPercentage(selectedDieta).proteinas}%</span>
                        </div>
                        <div 
                          className="macros-slice carbs" 
                          style={{ '--percentage': `${calculateMacroPercentage(selectedDieta).carbohidratos}%` }}
                        >
                          <span>C {calculateMacroPercentage(selectedDieta).carbohidratos}%</span>
                        </div>
                        <div 
                          className="macros-slice fat" 
                          style={{ '--percentage': `${calculateMacroPercentage(selectedDieta).grasas}%` }}
                        >
                          <span>G {calculateMacroPercentage(selectedDieta).grasas}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="macros-details">
                      <div className="macro-detail">
                        <div className="macro-label protein">
                          <FaEgg /> Proteínas
                        </div>
                        <div className="macro-values">
                          <span>{selectedDieta.proteinas}g</span>
                          <span>{calculateMacroPercentage(selectedDieta).proteinas}%</span>
                        </div>
                      </div>
                      <div className="macro-detail">
                        <div className="macro-label carbs">
                          <FaBreadSlice /> Carbohidratos
                        </div>
                        <div className="macro-values">
                          <span>{selectedDieta.carbohidratos}g</span>
                          <span>{calculateMacroPercentage(selectedDieta).carbohidratos}%</span>
                        </div>
                      </div>
                      <div className="macro-detail">
                        <div className="macro-label fat">
                          <FaCheese /> Grasas
                        </div>
                        <div className="macro-values">
                          <span>{selectedDieta.grasas}g</span>
                          <span>{calculateMacroPercentage(selectedDieta).grasas}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dieta-modal-section recommendations">
              <h5><FaHeart className="me-2" /> Recomendaciones</h5>
              <div className="recommendations-grid">
                <div className="recommendation-item">
                  <FaWater className="icon" />
                  <p>Bebe al menos 2 litros de agua al día</p>
                </div>
                <div className="recommendation-item">
                  <FaAppleAlt className="icon" />
                  <p>Incluye frutas y verduras en cada comida</p>
                </div>
                <div className="recommendation-item">
                  <FaEgg className="icon" />
                  <p>Prioriza proteínas magras en tus comidas</p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="dieta-modal-footer">
            <Button variant="outline-secondary" onClick={() => setShowDetailsDietaModal(false)}>
              Cerrar
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                setDietaData({
                  idPersona: selectedDieta.idPersona,
                  calorias: selectedDieta.calorias,
                  grasas: selectedDieta.grasas,
                  carbohidratos: selectedDieta.carbohidratos,
                  proteinas: selectedDieta.proteinas,
                  peso_actual: selectedDieta.peso_actual,
                  activo: selectedDieta.activo
                });
                setShowDetailsDietaModal(false);
                setShowEditDietaModal(true);
              }}
            >
              <FaEdit className="me-2" /> Editar Plan
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DietaUser;