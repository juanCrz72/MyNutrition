import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaUtensils, 
  FaCalendarAlt, 
  FaUser, 
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaExclamationTriangle,
  FaPlus,
  FaTrash,
  FaCoffee,
  FaHamburger,
  FaMoon,
  FaCookie,
  FaWineBottle
} from 'react-icons/fa';
import { getBitacoraComidasjs, deleteBitacoraComidajs } from '../../assets/js/Bitacora.js';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/crud-styles.css';
import PersonaBitacoraCRUD from './PersonaBitacoraCRUD';

export const PacienteBitacora = () => {
  const { idpersona } = useParams();
  const navigate = useNavigate();
  const [bitacoraData, setBitacoraData] = useState([]);
  const [pacienteInfo, setPacienteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedMeals, setExpandedMeals] = useState({
    DESAYUNO: true,
    COMIDA: true,
    CENA: true,
    SNACK: true,
    ADEREZO: true
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);

  const refreshData = async () => {
    try {
      await getBitacoraComidasjs(setBitacoraData, idpersona);
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar la bitácora', 'error');
    }
  };

  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        await getBitacoraComidasjs(setBitacoraData, idpersona);
        
        if (bitacoraData.length > 0) {
          setPacienteInfo({
            nombre: bitacoraData[0].nombreUsuario,
            edad: bitacoraData[0].edad,
            sexo: bitacoraData[0].sexo
          });
        }
        setLoading(false);
      } catch (error) {
        Swal.fire('Error', 'No se pudo cargar la bitácora del paciente', 'error');
        setLoading(false);
      }
    };
    
    fetchBitacora();
  }, [idpersona]);

  const toggleMealSection = (mealType) => {
    setExpandedMeals(prev => ({
      ...prev,
      [mealType]: !prev[mealType]
    }));
  };

  const handleAddMeal = (mealType) => {
    setSelectedMealType(mealType);
    setShowModal(true);
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    Swal.fire({
      title: '¿Eliminar registro?',
      text: `¿Estás seguro de eliminar ${item.Alimento} de ${item.tipo_comida.toLowerCase()}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBitacoraComidajs(item.id, () => {}, refreshData);
      }
    });
  };

  // Calcular los totales nutricionales
  const { filteredData, dailyTotals, mealTypeTotals, dailyGoals } = useMemo(() => {
    const filtered = bitacoraData.filter(item => {
      const itemDate = new Date(item.fecha_registro).toISOString().split('T')[0];
      return itemDate === selectedDate;
    });

    // Obtener metas diarias
    const goals = filtered.length > 0 ? {
      calorias: filtered[0].calorias,
      carbohidratos: filtered[0].dieta_carbohidratos,
      grasas: filtered[0].dieta_grasas,
      proteinas: filtered[0].dieta_proteinas
    } : {
      calorias: 0,
      carbohidratos: 0,
      grasas: 0,
      proteinas: 0
    };

    // Calcular totales por tipo de comida
    const mealTotals = {};
    const daily = {
      calorias: 0,
      carbohidratos: 0,
      grasas: 0,
      proteinas: 0
    };

    filtered.forEach(item => {
      const mealType = item.tipo_comida;
      const contador = parseFloat(item.contador) || 1;
      
      if (!mealTotals[mealType]) {
        mealTotals[mealType] = {
          calorias: 0,
          carbohidratos: 0,
          grasas: 0,
          proteinas: 0
        };
      }

      mealTotals[mealType].calorias += (parseFloat(item.Energia_kcal) || 0) * contador;
      mealTotals[mealType].carbohidratos += (parseFloat(item.Carbohidratos_g) || 0) * contador;
      mealTotals[mealType].grasas += (parseFloat(item.Grasa_g) || 0) * contador;
      mealTotals[mealType].proteinas += (parseFloat(item.Proteina_g) || 0) * contador;

      daily.calorias += (parseFloat(item.Energia_kcal) || 0) * contador;
      daily.carbohidratos += (parseFloat(item.Carbohidratos_g) || 0) * contador;
      daily.grasas += (parseFloat(item.Grasa_g) || 0) * contador;
      daily.proteinas += (parseFloat(item.Proteina_g) || 0) * contador;
    });

    return {
      filteredData: filtered,
      dailyTotals: daily,
      mealTypeTotals: mealTotals,
      dailyGoals: goals
    };
  }, [bitacoraData, selectedDate]);

  const groupByMealType = filteredData.reduce((acc, item) => {
    if (!acc[item.tipo_comida]) {
      acc[item.tipo_comida] = [];
    }
    acc[item.tipo_comida].push(item);
    return acc;
  }, {});

  const mealTypes = ['DESAYUNO', 'COMIDA', 'CENA', 'SNACK', 'ADEREZO'];
  
  // Iconos para cada tipo de comida
  const mealIcons = {
    DESAYUNO: <FaCoffee className="meal-icon" />,
    COMIDA: <FaHamburger className="meal-icon" />,
    CENA: <FaMoon className="meal-icon" />,
    SNACK: <FaCookie className="meal-icon" />,
    ADEREZO: <FaWineBottle className="meal-icon" />
  };

  const calculatePercentage = (current, goal) => {
    if (goal === 0) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const percentages = {
    calorias: calculatePercentage(dailyTotals.calorias, dailyGoals.calorias),
    carbohidratos: calculatePercentage(dailyTotals.carbohidratos, dailyGoals.carbohidratos),
    grasas: calculatePercentage(dailyTotals.grasas, dailyGoals.grasas),
    proteinas: calculatePercentage(dailyTotals.proteinas, dailyGoals.proteinas)
  };

  const exceeded = {
    calorias: dailyTotals.calorias > dailyGoals.calorias,
    carbohidratos: dailyTotals.carbohidratos > dailyGoals.carbohidratos,
    grasas: dailyTotals.grasas > dailyGoals.grasas,
    proteinas: dailyTotals.proteinas > dailyGoals.proteinas
  };

  // Calcular porcentaje por tipo de comida
  const getMealPercentage = (mealType) => {
    if (!mealTypeTotals[mealType] || dailyGoals.calorias === 0) return 0;
    return Math.round((mealTypeTotals[mealType].calorias / dailyGoals.calorias) * 100);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4 px-3 px-md-4 nutri-dashboard" style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <button 
          className="btn btn-outline-primary rounded-pill d-flex align-items-center back-button"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" /> Volver
        </button>
        
        <h2 className="m-0 text-center text-md-start dashboard-title">
          <span className="text-gradient">Bitácora de Comidas</span>
        </h2>
        
        <div className="d-flex align-items-center gap-2">
          <div className="input-group date-picker-container">
            <span className="input-group-text bg-white">
              <FaCalendarAlt className="text-primary" />
            </span>
            <input 
              type="date" 
              className="form-control rounded-end"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Patient Info Card */}
      {pacienteInfo && (
        <div className="card border-0 shadow-sm mb-4 patient-info-card">
          <div className="card-body p-3">
            <div className="d-flex align-items-center gap-3">
              <div className="avatar-circle bg-gradient-primary text-white">
                <FaUser size={18} />
              </div>
              <div>
                <h3 className="mb-1 fw-bold">{pacienteInfo.nombre}</h3>
                <div className="d-flex flex-wrap gap-3">
                  <span className="badge bg-light text-dark">
                    <FaUser className="me-1 text-primary" /> {pacienteInfo.sexo}
                  </span>
                  <span className="badge bg-light text-dark">
                    {pacienteInfo.edad} años
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Circles */}
      <div className="row mb-4 quick-access">
        <div className="col-12">
          <div className="d-flex justify-content-center flex-wrap gap-3">
            {mealTypes.map((mealType, index) => {
              const percentage = getMealPercentage(mealType);
              return (
                <div 
                  key={mealType} 
                  className="meal-circle position-relative"
                  onClick={() => {
                    toggleMealSection(mealType);
                    // Scroll to section if collapsed
                    if (!expandedMeals[mealType]) {
                      document.getElementById(`meal-${mealType}`)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <div className={`circle-icon bg-meal-${index}`}>
                    {mealIcons[mealType]}
                  </div>
                  <span className="meal-label">{mealType.toLowerCase()}</span>
                  
                  {/* Indicador de porcentaje */}
                  <div className="progress-circle position-absolute">
                    <svg className="progress-ring" width="70" height="70">
                      <circle
                        className="progress-ring-circle"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${percentage}, 100`}
                        r="30"
                        cx="35"
                        cy="35"
                      />
                    </svg>
                    <span className="progress-text">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meals Sections */}
      <div className="mb-5">
        {mealTypes.map(mealType => (
          <div key={mealType} id={`meal-${mealType}`} className="card mb-3 border-0 shadow-sm meal-section">
            <div 
              className="card-header bg-white d-flex justify-content-between align-items-center cursor-pointer meal-header"
              onClick={() => toggleMealSection(mealType)}
              style={{ borderBottom: expandedMeals[mealType] ? '1px solid rgba(0,0,0,0.1)' : 'none' }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="meal-type-icon">
                  {mealIcons[mealType]}
                </div>
                <h4 className="mb-0 fw-bold text-capitalize">
                  {mealType.toLowerCase()}
                </h4>
                {mealTypeTotals[mealType] && (
                  <div className="d-flex gap-2 meal-totals">
                    <small className="text-muted">
                      {mealTypeTotals[mealType].calorias.toFixed(0)} kcal
                    </small>
                    <small className="text-muted">
                      P: {mealTypeTotals[mealType].proteinas.toFixed(1)}g
                    </small>
                    <small className="text-muted">
                      C: {mealTypeTotals[mealType].carbohidratos.toFixed(1)}g
                    </small>
                    <small className="text-muted">
                      G: {mealTypeTotals[mealType].grasas.toFixed(1)}g
                    </small>
                  </div>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                <button 
                  className="btn btn-sm btn-primary rounded-pill px-3 add-meal-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddMeal(mealType);
                  }}
                >
                  <FaPlus className="me-1" /> Agregar
                </button>
                <div className="text-primary">
                  {expandedMeals[mealType] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
            </div>
            
            {expandedMeals[mealType] && (
              <div className="card-body p-0">
                {groupByMealType[mealType] ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0 meal-table">
                      <thead className="table-light">
                        <tr>
                          <th>Alimento</th>
                          <th>Categoría</th>
                          <th>Nutrientes (Total | Por porción)</th>
                          <th>Porciones</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupByMealType[mealType].map((item, index) => {
                          const contador = item.contador || 1;
                          return (
                            <tr key={index}>
                              <td>
                                <div className="fw-semibold">{item.Alimento}</div>
                                <small className="text-muted">{item.porcion}</small>
                              </td>
                              <td className="text-capitalize">{item.categoriaAlimento.toLowerCase()}</td>
                              <td>
                                <div className="d-flex flex-wrap gap-1 nutrient-badges">
                                  <span className="badge bg-primary-bg text-primary">
                                    {(item.Energia_kcal * contador).toFixed(0)} kcal | {item.Energia_kcal} kcal
                                  </span>
                                  <span className="badge bg-success-bg text-success">
                                    P: {(item.Proteina_g * contador).toFixed(1)}g | {item.Proteina_g}g
                                  </span>
                                  <span className="badge bg-warning-bg text-warning">
                                    C: {(item.Carbohidratos_g * contador).toFixed(1)}g | {item.Carbohidratos_g}g
                                  </span>
                                  <span className="badge bg-danger-bg text-danger">
                                    G: {(item.Grasa_g * contador).toFixed(1)}g | {item.Grasa_g}g
                                  </span>
                                </div>
                              </td>
                              <td>
                                {/* {new Date(item.fecha_registro).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
                                <span className="badge bg-secondary ms-2">
                                  {contador} porción{contador != 1 ? 'es' : ''}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-danger rounded-circle delete-btn"
                                  onClick={() => handleDeleteItem(item)}
                                  title="Eliminar"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted empty-meal">
                    <div className="mb-3">
                      <div className="empty-icon">
                        {mealIcons[mealType]}
                      </div>
                    </div>
                    <h5>No hay registros para {mealType.toLowerCase()}</h5>
                    <p className="mb-3">Agrega alimentos para comenzar a registrar</p>
                    <button 
                      className="btn btn-primary rounded-pill px-4 add-meal-btn"
                      onClick={() => handleAddMeal(mealType)}
                    >
                      <FaPlus className="me-1" /> Agregar alimento
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nutritional Summary */}
      <div className="card border-0 shadow-sm nutrition-summary">
        <div className="card-header bg-white d-flex align-items-center">
          <FaChartBar className="me-2 text-primary" />
          <h5 className="mb-0 fw-bold">Resumen Nutricional del Día</h5>
        </div>
        <div className="card-body">
          {/* Meta diaria */}
          <div className="mb-4 p-3 bg-light rounded daily-goals">
            <h6 className="fw-bold">Meta diaria:</h6>
            <div className="d-flex flex-wrap gap-3">
              <span className="badge bg-primary-bg text-primary">
                {dailyGoals.calorias} kcal
              </span>
              <span className="badge bg-success-bg text-success">
                P: {dailyGoals.proteinas}g
              </span>
              <span className="badge bg-warning-bg text-warning">
                C: {dailyGoals.carbohidratos}g
              </span>
              <span className="badge bg-danger-bg text-danger">
                G: {dailyGoals.grasas}g
              </span>
            </div>
          </div>

          {/* Advertencias si se excedió alguna meta */}
          {Object.values(exceeded).some(val => val) && (
            <div className="alert alert-warning d-flex align-items-center mb-4 warning-alert">
              <FaExclamationTriangle className="me-2" />
              <div>
                Se ha excedido la meta diaria en: 
                {exceeded.calorias && <span className="fw-bold ms-2">Calorías</span>}
                {exceeded.carbohidratos && <span className="fw-bold ms-2">Carbohidratos</span>}
                {exceeded.grasas && <span className="fw-bold ms-2">Grasas</span>}
                {exceeded.proteinas && <span className="fw-bold ms-2">Proteínas</span>}
              </div>
            </div>
          )}

          <div className="row nutrition-cards">
            <div className="col-md-3 mb-3 mb-md-0">
              <div className="nutrition-card bg-primary-bg">
                <h6 className="text-primary">Calorías Totales</h6>
                <h3 className="fw-bold text-primary">
                  {dailyTotals.calorias.toFixed(0)} kcal
                  {exceeded.calorias && <FaExclamationTriangle className="ms-2 text-danger" />}
                </h3>
                <div className="progress mt-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${Math.min(percentages.calorias, 100)}%` }}
                  ></div>
                </div>
                <small className="text-muted">
                  {percentages.calorias}% de la meta diaria
                  {exceeded.calorias && <span className="text-danger ms-2">(+{(dailyTotals.calorias - dailyGoals.calorias).toFixed(0)} kcal)</span>}
                </small>
              </div>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <div className="nutrition-card bg-success-bg">
                <h6 className="text-success">Proteínas</h6>
                <h3 className="fw-bold text-success">
                  {dailyTotals.proteinas.toFixed(1)}g
                  {exceeded.proteinas && <FaExclamationTriangle className="ms-2 text-danger" />}
                </h3>
                <div className="progress mt-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: `${Math.min(percentages.proteinas, 100)}%` }}
                  ></div>
                </div>
                <small className="text-muted">
                  {percentages.proteinas}% de la meta diaria
                  {exceeded.proteinas && <span className="text-danger ms-2">(+{(dailyTotals.proteinas - dailyGoals.proteinas).toFixed(1)}g)</span>}
                </small>
              </div>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <div className="nutrition-card bg-warning-bg">
                <h6 className="text-warning">Carbohidratos</h6>
                <h3 className="fw-bold text-warning">
                  {dailyTotals.carbohidratos.toFixed(1)}g
                  {exceeded.carbohidratos && <FaExclamationTriangle className="ms-2 text-danger" />}
                </h3>
                <div className="progress mt-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-warning" 
                    role="progressbar" 
                    style={{ width: `${Math.min(percentages.carbohidratos, 100)}%` }}
                  ></div>
                </div>
                <small className="text-muted">
                  {percentages.carbohidratos}% de la meta diaria
                  {exceeded.carbohidratos && <span className="text-danger ms-2">(+{(dailyTotals.carbohidratos - dailyGoals.carbohidratos).toFixed(1)}g)</span>}
                </small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="nutrition-card bg-danger-bg">
                <h6 className="text-danger">Grasas</h6>
                <h3 className="fw-bold text-danger">
                  {dailyTotals.grasas.toFixed(1)}g
                  {exceeded.grasas && <FaExclamationTriangle className="ms-2 text-danger" />}
                </h3>
                <div className="progress mt-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-danger" 
                    role="progressbar" 
                    style={{ width: `${Math.min(percentages.grasas, 100)}%` }}
                  ></div>
                </div>
                <small className="text-muted">
                  {percentages.grasas}% de la meta diaria
                  {exceeded.grasas && <span className="text-danger ms-2">(+{(dailyTotals.grasas - dailyGoals.grasas).toFixed(1)}g)</span>}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar alimentos */}
      <PersonaBitacoraCRUD 
        show={showModal}
        onHide={() => setShowModal(false)}
        mealType={selectedMealType}
        selectedDate={selectedDate}
        idUsuario={idpersona}
        refreshData={refreshData}
      />

      {/* CSS Styles */}
      <style jsx>{`
        .nutri-dashboard {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }
        
        .dashboard-title .text-gradient {
          background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 600;
        }
        
        .patient-info-card {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
          border-radius: 12px !important;
        }
        
        .avatar-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .quick-access {
          margin-bottom: 2rem;
        }
        
        .meal-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s;
          width: 90px;
          position: relative;
        }
        
        .meal-circle:hover {
          transform: translateY(-5px);
        }
        
        .circle-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        
        .circle-icon:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        .meal-icon {
          font-size: 1.5rem;
        }
        
        .meal-label {
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: capitalize;
          color: #555;
          position: relative;
          z-index: 1;
        }
        
        .progress-circle {
          top: -5px;
          left: -5px;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
        }
        
        .progress-ring-circle {
          fill: none;
          stroke: rgba(0,0,0,0.1);
          stroke-width: 4;
        }
        
        .progress-text {
          font-size: 0.7rem;
          font-weight: bold;
          color: #555;
        }
        
        .bg-meal-0 { 
          background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
          .progress-ring-circle { stroke: #ff9a9e; }
        }
        .bg-meal-1 { 
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
          .progress-ring-circle { stroke: #a1c4fd; }
        }
        .bg-meal-2 { 
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
          .progress-ring-circle { stroke: #ffecd2; }
        }
        .bg-meal-3 { 
          background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
          .progress-ring-circle { stroke: #84fab0; }
        }
        .bg-meal-4 { 
          background: linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%);
          .progress-ring-circle { stroke: #a6c1ee; }
        }
        
        .meal-section {
          border-radius: 12px !important;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }
        
        .meal-section:hover {
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .meal-header {
          padding: 1rem 1.5rem;
          transition: background-color 0.2s;
        }
        
        .meal-header:hover {
          background-color: #f8f9fa !important;
        }
        
        .meal-type-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0,0,0,0.05);
        }
        
        .meal-totals {
          font-size: 0.85rem;
        }
        
        .add-meal-btn {
          transition: all 0.2s;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        
        .add-meal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .meal-table {
          margin-bottom: 0;
        }
        
        .meal-table th {
          font-weight: 600;
          color: #555;
          background-color: #f8f9fa !important;
          white-space: nowrap;
        }
        
        .meal-table td {
          vertical-align: middle;
        }
        
        .nutrient-badges .badge {
          font-size: 0.75rem;
          padding: 0.35em 0.65em;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .empty-meal {
          padding: 2rem;
        }
        
        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0,0,0,0.05);
          color: #6c757d;
        }
        
        .empty-icon .meal-icon {
          font-size: 2rem;
        }
        
        .delete-btn {
          transition: all 0.2s;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .delete-btn:hover {
          transform: scale(1.1);
          background-color: #dc3545 !important;
          color: white !important;
        }
        
        .nutrition-summary {
          border-radius: 12px !important;
        }
        
        .daily-goals {
          background-color: #f8f9fa !important;
          border-radius: 10px !important;
        }
        
        .warning-alert {
          border-radius: 8px !important;
          border-left: 4px solid #ffc107;
        }
        
        .nutrition-cards .nutrition-card {
          padding: 1.25rem;
          border-radius: 10px;
          height: 100%;
          transition: transform 0.3s ease;
        }
        
        .nutrition-cards .nutrition-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .bg-primary-bg { background-color: rgba(75, 108, 183, 0.1); }
        .bg-success-bg { background-color: rgba(40, 167, 69, 0.1); }
        .bg-warning-bg { background-color: rgba(255, 193, 7, 0.1); }
        .bg-danger-bg { background-color: rgba(220, 53, 69, 0.1); }
        
        .back-button {
          transition: all 0.2s;
        }
        
        .back-button:hover {
          background-color: #4b6cb7 !important;
          color: white !important;
        }
        
        @media (max-width: 768px) {
          .quick-access {
            overflow-x: auto;
            padding-bottom: 1rem;
            justify-content: flex-start;
          }
          
          .meal-circle {
            min-width: 70px;
          }
          
          .nutrition-cards .col-md-3 {
            margin-bottom: 1rem;
          }
          
          .meal-totals {
            display: none;
          }
          
          .meal-table {
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .nutrient-badges {
            display: flex;
            flex-direction: column;
            gap: 0.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PacienteBitacora;