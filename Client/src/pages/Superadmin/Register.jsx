import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { getPaises } from "../../api/Paises.api.js";
import { getCat_plan } from "../../api/Plan.api.js";
import axios from 'axios';
import { BASE_URL } from '../../api/config.js';
import './css/Login.css';
import { FaUser, FaLock, FaEnvelope, FaCalendarAlt, FaVenusMars, FaGlobeAmericas, FaRulerVertical, FaWeight, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

const Register = () => {
    // Estados para controlar el flujo
    const [step, setStep] = useState(1); // 1: Plan, 2: Persona, 3: Usuario
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const [paises, setPaises] = useState([]);
    const [loadingPaises, setLoadingPaises] = useState(false);
    
    // Datos del formulario
    const [personaData, setPersonaData] = useState({
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        sexo: 'M',
        edad: '',
        altura: '',
        peso: '',
        img_perfil: '',
        tipo_persona: 0,
        idPais: '',
        idPlan: 0,
        activo: 1
    });
    
    const [userData, setUserData] = useState({
        usuario: '',
        correo: '',
        contrasenia: '',
        confirmContrasenia: '',
        id_perfil: 2
    });
    
    // Estados UI
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 768 });

    // Cargar datos iniciales
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoadingPlans(true);
                setLoadingPaises(true);
                
                // Cargar planes
                const plansResponse = await getCat_plan();
                setPlans(Array.isArray(plansResponse) ? plansResponse : plansResponse.data);
                
                // Cargar países
                const paisesResponse = await getPaises();
                setPaises(Array.isArray(paisesResponse) ? paisesResponse : paisesResponse.data);
            } catch (err) {
                setError('Error al cargar datos iniciales');
                console.error(err);
            } finally {
                setLoadingPlans(false);
                setLoadingPaises(false);
            }
        };
        
        loadInitialData();
    }, []);

    // Manejar selección de plan
    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
        setPersonaData(prev => ({
            ...prev,
            idPlan: planId
        }));
        setStep(2);
        setError('');
    };

    // Manejar cambios en datos personales
    const handlePersonaChange = (e) => {
        const { name, value } = e.target;
        
        // Calcular edad si cambia la fecha de nacimiento
        if (name === 'fecha_nacimiento' && value) {
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            setPersonaData(prev => ({
                ...prev,
                [name]: value,
                edad: age.toString()
            }));
            return;
        }
        
        setPersonaData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejar cambios en credenciales
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Validar y avanzar al paso de datos personales
    const validatePlanSelection = () => {
        if (!selectedPlan) {
            setError('Por favor selecciona un plan');
            return false;
        }
        return true;
    };

    // Validar datos personales
    const validatePersonaData = () => {
        const requiredFields = ['nombre', 'apellidos', 'sexo', 'edad', 'altura', 'peso', 'idPais'];
        const missingFields = requiredFields.filter(field => !personaData[field]);
        
        if (missingFields.length > 0) {
            setError('Por favor completa todos los campos obligatorios');
            return false;
        }
        
        if (isNaN(personaData.edad) || personaData.edad < 1 || personaData.edad > 120) {
            setError('Por favor ingresa una edad válida');
            return false;
        }
        
        return true;
    };

    // Validar credenciales
    const validateUserData = () => {
        if (!userData.usuario || !userData.correo || !userData.contrasenia || !userData.confirmContrasenia) {
            setError('Por favor completa todos los campos obligatorios');
            return false;
        }
        
        if (userData.contrasenia !== userData.confirmContrasenia) {
            setError('Las contraseñas no coinciden');
            return false;
        }
        
        if (userData.contrasenia.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        
        return true;
    };

    // Manejar envío del formulario completo
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            // Validar todos los datos
            if (!validatePlanSelection() || !validatePersonaData() || !validateUserData()) {
                return;
            }
            
            // Crear objeto de registro
            const registrationData = {
                persona: {
                    ...personaData,
                    idPlan: selectedPlan
                },
                usuario: {
                    nombre: `${personaData.nombre} ${personaData.apellidos}`,
                    usuario: userData.usuario,
                    correo: userData.correo,
                    contrasenia: userData.contrasenia,
                    id_perfil: userData.id_perfil
                }
            };
            
            // Enviar al backend
            const response = await axios.post(`${BASE_URL}/auth/complete-register`, registrationData);
            
            if (response.data.success) {
                setSuccess('Registro exitoso. Redirigiendo al login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message || 'Error en el registro');
            }
        } catch (err) {
            console.error('Error en registro:', err);
            setError(err.response?.data?.message || 'Error al procesar el registro');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==================== VERSION DESKTOP ====================
    
    // Renderizar selección de plan
    const renderPlanStep = () => (
        <div className="desktop-plan-step">
            <div className="brand-header">
                <h1>Selecciona tu plan</h1>
                <p>Elige el plan que mejor se adapte a tus necesidades</p>
            </div>
            
            {loadingPlans ? (
                <div className="text-center py-4">
                    <div className="spinner" role="status"></div>
                </div>
            ) : (
                <div className="plans-grid">
                    {plans.map(plan => (
                        <div 
                            key={plan.idPlan} 
                            className={`plan-card ${selectedPlan === plan.idPlan ? 'selected' : ''}`}
                            onClick={() => handlePlanSelect(plan.idPlan)}
                        >
                            <div className="plan-card-content">
                                <h3>{plan.plan_nombre}</h3>
                                <div className="plan-price">${plan.precio?.toLocaleString() || '0'} {plan.plan_duracion?.toLocaleString() || '0'}/días</div>
                                <ul className="plan-features">
                                    {plan.caracteristicas?.split(',').map((feat, i) => (
                                        <li key={i}>
                                            <FaCheck className="feature-icon" />
                                            {feat.trim()}
                                        </li>
                                    ))}
                                </ul>
                                <div className="plan-description">{plan.descripcion}</div>
                            </div>
                            {selectedPlan === plan.idPlan && (
                                <div className="plan-selected-badge">
                                    <FaCheck />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <div className="form-navigation">
                <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                >
                    Cancelar
                </button>
                <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => selectedPlan && setStep(2)}
                    disabled={!selectedPlan}
                >
                    Siguiente
                </button>
            </div>
            <div className="login-link">
                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
            </div>
        </div>
    );

    // Renderizar datos personales
    const renderPersonaStep = () => (
        <form onSubmit={(e) => { e.preventDefault(); validatePersonaData() && setStep(3); }}>
            <div className="brand-header">
                <h1>Tus datos personales</h1>
                <p>Completa tu información básica</p>
            </div>
            
            {selectedPlan && (
                <div className="selected-plan-banner">
                    Plan seleccionado: <strong>{plans.find(p => p.idPlan === selectedPlan)?.plan_nombre}</strong>
                </div>
            )}
            
            <div className="form-row">
                <div className="form-group">
                    <label>
                        <FaUser className="input-icon" />
                        Nombre *
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={personaData.nombre}
                        onChange={handlePersonaChange}
                        required
                        placeholder="Ingresa tu nombre"
                    />
                </div>
                
                <div className="form-group">
                    <label>
                        <FaUser className="input-icon" />
                        Apellidos *
                    </label>
                    <input
                        type="text"
                        name="apellidos"
                        value={personaData.apellidos}
                        onChange={handlePersonaChange}
                        required
                        placeholder="Ingresa tus apellidos"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>
                        <FaCalendarAlt className="input-icon" />
                        Fecha de Nacimiento
                    </label>
                    <input
                        type="date"
                        name="fecha_nacimiento"
                        value={personaData.fecha_nacimiento}
                        onChange={handlePersonaChange}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="form-group">
                    <label>
                        <FaUser className="input-icon" />
                        Edad *
                    </label>
                    <input
                        type="number"
                        name="edad"
                        value={personaData.edad}
                        onChange={handlePersonaChange}
                        required
                        min="1"
                        max="120"
                        placeholder="Edad"
                    />
                </div>

                <div className="form-group">
                    <label>
                        <FaVenusMars className="input-icon" />
                        Sexo *
                    </label>
                    <select
                        name="sexo"
                        value={personaData.sexo}
                        onChange={handlePersonaChange}
                        required
                    >
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>
                        <FaGlobeAmericas className="input-icon" />
                        País *
                    </label>
                    <select
                        name="idPais"
                        value={personaData.idPais}
                        onChange={handlePersonaChange}
                        required
                        disabled={loadingPaises}
                    >
                        <option value="">Seleccione un país</option>
                        {paises.map(pais => (
                            <option key={pais.idPais} value={pais.idPais}>
                                {pais.nombre_pais}
                            </option>
                        ))}
                    </select>
                    {loadingPaises && <div className="loading-small">Cargando países...</div>}
                </div>

                <div className="form-group">
                    <label>
                        <FaRulerVertical className="input-icon" />
                        Altura (cm) *
                    </label>
                    <input
                        type="number"
                        name="altura"
                        value={personaData.altura}
                        onChange={handlePersonaChange}
                        required
                        min="50"
                        max="250"
                        placeholder="Ej. 170"
                    />
                </div>

                <div className="form-group">
                    <label>
                        <FaWeight className="input-icon" />
                        Peso (kg) *
                    </label>
                    <input
                        type="number"
                        name="peso"
                        value={personaData.peso}
                        onChange={handlePersonaChange}
                        required
                        min="2"
                        max="300"
                        step="0.1"
                        placeholder="Ej. 65.5"
                    />
                </div>
            </div>

            <div className="form-navigation">
                <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setStep(1)}
                >
                    Atrás
                </button>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                >
                    Siguiente
                </button>
            </div>
            <div className="login-link">
                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
            </div>
        </form>
    );

    // Renderizar credenciales
    const renderUserStep = () => (
        <form onSubmit={handleSubmit}>
            <div className="brand-header">
                <h1>Crea tu cuenta</h1>
                <p>Define tus credenciales de acceso</p>
            </div>
            
            <div className="summary-card">
                <h4>Resumen de tu registro</h4>
                <div className="summary-content">
                    <div className="summary-item">
                        <span>Plan:</span>
                        <strong>{plans.find(p => p.idPlan === selectedPlan)?.plan_nombre}</strong>
                    </div>
                    <div className="summary-item">
                        <span>Nombre:</span>
                        <strong>{personaData.nombre} {personaData.apellidos}</strong>
                    </div>
                    <div className="summary-item">
                        <span>Edad:</span>
                        <strong>{personaData.edad} años</strong>
                    </div>
                </div>
            </div>
            
            <div className="form-group">
                <label>
                    <FaUser className="input-icon" />
                    Nombre de usuario *
                </label>
                <input
                    type="text"
                    name="usuario"
                    value={userData.usuario}
                    onChange={handleUserChange}
                    required
                    minLength="3"
                    placeholder="Ej. tunombre123"
                />
            </div>
            
            <div className="form-group">
                <label>
                    <FaEnvelope className="input-icon" />
                    Correo electrónico *
                </label>
                <input
                    type="email"
                    name="correo"
                    value={userData.correo}
                    onChange={handleUserChange}
                    required
                    placeholder="Ej. correo@ejemplo.com"
                />
            </div>
            
            <div className="password-row">
                <div className="form-group password-group">
                    <label>
                        <FaLock className="input-icon" />
                        Contraseña *
                    </label>
                    <div className="password-input">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="contrasenia"
                            value={userData.contrasenia}
                            onChange={handleUserChange}
                            required
                            minLength="6"
                            placeholder="Mínimo 6 caracteres"
                        />
                        <button 
                            type="button" 
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                </div>

                <div className="form-group password-group">
                    <label>
                        <FaLock className="input-icon" />
                        Confirmar contraseña *
                    </label>
                    <div className="password-input">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmContrasenia"
                            value={userData.confirmContrasenia}
                            onChange={handleUserChange}
                            required
                            placeholder="Repite tu contraseña"
                        />
                        <button 
                            type="button" 
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="form-navigation">
                <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setStep(2)}
                >
                    Atrás
                </button>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner"></span>
                            Registrando...
                        </>
                    ) : 'Completar registro'}
                </button>
            </div>
            
            <div className="login-link">
                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
            </div>
        </form>
    );

    // ==================== VERSION MÓVIL ====================

    // Renderizar selección de plan para móvil
    const renderMobilePlanStep = () => (
        <div className="mobile-register-content">
            <div className="mobile-register-header">
                <button className="mobile-back-btn" onClick={() => navigate('/')}>
                    <FaArrowLeft />
                </button>
                <h2>Elige tu plan</h2>
            </div>
            
            <div className="mobile-plans-container">
                {plans.map(plan => (
                    <div 
                        key={plan.idPlan} 
                        className={`mobile-plan-option ${selectedPlan === plan.idPlan ? 'selected' : ''}`}
                        onClick={() => handlePlanSelect(plan.idPlan)}
                    >
                        <h3>{plan.plan_nombre}</h3>
                        <div className="mobile-plan-price">
                            ${plan.precio?.toLocaleString() || '0'} 
                            <span>/{plan.plan_duracion?.toLocaleString() || '0'} días</span>
                        </div>
                        
                        <ul className="mobile-plan-benefits">
                            {plan.caracteristicas?.split(',').slice(0, 3).map((feat, i) => (
                                <li key={i}>
                                    <FaCheck className="mobile-feature-icon" />
                                    {feat.trim()}
                                </li>
                            ))}
                        </ul>
                        
                        <button className="mobile-plan-select-btn">
                            {selectedPlan === plan.idPlan ? 'Seleccionado' : 'Seleccionar'}
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mobile-nav-footer">
                <button 
                    className="mobile-next-step-btn"
                    onClick={() => selectedPlan && setStep(2)}
                    disabled={!selectedPlan}
                >
                    Continuar
                </button>
            </div>
        </div>
    );

    // Renderizar datos personales para móvil
    const renderMobilePersonaStep = () => (
        <div className="mobile-register-content">
            <div className="mobile-register-header">
                <button className="mobile-back-btn" onClick={() => setStep(1)}>
                    <FaArrowLeft />
                </button>
                <h2>Tus datos</h2>
            </div>
            
            <form className="mobile-register-form">
                <div className="mobile-form-section">
                    <h3>Información básica</h3>
                    <div className="mobile-input-group">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={personaData.nombre}
                            onChange={handlePersonaChange}
                            required
                            placeholder="Tu nombre"
                        />
                    </div>
                    
                    <div className="mobile-input-group">
                        <label>Apellidos *</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={personaData.apellidos}
                            onChange={handlePersonaChange}
                            required
                            placeholder="Tus apellidos"
                        />
                    </div>
                    
                    <div className="mobile-form-row">
                        <div className="mobile-input-group">
                            <label>Fecha Nacimiento</label>
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                value={personaData.fecha_nacimiento}
                                onChange={handlePersonaChange}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        
                        <div className="mobile-input-group">
                            <label>Edad *</label>
                            <input
                                type="number"
                                name="edad"
                                value={personaData.edad}
                                onChange={handlePersonaChange}
                                required
                                placeholder="Edad"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mobile-form-section">
                    <h3>Detalles personales</h3>
                    <div className="mobile-input-group">
                        <label>Sexo *</label>
                        <select
                            name="sexo"
                            value={personaData.sexo}
                            onChange={handlePersonaChange}
                            required
                        >
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="O">Otro</option>
                        </select>
                    </div>
                    
                    <div className="mobile-input-group">
                        <label>País *</label>
                        <select
                            name="idPais"
                            value={personaData.idPais}
                            onChange={handlePersonaChange}
                            required
                        >
                            <option value="">Selecciona país</option>
                            {paises.map(pais => (
                                <option key={pais.idPais} value={pais.idPais}>
                                    {pais.nombre_pais}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="mobile-form-row">
                        <div className="mobile-input-group">
                            <label>Altura (cm) *</label>
                            <input
                                type="number"
                                name="altura"
                                value={personaData.altura}
                                onChange={handlePersonaChange}
                                required
                                placeholder="Ej. 170"
                            />
                        </div>
                        
                        <div className="mobile-input-group">
                            <label>Peso (kg) *</label>
                            <input
                                type="number"
                                name="peso"
                                value={personaData.peso}
                                onChange={handlePersonaChange}
                                required
                                placeholder="Ej. 65.5"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mobile-nav-footer">
                    <button 
                        type="button"
                        className="mobile-next-step-btn"
                        onClick={(e) => { e.preventDefault(); validatePersonaData() && setStep(3); }}
                    >
                        Siguiente
                    </button>
                </div>
            </form>
        </div>
    );

    // Renderizar credenciales para móvil
    const renderMobileUserStep = () => (
        <div className="mobile-register-content">
            <div className="mobile-register-header">
                <button className="mobile-back-btn" onClick={() => setStep(2)}>
                    <FaArrowLeft />
                </button>
                <h2>Crea tu cuenta</h2>
            </div>
            
            <form className="mobile-register-form" onSubmit={handleSubmit}>
                <div className="mobile-form-section">
                    <h3>Resumen</h3>
                    <div className="mobile-summary-box">
                        <div className="mobile-summary-item">
                            <span>Plan:</span>
                            <strong>{plans.find(p => p.idPlan === selectedPlan)?.plan_nombre}</strong>
                        </div>
                        <div className="mobile-summary-item">
                            <span>Nombre:</span>
                            <strong>{personaData.nombre} {personaData.apellidos}</strong>
                        </div>
                    </div>
                </div>
                
                <div className="mobile-form-section">
                    <h3>Credenciales</h3>
                    <div className="mobile-input-group">
                        <label>Usuario *</label>
                        <input
                            type="text"
                            name="usuario"
                            value={userData.usuario}
                            onChange={handleUserChange}
                            required
                            placeholder="tunombre123"
                        />
                    </div>
                    
                    <div className="mobile-input-group">
                        <label>Correo *</label>
                        <input
                            type="email"
                            name="correo"
                            value={userData.correo}
                            onChange={handleUserChange}
                            required
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                    
                    <div className="mobile-input-group">
                        <label>Contraseña *</label>
                        <div className="mobile-password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="contrasenia"
                                value={userData.contrasenia}
                                onChange={handleUserChange}
                                required
                                placeholder="Mínimo 6 caracteres"
                            />
                            <button 
                                type="button" 
                                className="mobile-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mobile-input-group">
                        <label>Confirmar contraseña *</label>
                        <div className="mobile-password-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmContrasenia"
                                value={userData.confirmContrasenia}
                                onChange={handleUserChange}
                                required
                                placeholder="Repite tu contraseña"
                            />
                            <button 
                                type="button" 
                                className="mobile-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="mobile-nav-footer">
                    <button 
                        type="submit"
                        className="mobile-submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creando cuenta...' : 'Completar registro'}
                    </button>
                </div>
            </form>
        </div>
    );

    return (
    <div className={`register-page ${isMobile ? 'mobile-view' : ''}`}>
        {/* Fondo con círculos - ahora detrás de todo */}
        <div className="login-background" style={{ zIndex: 0 }}>
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
        </div>
        
        {/* Contenedor principal con mayor z-index */}
        <div className="register-container" style={{ position: 'relative', zIndex: 1 }}>
            {isMobile ? (
                <div className="mobile-register-content">
                    {error && <div className="mobile-error">{error}</div>}
                    {success && <div className="mobile-success">{success}</div>}
                    
                    {step === 1 && renderMobilePlanStep()}
                    {step === 2 && renderMobilePersonaStep()}
                    {step === 3 && renderMobileUserStep()}
                </div>
            ) : (
                    <div className="register-card-container">
                        <div className="login-card">
                            <div className="steps-indicator">
                                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                                    <div className="step-number">{step > 1 ? <FaCheck /> : '1'}</div>
                                    <div className="step-label">Plan</div>
                                </div>
                                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                                    <div className="step-number">{step > 2 ? <FaCheck /> : '2'}</div>
                                    <div className="step-label">Datos</div>
                                </div>
                                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                                    <div className="step-number">3</div>
                                    <div className="step-label">Cuenta</div>
                                </div>
                            </div>
                            
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                            
                            {step === 1 && renderPlanStep()}
                            {step === 2 && renderPersonaStep()}
                            {step === 3 && renderUserStep()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;