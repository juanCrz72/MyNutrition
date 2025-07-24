import { useState } from 'react';
import { useAuth } from './../Superadmin/AuthContext.jsx';
import { 
  FaUtensils, FaChartLine, FaUser, FaSignOutAlt, FaAppleAlt, FaWater, 
  FaFireAlt, FaWeight, FaClipboardList, FaEdit, FaBook, FaHeartbeat,
  FaRunning, FaPills, FaAllergies, FaBullseye, FaExclamationTriangle,
  FaCheckCircle, FaChevronRight, FaChevronLeft, FaUserCircle, FaNutritionix,
  FaCalendarAlt, FaHistory, FaListAlt, FaCog, FaBowlFood
} from 'react-icons/fa';
import { GiMeal, GiWeightScale, GiHealthNormal, GiMuscleUp } from 'react-icons/gi';
import { MdToday, MdSports, MdOutlineRestaurantMenu, MdOutlineMedicalServices } from 'react-icons/md';
import { BiDrink, BiSolidFoodMenu } from 'react-icons/bi';
import { RiMentalHealthLine, RiUserSettingsLine } from 'react-icons/ri';
import { TbProgressCheck } from 'react-icons/tb';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import './css/Estilos.css';

const User = () => {
    const { user, logout } = useAuth();
    const [healthQuestionnaireCompleted, setHealthQuestionnaireCompleted] = useState(false);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showProfileModal, setShowProfileModal] = useState(false);
    
    const [formData, setFormData] = useState({
        act_fisica: '',
        diabetes: '',
        hipertension: '',
        otra_enfermedad: '',
        toma_medicamento: '',
        medicamento_descrip: '',
        consumo_calorias: '',
        calorias_descrip: '',
        alergias: '',
        metas: ''
    });

    // Datos de ejemplo estáticos
    const userProfile = {
        name: "Jose Ignacio de la Paz",
        email: "jose@gmail.com",
        age: 34,
        gender: "Masculino",
        height: 165,
        weight: 68.5,
        goal: "Perder peso y tonificar",
        joinDate: "15/03/2023",
        lastLogin: "Hoy, 09:45 AM"
    };

    const plannedMeals = {
        today: [
            { time: '08:00', name: 'Desayuno', foods: ['Avena con frutas', 'Té verde'], calories: 350 },
            { time: '11:00', name: 'Snack', foods: ['Yogur natural', 'Almendras'], calories: 200 },
            { time: '13:30', name: 'Almuerzo', foods: ['Pechuga de pollo a la plancha', 'Arroz integral', 'Ensalada verde'], calories: 550 },
            { time: '16:30', name: 'Merienda', foods: ['Batido de proteína'], calories: 180 },
            { time: '19:30', name: 'Cena', foods: ['Salmón al horno', 'Espárragos', 'Puré de coliflor'], calories: 400 }
        ],
        tomorrow: [
            { time: '08:00', name: 'Desayuno', foods: ['Tostadas integrales', 'Aguacate', 'Huevo pochado'], calories: 380 },
            { time: '11:00', name: 'Snack', foods: ['Frutos secos'], calories: 150 },
            { time: '13:30', name: 'Almuerzo', foods: ['Lentejas estofadas', 'Quinoa', 'Verduras al vapor'], calories: 500 },
            { time: '16:30', name: 'Merienda', foods: ['Queso fresco', 'Galletas integrales'], calories: 220 },
            { time: '19:30', name: 'Cena', foods: ['Tortilla de espinacas', 'Ensalada de tomate'], calories: 350 }
        ]
    };

    const nutritionData = {
        calories: {
            consumed: 1580,
            goal: 2000,
            percentage: 79,
            remaining: 420
        },
        macros: {
            protein: {
                consumed: 120,
                goal: 150,
                percentage: 80
            },
            carbs: {
                consumed: 180,
                goal: 200,
                percentage: 90
            },
            fats: {
                consumed: 50,
                goal: 65,
                percentage: 77
            }
        },
        water: {
            consumed: 2.1,
            goal: 2.5,
            percentage: 84
        },
        weight: {
            current: 68.5,
            goal: 65,
            trend: -0.5,
            trendIcon: 'down',
            lastUpdate: 'Hoy'
        },
        meals: [
            { time: '08:30', name: 'Desayuno', food: 'Avena con frutas', calories: 350 },
            { time: '12:15', name: 'Almuerzo', food: 'Pollo con arroz integral', calories: 550 },
            { time: '15:30', name: 'Merienda', food: 'Yogur con almendras', calories: 280 },
            { time: '19:00', name: 'Cena', food: 'Salmón con espárragos', calories: 400 }
        ],
        nextMeal: {
            time: '10:30',
            name: 'Snack mañana',
            suggestion: 'Batido de proteína con plátano'
        },
        activity: {
            steps: 7850,
            goal: 10000,
            caloriesBurned: 420
        }
    };

    // Calcular porcentajes
    nutritionData.calories.percentage = Math.min(100, Math.round((nutritionData.calories.consumed / nutritionData.calories.goal) * 100));
    nutritionData.water.percentage = Math.min(100, Math.round((nutritionData.water.consumed / nutritionData.water.goal) * 100));
    nutritionData.calories.remaining = nutritionData.calories.goal - nutritionData.calories.consumed;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmitQuestionnaire = (e) => {
        e.preventDefault();
        console.log('Datos enviados:', formData);
        setHealthQuestionnaireCompleted(true);
        setShowQuestionnaire(false);
        setStep(1);
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Completa esta información para un plan personalizado
        </Tooltip>
    );

    const renderProfileModal = () => (
        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg" centered>
            <Modal.Header closeButton className="bg-gradient-primary text-white">
                <Modal.Title className="d-flex align-items-center">
                    <RiUserSettingsLine size={28} className="me-3" />
                    <h3 className="mb-0">Mi Perfil</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-4">
                    <Col md={4} className="text-center">
                        <div className="profile-pic-container mb-3">
                            <FaUserCircle size={100} className="text-primary" />
                        </div>
                        <Button variant="outline-primary" size="sm">Cambiar foto</Button>
                    </Col>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Nombre completo</span>
                                <span>{userProfile.name}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Correo electrónico</span>
                                <span>{userProfile.email}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Edad</span>
                                <span>{userProfile.age} años</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Género</span>
                                <span>{userProfile.gender}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Altura</span>
                                <span>{userProfile.height} cm</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Peso actual</span>
                                <span>{userProfile.weight} kg</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Objetivo principal</span>
                                <span>{userProfile.goal}</span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                <div className="d-flex justify-content-between">
                    <Button variant="outline-secondary">Cambiar contraseña</Button>
                    <Button variant="primary">Guardar cambios</Button>
                </div>
            </Modal.Body>
        </Modal>
    );

    const renderMealPlanSection = () => (
        <div className="meal-plan-section">
            <h3 className="mb-4 d-flex align-items-center">
                <BiSolidFoodMenu className="me-2 text-success" />
                Plan de Alimentación
            </h3>
            
            <Tabs defaultActiveKey="today" id="meal-plan-tabs" className="mb-3 custom-tabs">
                <Tab eventKey="today" title="Hoy" className="p-3">
                    <ListGroup variant="flush">
                        {plannedMeals.today.map((meal, index) => (
                            <ListGroup.Item key={index} className="meal-item">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FaUtensils className="me-2 text-primary" />
                                        {meal.name} - {meal.time}
                                    </h5>
                                    <Badge bg="primary" pill>{meal.calories} kcal</Badge>
                                </div>
                                <ul className="list-unstyled mb-0">
                                    {meal.foods.map((food, i) => (
                                        <li key={i} className="d-flex align-items-center mb-1">
                                            <FaUtensils className="me-2 text-muted" size={12} />
                                            {food}
                                        </li>
                                    ))}
                                </ul>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Tab>
                <Tab eventKey="tomorrow" title="Mañana" className="p-3">
                    <ListGroup variant="flush">
                        {plannedMeals.tomorrow.map((meal, index) => (
                            <ListGroup.Item key={index} className="meal-item">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="mb-0 d-flex align-items-center">
                                        <FaUtensils className="me-2 text-primary" />
                                        {meal.name} - {meal.time}
                                    </h5>
                                    <Badge bg="primary" pill>{meal.calories} kcal</Badge>
                                </div>
                                <ul className="list-unstyled mb-0">
                                    {meal.foods.map((food, i) => (
                                        <li key={i} className="d-flex align-items-center mb-1">
                                            <FaUtensils className="me-2 text-muted" size={12} />
                                            {food}
                                        </li>
                                    ))}
                                </ul>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Tab>
            </Tabs>
            
            <div className="text-center mt-4">
                <Button variant="success" className="me-2">
                    <FaCalendarAlt className="me-2" />
                    Ver plan semanal
                </Button>
                <Button variant="outline-primary">
                    <FaEdit className="me-2" />
                    Personalizar plan
                </Button>
            </div>
        </div>
    );

    const renderUserDataSection = () => (
        <div className="user-data-section">
            <h3 className="mb-4 d-flex align-items-center">
                <FaUserCircle className="me-2 text-info" />
                Mis Datos Personales
            </h3>
            
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title className="d-flex align-items-center">
                                <FaUser className="me-2 text-primary" />
                                Información Básica
                            </Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span className="fw-bold">Nombre:</span>
                                    <span>{userProfile.name}</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span className="fw-bold">Edad:</span>
                                    <span>{userProfile.age} años</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span className="fw-bold">Género:</span>
                                    <span>{userProfile.gender}</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span className="fw-bold">Altura:</span>
                                    <span>{userProfile.height} cm</span>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title className="d-flex align-items-center">
                                <GiHealthNormal className="me-2 text-danger" />
                                Datos de Salud
                            </Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span className="fw-bold">Peso actual:</span>
                                    <span>{userProfile.weight} kg</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span className="fw-bold">IMC:</span>
                                    <span>25.1 (Sobrepeso leve)</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span className="fw-bold">Objetivo:</span>
                                    <span>{userProfile.goal}</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span className="fw-bold">Miembro desde:</span>
                                    <span>{userProfile.joinDate}</span>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <div className="text-center">
                <Button variant="primary" onClick={() => setShowProfileModal(true)}>
                    <FaEdit className="me-2" />
                    Editar mis datos
                </Button>
            </div>
        </div>
    );

    const renderDashboardSection = () => (
        <>
            {/* Header con información del usuario */}
            <Row className="dashboard-header align-items-center mb-4">
                <Col md={8}>
                    <h1 className="display-5 fw-bold mb-1 text-gradient-primary">¡Hola, {user?.nombre.split(' ')[0]}!</h1>
                    <p className="lead text-muted mb-0">Bienvenido a tu espacio nutricional personalizado</p>
                </Col>
                <Col md={4} className="d-flex justify-content-md-end align-items-center mt-3 mt-md-0">
                    <div className="d-flex align-items-center">
                        <div 
                            className="avatar bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 cursor-pointer"
                            onClick={() => setShowProfileModal(true)}
                        >
                            <FaUser size={20} />
                        </div>
                        <Button variant="outline-danger" onClick={logout} className="d-flex align-items-center logout-button">
                            <FaSignOutAlt className="me-1" /> Salir
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Notificación destacada del cuestionario */}
            {!healthQuestionnaireCompleted && (
                <Alert variant="danger" className="d-flex align-items-center mb-4 questionnaire-alert">
                    <div className="alert-icon-container">
                        <FaExclamationTriangle size={24} />
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h5 className="alert-title mb-1">¡Cuestionario de salud pendiente!</h5>
                        <p className="mb-0">
                            Completa tu cuestionario inicial para desbloquear todas las funciones y recibir un plan nutricional personalizado.
                        </p>
                    </div>
                    <Button 
                        variant="danger" 
                        className="ms-3 alert-button"
                        onClick={() => setShowQuestionnaire(true)}
                    >
                        Completar ahora
                    </Button>
                </Alert>
            )}

            {/* Tarjetas de Acceso Rápido Mejoradas */}
            <Row className="mb-4 quick-access-row">
                <Col xs={12} md={4} className="mb-3">
                    <Card className="h-100 shadow-sm border-0 quick-access-card questionnaire-card">
                        <Card.Body className="d-flex flex-column p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="card-icon-container bg-danger bg-opacity-10 text-danger">
                                    <FaClipboardList size={24} />
                                </div>
                                <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip}
                                >
                                    <span className="ms-auto badge bg-danger">¡Importante!</span>
                                </OverlayTrigger>
                            </div>
                            <Card.Title className="mb-3">Cuestionario de Salud</Card.Title>
                            <Card.Text className="mb-4 text-muted">
                                Completa tu evaluación inicial para obtener recomendaciones personalizadas basadas en tu perfil de salud.
                            </Card.Text>
                            <Button 
                                variant="danger" 
                                className="mt-auto w-100 card-button"
                                onClick={() => setShowQuestionnaire(true)}
                            >
                                <FaClipboardList className="me-2" /> Completar ahora
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12} md={4} className="mb-3">
                    <Card className="h-100 shadow-sm border-0 quick-access-card">
                        <Card.Body className="d-flex flex-column p-4">
                            <div className="card-icon-container bg-primary bg-opacity-10 text-primary">
                                <FaEdit size={24} />
                            </div>
                            <Card.Title className="my-3">Editar Perfil</Card.Title>
                            <Card.Text className="mb-4 text-muted">
                                Actualiza tu información personal, foto de perfil y configuración de preferencias.
                            </Card.Text>
                            <Button 
                                variant="outline-primary" 
                                className="mt-auto w-100 card-button"
                                onClick={() => setShowProfileModal(true)}
                            >
                                <FaEdit className="me-2" /> Editar perfil
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12} md={4} className="mb-3">
                    <Card className="h-100 shadow-sm border-0 quick-access-card">
                        <Card.Body className="d-flex flex-column p-4">
                            <div className="card-icon-container bg-success bg-opacity-10 text-success">
                                <FaBook size={24} />
                            </div>
                            <Card.Title className="my-3">Bitácora de Salud</Card.Title>
                            <Card.Text className="mb-4 text-muted">
                                Revisa tu historial completo de comidas, ejercicios, progreso y consultas anteriores.
                            </Card.Text>
                            <Button variant="outline-success" className="mt-auto w-100 card-button">
                                <FaBook className="me-2" /> Ver bitácora
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Resumen rápido mejorado */}
            <Row className="mb-4 stats-row">
                <Col xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
                    <Card className="h-100 shadow-sm border-0 stats-card calories-card">
                        <Card.Body className="d-flex flex-column p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="stats-icon bg-danger bg-opacity-10 text-danger">
                                    <FaFireAlt size={20} />
                                </div>
                                <Card.Title className="mb-0 ms-3">Calorías</Card.Title>
                            </div>
                            <div className="text-center my-2">
                                <h2 className="fw-bold mb-0">{nutritionData.calories.consumed}</h2>
                                <small className="text-muted">de {nutritionData.calories.goal} kcal</small>
                            </div>
                            <div className="mb-3">
                                <ProgressBar 
                                    now={nutritionData.calories.percentage} 
                                    variant={nutritionData.calories.percentage > 90 ? 'danger' : nutritionData.calories.percentage > 70 ? 'warning' : 'success'} 
                                    className="progress-thin" 
                                    animated 
                                />
                                <div className="d-flex justify-content-between mt-1">
                                    <small className="text-muted">{nutritionData.calories.percentage}%</small>
                                    <small className={nutritionData.calories.remaining > 0 ? 'text-success' : 'text-danger'}>
                                        {nutritionData.calories.remaining > 0 ? 
                                        `${nutritionData.calories.remaining} restantes` : 
                                        'Límite excedido'}
                                    </small>
                                </div>
                            </div>
                            <Button variant="outline-danger" size="sm" className="mt-auto w-100 card-button">
                                <FaFireAlt className="me-1" /> Registrar comida
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
                    <Card className="h-100 shadow-sm border-0 stats-card water-card">
                        <Card.Body className="d-flex flex-column p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="stats-icon bg-info bg-opacity-10 text-info">
                                    <FaWater size={20} />
                                </div>
                                <Card.Title className="mb-0 ms-3">Agua</Card.Title>
                            </div>
                            <div className="text-center my-2">
                                <h2 className="fw-bold mb-0">{nutritionData.water.consumed}</h2>
                                <small className="text-muted">de {nutritionData.water.goal} L</small>
                            </div>
                            <div className="mb-3">
                                <ProgressBar 
                                    now={nutritionData.water.percentage} 
                                    variant={nutritionData.water.percentage > 80 ? 'info' : 'primary'} 
                                    className="progress-thin" 
                                    animated 
                                />
                                <div className="d-flex justify-content-between mt-1">
                                    <small className="text-muted">{nutritionData.water.percentage}%</small>
                                    <small className="text-info">
                                        {Math.round((nutritionData.water.goal - nutritionData.water.consumed) * 10) / 10} L restantes
                                    </small>
                                </div>
                            </div>
                            <Button variant="outline-info" size="sm" className="mt-auto w-100 card-button">
                                <BiDrink className="me-1" /> Registrar agua
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
                    <Card className="h-100 shadow-sm border-0 stats-card weight-card">
                        <Card.Body className="d-flex flex-column p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="stats-icon bg-purple bg-opacity-10 text-purple">
                                    <GiWeightScale size={20} />
                                </div>
                                <Card.Title className="mb-0 ms-3">Peso</Card.Title>
                            </div>
                            <div className="text-center my-2">
                                <h2 className="fw-bold mb-0">{nutritionData.weight.current}</h2>
                                <small className="text-muted">Meta: {nutritionData.weight.goal} kg</small>
                            </div>
                            <div className={`d-flex align-items-center justify-content-center mb-3 ${nutritionData.weight.trend < 0 ? 'text-success' : 'text-danger'}`}>
                                <FaChartLine className="me-2" />
                                <span>{Math.abs(nutritionData.weight.trend)} kg {nutritionData.weight.trend < 0 ? 'menos' : 'más'} esta semana</span>
                            </div>
                            <Button variant="outline-purple" size="sm" className="mt-auto w-100 card-button">
                                <FaWeight className="me-1" /> Registrar peso
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
                    <Card className="h-100 shadow-sm border-0 stats-card activity-card">
                        <Card.Body className="d-flex flex-column p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="stats-icon bg-warning bg-opacity-10 text-warning">
                                    <MdSports size={20} />
                                </div>
                                <Card.Title className="mb-0 ms-3">Actividad</Card.Title>
                            </div>
                            <div className="text-center my-2">
                                <h2 className="fw-bold mb-0">{nutritionData.activity.steps.toLocaleString()}</h2>
                                <small className="text-muted">de {nutritionData.activity.goal.toLocaleString()} pasos</small>
                            </div>
                            <div className="mb-3">
                                <ProgressBar 
                                    now={(nutritionData.activity.steps / nutritionData.activity.goal) * 100} 
                                    variant="warning" 
                                    className="progress-thin" 
                                    animated 
                                />
                                <div className="d-flex justify-content-between mt-1">
                                    <small className="text-muted">
                                        {Math.round((nutritionData.activity.steps / nutritionData.activity.goal) * 100)}%
                                    </small>
                                    <small className="text-warning">
                                        {nutritionData.activity.caloriesBurned} kcal quemadas
                                    </small>
                                </div>
                            </div>
                            <Button variant="outline-warning" size="sm" className="mt-auto w-100 card-button">
                                <MdSports className="me-1" /> Registrar ejercicio
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Comidas y macros - Sección mejorada */}
            <Row className="mb-4">
                <Col lg={8} className="mb-4 mb-lg-0">
                    <Card className="shadow-sm border-0 h-100 meals-card">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="section-icon bg-success bg-opacity-10 text-success">
                                    <MdOutlineRestaurantMenu size={24} />
                                </div>
                                <Card.Title className="mb-0 ms-3">Registro de comidas hoy</Card.Title>
                                <Badge bg="success" className="ms-auto">{nutritionData.meals.length} comidas</Badge>
                            </div>
                            
                            <div className="timeline">
                                {nutritionData.meals.map((meal, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-badge bg-success"></div>
                                        <div className="timeline-panel">
                                            <div className="timeline-heading">
                                                <h5 className="timeline-title d-flex justify-content-between">
                                                    <span className="d-flex align-items-center">
                                                        <GiMeal className="me-2 text-success" />
                                                        {meal.name}
                                                    </span>
                                                    <small className="text-muted">{meal.time}</small>
                                                </h5>
                                            </div>
                                            <div className="timeline-body">
                                                <p className="mb-1">{meal.food}</p>
                                                <Badge bg="secondary" pill className="d-inline-flex align-items-center">
                                                    <FaFireAlt className="me-1" size={12} />
                                                    {meal.calories} kcal
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Próxima comida */}
                                <div className="timeline-item next-meal">
                                    <div className="timeline-badge bg-info"></div>
                                    <div className="timeline-panel">
                                        <div className="timeline-heading">
                                            <h5 className="timeline-title d-flex justify-content-between">
                                                <span className="d-flex align-items-center">
                                                    <GiMeal className="me-2 text-info" />
                                                    {nutritionData.nextMeal.name}
                                                </span>
                                                <small className="text-muted">{nutritionData.nextMeal.time}</small>
                                            </h5>
                                        </div>
                                        <div className="timeline-body">
                                            <p className="mb-2">{nutritionData.nextMeal.suggestion}</p>
                                            <Button variant="outline-success" size="sm" className="d-inline-flex align-items-center">
                                                <FaUtensils className="me-1" /> Registrar ahora
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={4}>
                    <Card className="shadow-sm border-0 h-100 macros-card">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="section-icon bg-danger bg-opacity-10 text-danger">
                                    <FaAppleAlt size={24} />
                                </div>
                                <Card.Title className="mb-0 ms-3">Macronutrientes</Card.Title>
                            </div>
                            
                            <div className="macro-progress mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-bold">Proteínas</span>
                                    <span className="text-muted">
                                        {nutritionData.macros.protein.consumed}g / {nutritionData.macros.protein.goal}g
                                    </span>
                                </div>
                                <ProgressBar now={nutritionData.macros.protein.percentage} variant="danger" className="progress-thin" animated />
                                <div className="d-flex justify-content-between mt-1">
                                    <small className="text-muted">{nutritionData.macros.protein.percentage}%</small>
                                    <small className="text-danger">
                                        {nutritionData.macros.protein.goal - nutritionData.macros.protein.consumed}g restantes
                                    </small>
                                </div>
                            </div>
                            
                            <div className="macro-progress mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-bold">Carbohidratos</span>
                                    <span className="text-muted">
                                        {nutritionData.macros.carbs.consumed}g / {nutritionData.macros.carbs.goal}g
                                    </span>
                                </div>
                                <ProgressBar now={nutritionData.macros.carbs.percentage} variant="success" className="progress-thin" animated />
                                <div className="d-flex justify-content-between mt-1">
                                    <small className="text-muted">{nutritionData.macros.carbs.percentage}%</small>
                                    <small className="text-success">
                                        {nutritionData.macros.carbs.goal - nutritionData.macros.carbs.consumed}g restantes
                                    </small>
                                </div>
                            </div>
                            
                            <div className="macro-progress mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-bold">Grasas</span>
                                    <span className="text-muted">
                                        {nutritionData.macros.fats.consumed}g / {nutritionData.macros.fats.goal}g
                                    </span>
                                </div>
                                <ProgressBar now={nutritionData.macros.fats.percentage} variant="warning" className="progress-thin" animated />
                                <div className="d-flex justify-content-between mt-1">
                                    <small className="text-muted">{nutritionData.macros.fats.percentage}%</small>
                                    <small className="text-warning">
                                        {nutritionData.macros.fats.goal - nutritionData.macros.fats.consumed}g restantes
                                    </small>
                                </div>
                            </div>
                            
                            <div className="text-center mt-4">
                                <Button variant="primary" className="w-100 card-button">
                                    Ver detalles nutricionales
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Acciones rápidas mejoradas */}
            <Row>
                <Col xs={12}>
                    <Card className="shadow-sm border-0 quick-actions-card">
                        <Card.Body className="p-4">
                            <Card.Title className="mb-4">Acciones Rápidas</Card.Title>
                            <div className="d-flex flex-wrap justify-content-center gap-3">
                                <Button variant="outline-primary" size="lg" className="d-flex align-items-center quick-action-button">
                                    <FaUtensils className="me-2" /> Registrar comida
                                </Button>
                                <Button variant="outline-info" size="lg" className="d-flex align-items-center quick-action-button">
                                    <BiDrink className="me-2" /> Registrar agua
                                </Button>
                                <Button variant="outline-secondary" size="lg" className="d-flex align-items-center quick-action-button">
                                    <GiWeightScale className="me-2" /> Registrar peso
                                </Button>
                                <Button variant="outline-success" size="lg" className="d-flex align-items-center quick-action-button">
                                    <MdSports className="me-2" /> Registrar ejercicio
                                </Button>
                                <Button variant="outline-warning" size="lg" className="d-flex align-items-center quick-action-button">
                                    <FaChartLine className="me-2" /> Ver progreso
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Mensaje motivacional mejorado */}
            <Row className="mt-4">
                <Col xs={12}>
                    <div className="motivational-message p-4 rounded text-center">
                        <div className="quote-icon mb-3">
                            <FaHeartbeat size={32} className="text-primary opacity-25" />
                        </div>
                        <h4 className="mb-3 fw-bold">"Cada pequeño paso cuenta en tu viaje hacia una vida más saludable"</h4>
                        <p className="mb-0 lead">
                            Hoy has completado el {Math.round((nutritionData.calories.consumed / nutritionData.calories.goal) * 100)}% de tu meta diaria. ¡Sigue así!
                        </p>
                    </div>
                </Col>
            </Row>
        </>
    );

    return (
        <>
            {/* Modal del Cuestionario de Salud */}
            <Modal 
                show={showQuestionnaire} 
                onHide={() => setShowQuestionnaire(false)}
                size="lg"
                centered
                backdrop="static"
                className="health-questionnaire-modal"
            >
                <Modal.Header closeButton className="bg-gradient-primary text-white">
                    <Modal.Title className="d-flex align-items-center">
                        <GiHealthNormal size={28} className="me-3" />
                        <div>
                            <h3 className="mb-0">Cuestionario de Salud Integral</h3>
                            <small className="opacity-75">Paso {step} de 4</small>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <ProgressBar now={(step / 4) * 100} className="mb-4 progress-custom" />
                    
                    <Form onSubmit={handleSubmitQuestionnaire} className="questionnaire-form">
                        {/* Paso 1: Actividad física y condiciones médicas */}
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="step-icon bg-info text-white">
                                        <FaRunning size={20} />
                                    </div>
                                    <h4 className="mb-0 ms-3">Actividad Física y Salud</h4>
                                </div>
                                
                                <Form.Group className="mb-4 form-group-custom">
                                    <Form.Label className="fw-bold">Nivel de actividad física</Form.Label>
                                    <Form.Select 
                                        name="act_fisica" 
                                        value={formData.act_fisica} 
                                        onChange={handleChange}
                                        required
                                        className="form-control-custom"
                                    >
                                        <option value="">Selecciona tu nivel de actividad</option>
                                        <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
                                        <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
                                        <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
                                        <option value="activo">Activo (ejercicio 6-7 días/semana)</option>
                                        <option value="intenso">Muy activo (ejercicio intenso diario)</option>
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Esto nos ayuda a calcular tus necesidades calóricas
                                    </Form.Text>
                                </Form.Group>
                                
                                <Card className="mb-4 health-conditions-card">
                                    <Card.Body>
                                        <Card.Title className="mb-3">Condiciones de Salud</Card.Title>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 custom-checkbox">
                                                    <Form.Check 
                                                        type="checkbox"
                                                        id="diabetes-check"
                                                        label={
                                                            <>
                                                                <MdOutlineMedicalServices className="me-2 text-danger" />
                                                                Diabetes
                                                            </>
                                                        }
                                                        name="diabetes"
                                                        checked={formData.diabetes === '1'}
                                                        onChange={(e) => handleChange({
                                                            target: {
                                                                name: 'diabetes',
                                                                value: e.target.checked ? '1' : '0'
                                                            }
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3 custom-checkbox">
                                                    <Form.Check 
                                                        type="checkbox"
                                                        id="hipertension-check"
                                                        label={
                                                            <>
                                                                <RiMentalHealthLine className="me-2 text-primary" />
                                                                Hipertensión
                                                            </>
                                                        }
                                                        name="hipertension"
                                                        checked={formData.hipertension === '1'}
                                                        onChange={(e) => handleChange({
                                                            target: {
                                                                name: 'hipertension',
                                                                value: e.target.checked ? '1' : '0'
                                                            }
                                                        })}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Group className="custom-checkbox">
                                            <Form.Check 
                                                type="checkbox"
                                                id="otra-enfermedad-check"
                                                label="Otras condiciones médicas"
                                                name="otra_enfermedad"
                                                checked={formData.otra_enfermedad === '1'}
                                                onChange={(e) => handleChange({
                                                    target: {
                                                        name: 'otra_enfermedad',
                                                        value: e.target.checked ? '1' : '0'
                                                    }
                                                })}
                                            />
                                            {formData.otra_enfermedad === '1' && (
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Por favor describe tu condición"
                                                    name="otra_enfermedad_desc"
                                                    value={formData.otra_enfermedad_desc}
                                                    onChange={handleChange}
                                                    className="mt-2 form-control-custom"
                                                />
                                            )}
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </div>
                        )}
                        
                        {/* Paso 2: Medicamentos y consumo calórico */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="step-icon bg-warning text-white">
                                        <FaPills size={20} />
                                    </div>
                                    <h4 className="mb-0 ms-3">Medicamentos y Hábitos</h4>
                                </div>
                                
                                <Card className="mb-4 medication-card">
                                    <Card.Body>
                                        <Form.Group className="custom-checkbox">
                                            <Form.Check 
                                                type="checkbox"
                                                id="medicamento-check"
                                                label={
                                                    <>
                                                        <FaPills className="me-2 text-warning" />
                                                        ¿Tomas algún medicamento actualmente?
                                                    </>
                                                }
                                                name="toma_medicamento"
                                                checked={formData.toma_medicamento === '1'}
                                                onChange={(e) => handleChange({
                                                    target: {
                                                        name: 'toma_medicamento',
                                                        value: e.target.checked ? '1' : '0'
                                                    }
                                                })}
                                            />
                                            {formData.toma_medicamento === '1' && (
                                                <>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="Lista de medicamentos (nombre, dosis, frecuencia)"
                                                        name="medicamento_descrip"
                                                        value={formData.medicamento_descrip}
                                                        onChange={handleChange}
                                                        className="mt-3 form-control-custom"
                                                        required
                                                    />
                                                    <Form.Text className="text-muted">
                                                        Ej: Metformina 500mg, 1 tableta cada 12 horas
                                                    </Form.Text>
                                                </>
                                            )}
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                                
                                <Card className="mb-4 calories-card">
                                    <Card.Body>
                                        <Form.Group className="custom-checkbox">
                                            <Form.Check 
                                                type="checkbox"
                                                id="calorias-check"
                                                label={
                                                    <>
                                                        <FaFireAlt className="me-2 text-danger" />
                                                        ¿Llevas un control de tu consumo calórico?
                                                    </>
                                                }
                                                name="consumo_calorias"
                                                checked={formData.consumo_calorias === '1'}
                                                onChange={(e) => handleChange({
                                                    target: {
                                                        name: 'consumo_calorias',
                                                        value: e.target.checked ? '1' : '0'
                                                    }
                                                })}
                                            />
                                            {formData.consumo_calorias === '1' && (
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Describe cómo llevas el control (app, diario, etc.)"
                                                    name="calorias_descrip"
                                                    value={formData.calorias_descrip}
                                                    onChange={handleChange}
                                                    className="mt-3 form-control-custom"
                                                />
                                            )}
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </div>
                        )}
                        
                        {/* Paso 3: Alergias */}
                        {step === 3 && (
                            <div className="animate-fade-in">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="step-icon bg-danger text-white">
                                        <FaAllergies size={20} />
                                    </div>
                                    <h4 className="mb-0 ms-3">Alergias e Intolerancias</h4>
                                </div>
                                
                                <Alert variant="info" className="d-flex align-items-center">
                                    <FaExclamationTriangle className="me-2 flex-shrink-0" />
                                    <div>
                                        Esta información es crucial para evitar recomendaciones de alimentos que puedan afectar tu salud.
                                    </div>
                                </Alert>
                                
                                <Card className="mt-4 allergies-card">
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label className="fw-bold d-flex align-items-center">
                                                <FaAllergies className="me-2 text-danger" />
                                                Alergias o intolerancias alimentarias
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                placeholder="Ej: Alergia a los mariscos, intolerancia a la lactosa, alergia a frutos secos, etc."
                                                name="alergias"
                                                value={formData.alergias}
                                                onChange={handleChange}
                                                className="form-control-custom"
                                            />
                                            <Form.Text className="text-muted">
                                                Si no tienes ninguna, escribe "Ninguna"
                                            </Form.Text>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </div>
                        )}
                        
                        {/* Paso 4: Metas */}
                        {step === 4 && (
                            <div className="animate-fade-in">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="step-icon bg-success text-white">
                                        <FaBullseye size={20} />
                                    </div>
                                    <h4 className="mb-0 ms-3">Tus Metas Nutricionales</h4>
                                </div>
                                
                                <Card className="goals-card">
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label className="fw-bold d-flex align-items-center mb-3">
                                                <FaHeartbeat className="me-2 text-success" />
                                                ¿Cuáles son tus principales objetivos con la nutrición?
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                placeholder="Ej: Perder peso, ganar masa muscular, mejorar mi energía, controlar diabetes, reducir colesterol, mejorar digestión, etc."
                                                name="metas"
                                                value={formData.metas}
                                                onChange={handleChange}
                                                className="form-control-custom"
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                                Sé lo más específico posible para que podamos ayudarte mejor
                                            </Form.Text>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                                
                                <Alert variant="success" className="mt-4 d-flex align-items-center">
                                    <FaCheckCircle className="me-2 flex-shrink-0" />
                                    <div>
                                        <h5 className="mb-1">¡Estás a punto de terminar!</h5>
                                        <p className="mb-0">
                                            Revisa que toda la información proporcionada sea correcta antes de enviar.
                                        </p>
                                    </div>
                                </Alert>
                            </div>
                        )}
                        
                        <div className="d-flex justify-content-between mt-5">
                            {step > 1 ? (
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={prevStep}
                                    className="d-flex align-items-center step-button"
                                >
                                    <FaChevronLeft className="me-1" /> Anterior
                                </Button>
                            ) : (
                                <div></div>
                            )}
                            
                            {step < 4 ? (
                                <Button 
                                    variant="primary" 
                                    onClick={nextStep}
                                    className="d-flex align-items-center step-button"
                                >
                                    Siguiente <FaChevronRight className="ms-1" />
                                </Button>
                            ) : (
                                <Button 
                                    variant="success" 
                                    type="submit"
                                    className="d-flex align-items-center submit-button"
                                >
                                    <FaCheckCircle className="me-2" /> Enviar Cuestionario
                                </Button>
                            )}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de Perfil */}
            {renderProfileModal()}

            {/* Navegación principal */}
            <Container fluid className="px-0">
                <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="main-navigation">
                    <Nav.Item>
                        <Nav.Link eventKey="dashboard" className="d-flex align-items-center">
                            <FaChartLine className="me-2" /> Dashboard
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="profile" className="d-flex align-items-center">
                            <FaUser className="me-2" /> Mi Perfil
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="meals" className="d-flex align-items-center">
                            <GiMeal className="me-2" /> Plan de Alimentación
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="progress" className="d-flex align-items-center">
                            <TbProgressCheck className="me-2" /> Mi Progreso
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="history" className="d-flex align-items-center">
                            <FaHistory className="me-2" /> Historial
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="settings" className="d-flex align-items-center">
                            <FaCog className="me-2" /> Configuración
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                {/* Contenido principal basado en la pestaña activa */}
                <Container fluid className="user-dashboard px-3 px-md-4 py-4">
                    {activeTab === 'dashboard' && renderDashboardSection()}
                    {activeTab === 'profile' && renderUserDataSection()}
                    {activeTab === 'meals' && renderMealPlanSection()}
                    {activeTab === 'progress' && (
                        <div className="progress-section">
                            <h3 className="mb-4 d-flex align-items-center">
                                <TbProgressCheck className="me-2 text-primary" size={28} />
                                Mi Progreso
                            </h3>
                            <Alert variant="info">
                                Esta sección mostrará tus gráficos de progreso una que completes el cuestionario de salud.
                            </Alert>
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <div className="history-section">
                            <h3 className="mb-4 d-flex align-items-center">
                                <FaHistory className="me-2 text-secondary" />
                                Historial Nutricional
                            </h3>
                            <Alert variant="info">
                                Aquí podrás ver tu historial completo de comidas, ejercicios y mediciones.
                            </Alert>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div className="settings-section">
                            <h3 className="mb-4 d-flex align-items-center">
                                <FaCog className="me-2 text-warning" />
                                Configuración
                            </h3>
                            <Alert variant="info">
                                Configura tus preferencias y notificaciones en esta sección.
                            </Alert>
                        </div>
                    )}
                </Container>
            </Container>
        </>
    );
};

export default User;