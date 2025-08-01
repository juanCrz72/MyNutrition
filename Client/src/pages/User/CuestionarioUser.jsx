import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Superadmin/AuthContext.jsx';
import { 
  FaEdit, 
  FaSave, 
  FaArrowLeft,
  FaHeartbeat,
  FaRunning,
  FaPills,
  FaUtensils,
  FaAllergies,
  FaBullseye,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaWater,
  FaFireAlt
} from 'react-icons/fa';
import { RiMentalHealthLine } from 'react-icons/ri';
import { MdOutlineMedicalServices } from 'react-icons/md';
import { GiBodyBalance, GiHealthNormal } from 'react-icons/gi';
import { BsHeartPulseFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { updateQuestionariojs, getQuestionarioByPersonaIdjs } from '../../assets/js/Cuestionario.js';
import Swal from 'sweetalert2';
import './css/Estilos.css';

const CuestionarioUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cuestionario, setCuestionario] = useState(null);
  const [formData, setFormData] = useState({
    act_fisica: '',
    diabetes: '0',
    hipertension: '0',
    otra_enfermedad: '0',
    otra_enfermedad_desc: '',
    toma_medicamento: '0',
    medicamento_descrip: '',
    consumo_calorias: '0',
    calorias_descrip: '',
    alergias: 'ninguna',
    metas: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchCuestionario = async () => {
      if (user?.idPersona) {
        const data = await getQuestionarioByPersonaIdjs(user.idPersona);
        if (data) {
          setCuestionario(data);
          setFormData({
            act_fisica: data.act_fisica || '',
            diabetes: data.diabetes || '0',
            hipertension: data.hipertension || '0',
            otra_enfermedad: data.otra_enfermedad || '0',
            otra_enfermedad_desc: data.otra_enfermedad_desc || '',
            toma_medicamento: data.toma_medicamento || '0',
            medicamento_descrip: data.medicamento_descrip || '',
            consumo_calorias: data.consumo_calorias || '0',
            calorias_descrip: data.calorias_descrip || '',
            alergias: data.alergias || 'ninguna',
            metas: data.metas || ''
          });
        }
      }
    };
    fetchCuestionario();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked ? '1' : '0' }));
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.act_fisica) {
      Swal.fire('Error', 'Por favor selecciona tu nivel de actividad física', 'error');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.act_fisica || !formData.metas) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      await updateQuestionariojs(
        cuestionario.id,
        formData.act_fisica,
        formData.diabetes,
        formData.hipertension,
        formData.otra_enfermedad,
        formData.toma_medicamento,
        formData.medicamento_descrip,
        formData.consumo_calorias,
        formData.calorias_descrip,
        formData.alergias,
        formData.metas,
        () => {
          Swal.fire('¡Éxito!', 'Tu cuestionario se ha actualizado correctamente', 'success');
          setIsSubmitting(false);
          setIsEditing(false);
        },
        () => {}
      );
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire('Error', 'Hubo un problema al actualizar tu cuestionario', 'error');
      setIsSubmitting(false);
    }
  };

  if (!cuestionario) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando tu cuestionario de salud...</p>
      </div>
    );
  }

  // Vista de informe (modo lectura)
  if (!isEditing) {
    return (
      <motion.div 
        className="user-dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="dashboard-header">
          <div className="welcome-section">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="welcome-message"
            >
              <h1>Mi Perfil de Salud</h1>
              <p className="subtitle">Resumen completo de tu información médica</p>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="edit-button"
              onClick={() => setIsEditing(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FaEdit className="edit-icon" />
              <span>Editar Información</span>
            </motion.button>
          </div>
        </header>

        <motion.div 
          className="main-section"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Tarjeta de Actividad Física */}
          <motion.div 
            className="card feature-card health-card"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.5 }
              }
            }}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="card-icon activity">
              <FaRunning size={24} />
            </div>
            <div className="card-content">
              <h3>Actividad Física</h3>
              <div className={`info-badge ${cuestionario.act_fisica ? 'active' : 'empty'}`}>
                {cuestionario.act_fisica || 'No especificado'}
              </div>
              <p>Nivel de actividad física regular</p>
            </div>
          </motion.div>

          {/* Tarjeta de Condiciones Médicas */}
          <motion.div 
            className="card feature-card health-card"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.5 }
              }
            }}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="card-icon conditions">
              <FaHeartbeat size={24} />
            </div>
            <div className="card-content">
              <h3>Condiciones Médicas</h3>
              <div className="conditions-container">
                {cuestionario.diabetes === '1' && <span className="condition-badge diabetes">Diabetes</span>}
                {cuestionario.hipertension === '1' && <span className="condition-badge hypertension">Hipertensión</span>}
                {cuestionario.otra_enfermedad === '1' && <span className="condition-badge other">Otras condiciones</span>}
                {cuestionario.diabetes === '0' && cuestionario.hipertension === '0' && cuestionario.otra_enfermedad === '0' && 
                  <span className="condition-badge healthy">Sin condiciones reportadas</span>}
              </div>
              {cuestionario.otra_enfermedad === '1' && cuestionario.otra_enfermedad_desc && (
                <p className="condition-description">{cuestionario.otra_enfermedad_desc}</p>
              )}
            </div>
          </motion.div>

          {/* Tarjeta de Medicamentos */}
          <motion.div 
            className="card feature-card health-card"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.5 }
              }
            }}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="card-icon medication">
              <FaPills size={24} />
            </div>
            <div className="card-content">
              <h3>Medicamentos</h3>
              {cuestionario.toma_medicamento === '1' ? (
                <>
                  <div className="info-badge active">Actualmente toma medicamentos</div>
                  <p className="medication-description">{cuestionario.medicamento_descrip || 'No se proporcionaron detalles'}</p>
                </>
              ) : (
                <div className="info-badge healthy">No toma medicamentos</div>
              )}
            </div>
          </motion.div>

          {/* Tarjeta de Hábitos Alimenticios */}
          <motion.div 
            className="card feature-card health-card"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.5 }
              }
            }}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="card-icon nutrition">
              <FaUtensils size={24} />
            </div>
            <div className="card-content">
              <h3>Hábitos Alimenticios</h3>
              {cuestionario.consumo_calorias === '1' ? (
                <>
                  <div className="info-badge active">Controla consumo calórico</div>
                  <p className="calories-description">{cuestionario.calorias_descrip || 'No se proporcionaron detalles'}</p>
                </>
              ) : (
                <div className="info-badge">No lleva control calórico</div>
              )}
            </div>
          </motion.div>

          {/* Tarjeta de Alergias */}
          <motion.div 
            className="card feature-card health-card"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.5 }
              }
            }}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="card-icon allergies">
              <FaAllergies size={24} />
            </div>
            <div className="card-content">
              <h3>Alergias e Intolerancias</h3>
              {cuestionario.alergias && cuestionario.alergias !== 'ninguna' ? (
                <p className="allergies-description">{cuestionario.alergias}</p>
              ) : (
                <div className="info-badge healthy">No reporta alergias</div>
              )}
            </div>
          </motion.div>

          {/* Tarjeta de Metas */}
          <motion.div 
            className="card feature-card health-card"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.5 }
              }
            }}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="card-icon goals">
              <FaBullseye size={24} />
            </div>
            <div className="card-content">
              <h3>Metas Nutricionales</h3>
              {cuestionario.metas ? (
                <p className="goals-description">{cuestionario.metas}</p>
              ) : (
                <div className="info-badge">No se han definido metas</div>
              )}
            </div>
          </motion.div>
        </motion.div>

        <div className="quick-summary">
          <h2 className="section-title">Resumen de Salud</h2>
          
          <div className="summary-cards">
            <motion.div 
              className="summary-card health-summary"
              whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="icon health">
                <GiHealthNormal size={24} />
              </div>
              <div className="content">
                <h4>Estado General</h4>
                <p className={`status ${
                  (cuestionario.diabetes === '1' || cuestionario.hipertension === '1' || cuestionario.otra_enfermedad === '1') 
                    ? 'warning' 
                    : 'good'
                }`}>
                  {
                    (cuestionario.diabetes === '1' || cuestionario.hipertension === '1' || cuestionario.otra_enfermedad === '1') 
                      ? 'Requiere atención' 
                      : 'Óptimo'
                  }
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="summary-card health-summary"
              whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="icon medication">
                <FaPills size={24} />
              </div>
              <div className="content">
                <h4>Medicación</h4>
                <p className={`status ${cuestionario.toma_medicamento === '1' ? 'warning' : 'good'}`}>
                  {cuestionario.toma_medicamento === '1' ? 'Requiere medicación' : 'No requiere'}
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="summary-card health-summary"
              whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="icon allergies">
                <FaAllergies size={24} />
              </div>
              <div className="content">
                <h4>Alergias</h4>
                <p className={`status ${cuestionario.alergias && cuestionario.alergias !== 'ninguna' ? 'warning' : 'good'}`}>
                  {cuestionario.alergias && cuestionario.alergias !== 'ninguna' ? 'Presentes' : 'No reportadas'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Vista de edición
  return (
    <motion.div 
      className="user-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="dashboard-header">
        <div className="welcome-section">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="welcome-message"
          >
            <h1>Editar Perfil de Salud</h1>
            <p className="subtitle">Actualiza tu información médica</p>
          </motion.div>
          
          <motion.div 
            className="progress-tracker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="progress-info">
              <h3>Progreso</h3>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
                <div className="progress-steps">
                  {[1, 2, 3, 4].map(step => (
                    <div 
                      key={step}
                      className={`progress-step ${step <= currentStep ? 'active' : ''} ${step === currentStep ? 'current' : ''}`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
              <span>Paso {currentStep} de 4</span>
            </div>
          </motion.div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="edit-form">
        {/* Paso 1: Actividad física y salud */}
        {currentStep === 1 && (
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="section-header">
              <div className="section-icon-container activity">
                <FaRunning size={24} className="section-icon" />
              </div>
              <h2>Actividad Física y Salud</h2>
            </div>
            
            <div className="form-group">
              <label>
                <FaRunning className="input-icon" />
                Nivel de actividad física*
              </label>
              <select 
                name="act_fisica" 
                value={formData.act_fisica}
                onChange={handleInputChange}
                required
                className="styled-select"
              >
                <option value="">Selecciona tu nivel de actividad</option>
                <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
                <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
                <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
                <option value="activo">Activo (ejercicio 6-7 días/semana)</option>
                <option value="intenso">Muy activo (ejercicio intenso diario)</option>
              </select>
            </div>
            
            <div className="health-conditions">
              <h3 className="conditions-title">
                <FaHeartbeat className="input-icon" />
                Condiciones de Salud
              </h3>
              
              <div className="conditions-grid">
                <div className="condition-checkbox">
                  <input
                    type="checkbox"
                    id="diabetes-check"
                    name="diabetes"
                    checked={formData.diabetes === '1'}
                    onChange={handleCheckboxChange}
                    className="styled-checkbox"
                  />
                  <label htmlFor="diabetes-check" className="checkbox-label">
                    <span className="custom-checkbox"></span>
                    <MdOutlineMedicalServices className="condition-icon" />
                    Diabetes
                  </label>
                </div>
                
                <div className="condition-checkbox">
                  <input
                    type="checkbox"
                    id="hipertension-check"
                    name="hipertension"
                    checked={formData.hipertension === '1'}
                    onChange={handleCheckboxChange}
                    className="styled-checkbox"
                  />
                  <label htmlFor="hipertension-check" className="checkbox-label">
                    <span className="custom-checkbox"></span>
                    <RiMentalHealthLine className="condition-icon" />
                    Hipertensión
                  </label>
                </div>
                
                <div className="condition-checkbox">
                  <input
                    type="checkbox"
                    id="otra-enfermedad-check"
                    name="otra_enfermedad"
                    checked={formData.otra_enfermedad === '1'}
                    onChange={handleCheckboxChange}
                    className="styled-checkbox"
                  />
                  <label htmlFor="otra-enfermedad-check" className="checkbox-label">
                    <span className="custom-checkbox"></span>
                    Otras condiciones médicas
                  </label>
                </div>
              </div>
              
              {formData.otra_enfermedad === '1' && (
                <div className="form-group">
                  <label>Descripción de otras condiciones:</label>
                  <textarea
                    rows={3}
                    placeholder="Por favor describe tu condición"
                    name="otra_enfermedad_desc"
                    value={formData.otra_enfermedad_desc}
                    onChange={handleInputChange}
                    className="styled-textarea"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Paso 2: Medicamentos y hábitos */}
        {currentStep === 2 && (
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="section-header">
              <div className="section-icon-container medication">
                <FaPills size={24} className="section-icon" />
              </div>
              <h2>Medicamentos y Hábitos</h2>
            </div>
            
            <div className="form-group toggle-group">
              <label className="toggle-container">
                <input
                  type="checkbox"
                  id="medicamento-check"
                  name="toma_medicamento"
                  checked={formData.toma_medicamento === '1'}
                  onChange={handleCheckboxChange}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  <FaPills className="input-icon" />
                  ¿Tomas algún medicamento actualmente?
                </span>
              </label>
            </div>
            
            {formData.toma_medicamento === '1' && (
              <div className="form-group">
                <label>Detalles de medicamentos:</label>
                <textarea
                  rows={3}
                  placeholder="Lista de medicamentos (nombre, dosis, frecuencia)"
                  name="medicamento_descrip"
                  value={formData.medicamento_descrip}
                  onChange={handleInputChange}
                  className="styled-textarea"
                />
              </div>
            )}
            
            <div className="form-group toggle-group">
              <label className="toggle-container">
                <input
                  type="checkbox"
                  id="calorias-check"
                  name="consumo_calorias"
                  checked={formData.consumo_calorias === '1'}
                  onChange={handleCheckboxChange}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  <FaFireAlt className="input-icon" />
                  ¿Llevas un control de tu consumo calórico?
                </span>
              </label>
            </div>
            
            {formData.consumo_calorias === '1' && (
              <div className="form-group">
                <label>Descripción del control calórico:</label>
                <textarea
                  rows={3}
                  placeholder="Describe cómo llevas el control (app, diario, etc.)"
                  name="calorias_descrip"
                  value={formData.calorias_descrip}
                  onChange={handleInputChange}
                  className="styled-textarea"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Paso 3: Alergias */}
        {currentStep === 3 && (
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="section-header">
              <div className="section-icon-container allergies">
                <FaAllergies size={24} className="section-icon" />
              </div>
              <h2>Alergias e Intolerancias</h2>
            </div>
            
            <div className="alert-message">
              <FaExclamationTriangle className="alert-icon" />
              <p>Esta información es crucial para evitar recomendaciones de alimentos que puedan afectar tu salud.</p>
            </div>
            
            <div className="form-group">
              <label>
                <FaAllergies className="input-icon" />
                Alergias o intolerancias alimentarias
              </label>
              <textarea
                rows={5}
                placeholder="Ej: Alergia a los mariscos, intolerancia a la lactosa, alergia a frutos secos, etc."
                name="alergias"
                value={formData.alergias}
                onChange={handleInputChange}
                className="styled-textarea"
              />
            </div>
          </motion.div>
        )}

        {/* Paso 4: Metas */}
        {currentStep === 4 && (
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="section-header">
              <div className="section-icon-container goals">
                <FaBullseye size={24} className="section-icon" />
              </div>
              <h2>Tus Metas Nutricionales</h2>
            </div>
            
            <div className="form-group">
              <label>
                <FaHeartbeat className="input-icon" />
                ¿Cuáles son tus principales objetivos con la nutrición?*
              </label>
              <textarea
                rows={5}
                placeholder="Ej: Perder peso, ganar masa muscular, mejorar mi energía, controlar diabetes, reducir colesterol, mejorar digestión, etc."
                name="metas"
                value={formData.metas}
                onChange={handleInputChange}
                required
                className="styled-textarea"
              />
            </div>
          </motion.div>
        )}

        <div className="form-navigation">
          {currentStep > 1 && (
            <motion.button 
              type="button"
              className="nav-button prev-button"
              onClick={prevStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChevronLeft /> Anterior
            </motion.button>
          )}
          
          {currentStep < 4 ? (
            <motion.button 
              type="button"
              className="nav-button next-button"
              onClick={nextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Siguiente <FaChevronRight />
            </motion.button>
          ) : (
            <motion.button 
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Guardar Cambios
                </>
              )}
            </motion.button>
          )}
        </div>
      </form>

      <motion.button 
        className="floating-action-button"
        whileHover={{ scale: 1.1, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsEditing(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <FaArrowLeft className="fab-icon" />
        <span className="fab-text">Cancelar</span>
      </motion.button>
    </motion.div>
  );
};

export default CuestionarioUser;