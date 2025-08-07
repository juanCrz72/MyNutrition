import React, { useState, useEffect } from 'react';
import { useAuth } from './../Superadmin/AuthContext.jsx';
import { 
  FaUtensils, 
  FaChartLine, 
  FaUser, 
  FaClipboardList, 
  FaExclamationTriangle,
  FaPlusCircle,
  FaAppleAlt,
  FaRunning,
  FaWeight,
  FaCheckCircle
} from 'react-icons/fa';
import { GiBodyBalance } from 'react-icons/gi';
import { MdOutlineFoodBank, MdOutlineWaterDrop } from 'react-icons/md';
import { BsHeartPulseFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { Card, Alert } from 'react-bootstrap';
import './css/Estilos.css';
import CuestionarioModal from './CuestionarioModal';
import { getQuestionarioByPersonaIdjs } from '../../assets/js/Cuestionario.js';
import {getQuestionarioByPersonaId} from '../../api/Cuestionario.api.js';
import { useNavigate } from 'react-router-dom';


const UserDashboard = () => {
  const { user } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fats: 0
  });
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
    const navigate = useNavigate();

  useEffect(() => {
     console.log('User object:', JSON.stringify(user, null, 2)); // Ver estructura completa

    if (user?.nombre) {
      const primerNombre = user.nombre.split(' ')[0];
      setNombreUsuario(primerNombre);
    }
    
    // Simular datos de progreso
    setWaterIntake(1500);
    setCaloriesConsumed(1250);
    setMacros({
      protein: 45,
      carbs: 120,
      fats: 35
    });

    // Verificar si ya completó el cuestionario
    if (user?.idPersona) {
      checkQuestionnaireStatus();
    }
  }, [user]);

const checkQuestionnaireStatus = async () => {
  try {
    console.log('Verificando cuestionario para idPersona:', user?.idPersona);
    
    if (!user?.idPersona) {
      setHasCompletedQuestionnaire(false);
      return false;
    }
    
    const cuestionario = await getQuestionarioByPersonaIdjs(user.idPersona);
    console.log('Respuesta de API:', cuestionario);
    
    // Verificación segura de la existencia del cuestionario
    const tieneCuestionario = cuestionario !== null && 
                             typeof cuestionario === 'object' && 
                             Object.keys(cuestionario).length > 0;
    
    setHasCompletedQuestionnaire(tieneCuestionario);
    return tieneCuestionario;
    
  } catch (error) {
    console.error('Error al verificar cuestionario:', error);
    setHasCompletedQuestionnaire(false);
    return false;
  }
};

  const refreshDashboard = () => {
    checkQuestionnaireStatus();
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="user-dashboard">
      {/* Header con saludo y progreso */}
      <header className="dashboard-header">
        <div className="welcome-section">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="welcome-message"
          >
            <h1>¡Hola, <span className="highlight-text">{nombreUsuario || 'Usuario'}</span>!</h1>
            <p className="subtitle">Tu salud es nuestra prioridad</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="water-tracker"
          >
            <div className="water-icon">
              <MdOutlineWaterDrop size={32} />
            </div>
            <div className="water-progress">
              <h3>Hidratación</h3>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${Math.min(100, (waterIntake / 2000) * 100)}%` }}
                ></div>
              </div>
              <span>{waterIntake}ml / 2000ml</span>
            </div>
          </motion.div>
        </div>
        
        {/* Barra de progreso de calorías */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="calories-tracker"
        >
          <div className="calories-info">
            <h3>Consumo de calorías </h3>
            <div className="calories-numbers">
              <span className="consumed">{caloriesConsumed}</span>
              <span className="separator">/</span>
              <span className="goal">{caloriesGoal}</span>
              <span className="unit">kcal</span>
            </div>
          </div>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${Math.min(100, (caloriesConsumed / caloriesGoal) * 100)}%` }}
            ></div>
          </div>
          <div className="macros-info">
            <div className="macro-item">
              <span className="macro-name">Proteínas</span>
              <span className="macro-value">{macros.protein}g</span>
            </div>
            <div className="macro-item">
              <span className="macro-name">Carbohidratos</span>
              <span className="macro-value">{macros.carbs}g</span>
            </div>
            <div className="macro-item">
              <span className="macro-name">Grasas</span>
              <span className="macro-value">{macros.fats}g</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Sección principal con accesos directos */}
      <motion.div 
        className="main-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="card feature-card food-diary"
          variants={itemVariants}
          whileHover={{ y: -5 }}
          onClick={() => navigate('/BitacoraUser')}
        >
          <div className="card-icon">
            <FaUtensils size={24} />
          </div>
          <h3>Bitácora de Alimentos</h3>
          <p>Registra todo lo que consumes durante el día</p>

        </motion.div>

        <motion.div 
          className="card feature-card diet-plan"
          variants={itemVariants}
          whileHover={{ y: -5 }}
             onClick={() => navigate('/dietaUser')}
        >
          <div className="card-icon">
            <MdOutlineFoodBank size={24} />
          </div>
          <h3>Mi Plan de Dieta</h3>
          <p>Revisa tus planes alimenticios personalizados</p>
        </motion.div>

        <motion.div 
          className={`card feature-card health-alert ${hasCompletedQuestionnaire ? 'completed' : ''}`}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          onClick={() => hasCompletedQuestionnaire ? navigate('/vistaCuestionario') : setShowQuestionnaire(true)}
          //onClick={() => hasCompletedQuestionnaire ? setShowQuestionnaire(true) : navigate('/vistaCuestionario')}

        >
          <div className="card-icon">
            {hasCompletedQuestionnaire ? (
              <FaClipboardList size={24} />
            ) : (
              <FaExclamationTriangle size={24} className="text-warning" />
            )}
          </div>
          <h3>Cuestionario de Salud</h3>
          <p>
            {hasCompletedQuestionnaire 
              ? "Tu perfil de salud está completo" 
              : "Completa tu perfil de salud para mejores recomendaciones"}
          </p>
          <div className="card-footer">
            <span className={`status ${hasCompletedQuestionnaire ? 'text-success' : 'text-warning'}`}>
              {hasCompletedQuestionnaire ? '✓ Completado' : '¡Pendiente de completar!'}
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="card feature-card progress-tracker"
          variants={itemVariants}
          whileHover={{ y: -5 }}
          onClick={() => navigate('/DocumentosUser')}
        >
          <div className="card-icon">
            <FaChartLine size={24} />
          </div>
          <h3>Mi Progreso</h3>
          <p>Sigue tu evolución con tus fotos del antes y después</p>
        </motion.div>

        <motion.div 
          className="card feature-card profile"
          variants={itemVariants}
          whileHover={{ y: -5 }}
          onClick={() => navigate('/PersonaUser')}
        >
          <div className="card-icon">
            <FaUser size={24} />
          </div>
          <h3>Mi Perfil</h3>
          <p>Administra tu información personal y preferencias</p>
        </motion.div>

        <motion.div 
          className="card feature-card recipes"
          variants={itemVariants}
          whileHover={{ y: -5 }}
          onClick={() => console.log("Ir a recetas")}
        >
          <div className="card-icon">
            <FaAppleAlt size={24} />
          </div>
          <h3>Recetas Saludables</h3>
          <p>Descubre platillos acordes a tus necesidades</p>
          <div className="card-footer">
            <span className="status">12 recetas favoritas</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Sección de resumen rápido */}
      <div className="quick-summary">
        <h2 className="section-title">Tu Resumen Diario</h2>
        
        <div className="summary-cards">
          <motion.div 
            className="summary-card activity"
            whileHover={{ scale: 1.03 }}
          >
            <div className="icon">
              <FaRunning size={20} />
            </div>
            <div className="content">
              <h4>Actividad Física</h4>
              <p>30 minutos hoy</p>
              <span className="recommendation">Meta: 45 minutos</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="summary-card weight"
            whileHover={{ scale: 1.03 }}
          >
            <div className="icon">
              <FaWeight size={20} />
            </div>
            <div className="content">
              <h4>Peso Corporal</h4>
              <p>72.5 kg</p>
              <span className="recommendation">-1.2kg este mes</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="summary-card health"
            whileHover={{ scale: 1.03 }}
          >
            <div className="icon">
              <BsHeartPulseFill size={20} />
            </div>
            <div className="content">
              <h4>Salud General</h4>
              <p>Buena</p>
              <span className="recommendation">Último chequeo: 15 días</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="summary-card balance"
            whileHover={{ scale: 1.03 }}
          >
            <div className="icon">
              <GiBodyBalance size={20} />
            </div>
            <div className="content">
              <h4>Balance Nutricional</h4>
              <p>Óptimo</p>
              <span className="recommendation">Proteínas bajas hoy</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Botón flotante para acción principal */}
 

      {/* Modal del Cuestionario de Salud */}
      <CuestionarioModal 
        show={showQuestionnaire} 
        onHide={() => setShowQuestionnaire(false)}
        idPersona={user?.idPersona}
        refreshDashboard={refreshDashboard}
      />
    </div>
  );
};

export default UserDashboard;
