import { useAuth } from './../Superadmin/AuthContext.jsx';
import { FaUtensils, FaChartLine, FaUser, FaSignOutAlt, FaAppleAlt, FaWater, FaFireAlt, FaWeight } from 'react-icons/fa';
import { GiMeal, GiWeightScale } from 'react-icons/gi';
import { MdToday, MdSports, MdOutlineRestaurantMenu } from 'react-icons/md';
import { BiDrink } from 'react-icons/bi';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import './css/Estilos.css'; // Archivo CSS adicional para personalizaciones

const User = () => {
    const { user, logout } = useAuth();
    
    // Datos de ejemplo más completos
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

    return (
        <Container fluid className="user-dashboard px-3 px-md-4 py-4">
            {/* Header con información del usuario */}
            <Row className="dashboard-header align-items-center mb-4">
                <Col md={8}>
                    <h1 className="display-5 fw-bold mb-1">¡Hola, {user?.nombre.split(' ')[0]}!</h1>
                    <p className="lead text-muted mb-0">Bienvenido a tu espacio nutricional personalizado</p>
                </Col>
                <Col md={4} className="d-flex justify-content-md-end align-items-center mt-3 mt-md-0">
                    <div className="d-flex align-items-center">
                        <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                            <FaUser size={20} />
                        </div>
                        <Button variant="outline-danger" onClick={logout} className="d-flex align-items-center">
                            <FaSignOutAlt className="me-1" /> Salir
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Resumen rápido */}
            <Row className="mb-4">
                <Col xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
                    <Card className="h-100 shadow-sm border-0 summary-card calories-card">
                        <Card.Body className="d-flex flex-column">
                            <div className="d-flex align-items-center mb-3">
                                <FaFireAlt size={24} className="text-orange me-2" />
                                <Card.Title className="mb-0">Calorías</Card.Title>
                            </div>
                            <div className="text-center my-2">
                                <h2 className="fw-bold">{nutritionData.calories.consumed}<small className="text-muted fs-6">/{nutritionData.calories.goal} kcal</small></h2>
                            </div>
                            <ProgressBar now={nutritionData.calories.percentage} 
                                         variant={nutritionData.calories.percentage > 90 ? 'danger' : nutritionData.calories.percentage > 70 ? 'warning' : 'success'} 
                                         className="mb-3" 
                                         animated />
                            <div className="mt-auto">
                                <Badge bg={nutritionData.calories.remaining > 0 ? 'info' : 'danger'} className="w-100 py-2">
                                    {nutritionData.calories.remaining > 0 ? 
                                     `${nutritionData.calories.remaining} kcal restantes` : 
                                     'Límite excedido'}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
                    <Card className="h-100 shadow-sm border-0 summary-card water-card">
                        <Card.Body className="d-flex flex-column">
                            <div className="d-flex align-items-center mb-3">
                                <FaWater size={24} className="text-info me-2" />
                                <Card.Title className="mb-0">Agua</Card.Title>
                            </div>
                            <div className="text-center my-2">
                                <h2 className="fw-bold">{nutritionData.water.consumed}<small className="text-muted fs-6">/{nutritionData.water.goal} L</small></h2>
                            </div>
                            <ProgressBar now={nutritionData.water.percentage} 
                                         variant={nutritionData.water.percentage > 80 ? 'info' : 'primary'} 
                                         className="mb-3" 
                                         animated />
                            <div className="mt-auto">
                                <Button variant="outline-info" size="sm" className="w-100">
                                    <BiDrink className="me-1" /> Registrar consumo
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
                    <Card className="h-100 shadow-sm border-0 summary-card weight-card">
                        <Card.Body className="d-flex flex-column">
                            <div className="d-flex align-items-center mb-3">
                                <GiWeightScale size={24} className="text-purple me-2" />
                                <Card.Title className="mb-0">Peso</Card.Title>
                            </div>
                            <div className="text-center my-2">
                                <h2 className="fw-bold">{nutritionData.weight.current}<small className="text-muted fs-6"> kg</small></h2>
                                <small className="text-muted">Meta: {nutritionData.weight.goal} kg</small>
                            </div>
                            <div className={`d-flex align-items-center justify-content-center mb-3 ${nutritionData.weight.trend < 0 ? 'text-success' : 'text-danger'}`}>
                                <FaChartLine className="me-2" />
                                <span>{Math.abs(nutritionData.weight.trend)} kg {nutritionData.weight.trend < 0 ? 'menos' : 'más'} esta semana</span>
                            </div>
                            <div className="mt-auto">
                                <Button variant="outline-primary" size="sm" className="w-100">
                                    <FaWeight className="me-1" /> Registrar peso
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12} md={6} lg={3} className="mb-3 mb-lg-0">
                    <Card className="h-100 shadow-sm border-0 summary-card activity-card">
                        <Card.Body className="d-flex flex-column">
                            <div className="d-flex align-items-center mb-3">
                                <MdSports size={24} className="text-warning me-2" />
                                <Card.Title className="mb-0">Actividad</Card.Title>
                            </div>
                            <div className="text-center my-2">
                                <h2 className="fw-bold">{nutritionData.activity.steps.toLocaleString()}<small className="text-muted fs-6">/{nutritionData.activity.goal.toLocaleString()} pasos</small></h2>
                                <small className="text-muted">{nutritionData.activity.caloriesBurned} kcal quemadas</small>
                            </div>
                            <ProgressBar now={(nutritionData.activity.steps / nutritionData.activity.goal) * 100} 
                                         variant="warning" 
                                         className="mb-3" 
                                         animated />
                            <div className="mt-auto">
                                <Button variant="outline-warning" size="sm" className="w-100">
                                    <MdSports className="me-1" /> Registrar ejercicio
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Comidas y macros */}
            <Row className="mb-4">
                <Col lg={8} className="mb-4 mb-lg-0">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <Card.Title className="d-flex align-items-center mb-4">
                                <MdOutlineRestaurantMenu size={24} className="text-success me-2" />
                                <span>Registro de comidas hoy</span>
                                <Badge bg="success" className="ms-auto">{nutritionData.meals.length} comidas</Badge>
                            </Card.Title>
                            
                            <div className="timeline">
                                {nutritionData.meals.map((meal, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-badge bg-success"></div>
                                        <div className="timeline-panel">
                                            <div className="timeline-heading">
                                                <h5 className="timeline-title d-flex justify-content-between">
                                                    <span><GiMeal className="me-2" />{meal.name}</span>
                                                    <small className="text-muted">{meal.time}</small>
                                                </h5>
                                            </div>
                                            <div className="timeline-body">
                                                <p className="mb-1">{meal.food}</p>
                                                <Badge bg="secondary" pill>{meal.calories} kcal</Badge>
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
                                                <span><GiMeal className="me-2" />{nutritionData.nextMeal.name}</span>
                                                <small className="text-muted">{nutritionData.nextMeal.time}</small>
                                            </h5>
                                        </div>
                                        <div className="timeline-body">
                                            <p className="mb-1">{nutritionData.nextMeal.suggestion}</p>
                                            <Button variant="outline-success" size="sm">
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
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body>
                            <Card.Title className="d-flex align-items-center mb-4">
                                <FaAppleAlt size={24} className="text-danger me-2" />
                                <span>Macronutrientes</span>
                            </Card.Title>
                            
                            <div className="macro-progress mb-4">
                                <h6 className="d-flex justify-content-between mb-2">
                                    <span>Proteínas</span>
                                    <span>{nutritionData.macros.protein.consumed}g / {nutritionData.macros.protein.goal}g</span>
                                </h6>
                                <ProgressBar now={nutritionData.macros.protein.percentage} variant="danger" animated />
                            </div>
                            
                            <div className="macro-progress mb-4">
                                <h6 className="d-flex justify-content-between mb-2">
                                    <span>Carbohidratos</span>
                                    <span>{nutritionData.macros.carbs.consumed}g / {nutritionData.macros.carbs.goal}g</span>
                                </h6>
                                <ProgressBar now={nutritionData.macros.carbs.percentage} variant="success" animated />
                            </div>
                            
                            <div className="macro-progress mb-4">
                                <h6 className="d-flex justify-content-between mb-2">
                                    <span>Grasas</span>
                                    <span>{nutritionData.macros.fats.consumed}g / {nutritionData.macros.fats.goal}g</span>
                                </h6>
                                <ProgressBar now={nutritionData.macros.fats.percentage} variant="warning" animated />
                            </div>
                            
                            <div className="text-center mt-4">
                                <Button variant="primary" className="w-100">
                                    Ver detalles nutricionales
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Acciones rápidas */}
            <Row>
                <Col xs={12}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Card.Title className="mb-4">¿Qué quieres hacer ahora?</Card.Title>
                            <div className="d-flex flex-wrap justify-content-center gap-3">
                                <Button variant="outline-primary" size="lg" className="d-flex align-items-center action-btn">
                                    <FaUtensils className="me-2" /> Registrar comida
                                </Button>
                                <Button variant="outline-info" size="lg" className="d-flex align-items-center action-btn">
                                    <BiDrink className="me-2" /> Registrar agua
                                </Button>
                                <Button variant="outline-secondary" size="lg" className="d-flex align-items-center action-btn">
                                    <GiWeightScale className="me-2" /> Registrar peso
                                </Button>
                                <Button variant="outline-success" size="lg" className="d-flex align-items-center action-btn">
                                    <MdSports className="me-2" /> Registrar ejercicio
                                </Button>
                                <Button variant="outline-warning" size="lg" className="d-flex align-items-center action-btn">
                                    <FaChartLine className="me-2" /> Ver progreso
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Mensaje motivacional */}
            <Row className="mt-4">
                <Col xs={12}>
                    <div className="motivational-message p-4 rounded text-center">
                        <h4 className="mb-3">"Cada pequeño paso cuenta en tu viaje hacia una vida más saludable"</h4>
                        <p className="mb-0">Hoy has completado el {Math.round((nutritionData.calories.consumed / nutritionData.calories.goal) * 100)}% de tu meta diaria. ¡Sigue así!</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default User;