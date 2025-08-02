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
  FaWeightHanging,
  FaFire, 
  FaDumbbell, 
  FaBreadSlice, 
  FaListAlt, 
  FaBalanceScale,
  FaCopy,
  FaPaste
} from 'react-icons/fa';
import { getBitacoraComidasjs, deleteBitacoraComidajs, createBitacoraComidajs } from '../../assets/js/Bitacora.js';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/crud-styles.css';
import PersonaBitacoraCRUD from './PersonaBitacoraCRUD.jsx';
import './css/Bitacora.css';

export const PacienteBitacora = () => {
  const { id_usuario } = useParams();
  const navigate = useNavigate();
  const [bitacoraData, setBitacoraData] = useState([]);
  const [pacienteInfo, setPacienteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedMeals, setExpandedMeals] = useState({
    DESAYUNO: true,
    COMIDA: true,
    CENA: true,
    SNACK: true
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [copiedItems, setCopiedItems] = useState([]); // Almacena los items copiados

  const refreshData = async () => {
    try {
      await getBitacoraComidasjs(setBitacoraData, id_usuario);
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar la bitácora', 'error');
    }
  };

  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        await getBitacoraComidasjs(setBitacoraData, id_usuario);
        
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
  }, [id_usuario]);

  // Función para copiar todos los alimentos del día seleccionado
  const copyDayMeals = () => {
    const itemsToCopy = bitacoraData.filter(item => {
      const itemDate = new Date(item.fecha_registro).toISOString().split('T')[0];
      return itemDate === selectedDate;
    });
    
    if (itemsToCopy.length === 0) {
      Swal.fire('Información', 'No hay alimentos para copiar en este día', 'info');
      return;
    }
    
    setCopiedItems(itemsToCopy);
    Swal.fire('Éxito', `Se han copiado ${itemsToCopy.length} alimentos`, 'success');
  };

  // Función para pegar los alimentos copiados al día siguiente
 const pasteDayMeals = async () => {
  if (copiedItems.length === 0) {
    Swal.fire('Error', 'No hay alimentos copiados para pegar', 'error');
    return;
  }
  
  try {
    // Mostrar confirmación usando la fecha seleccionada
    const result = await Swal.fire({
      title: '¿Pegar alimentos?',
      text: `¿Deseas pegar ${copiedItems.length} alimentos al día ${selectedDate}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, pegar',
      cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
      // Crear promesas para cada alimento a pegar
      const promises = copiedItems.map(item => {
        return createBitacoraComidajs(
          item.id_usuario,
          item.tipo_comida,
          item.id_alimento,
          selectedDate, // Usamos la fecha seleccionada directamente
          item.contador,
          () => {},
          refreshData
        );
      });
      
      // Ejecutar todas las promesas
      await Promise.all(promises);
      
      // Actualizar los datos
      await refreshData();
      
      Swal.fire('Éxito', `Se han pegado ${copiedItems.length} alimentos al día ${selectedDate}`, 'success');
    }
  } catch (error) {
    console.error('Error al pegar alimentos:', error);
    Swal.fire('Error', 'Hubo un problema al pegar los alimentos', 'error');
  }
};

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
      proteinas: 0,
      pesoTotal: 0
    };

    filtered.forEach(item => {
      const mealType = item.tipo_comida;
      const contador = parseFloat(item.contador) || 1;
      const peso = parseFloat(item.peso) || 0;
      
      if (!mealTotals[mealType]) {
        mealTotals[mealType] = {
          calorias: 0,
          carbohidratos: 0,
          grasas: 0,
          proteinas: 0,
          pesoTotal: 0
        };
      }

      mealTotals[mealType].calorias += (parseFloat(item.Energia_kcal) || 0) * contador;
      mealTotals[mealType].carbohidratos += (parseFloat(item.Carbohidratos_g) || 0) * contador;
      mealTotals[mealType].grasas += (parseFloat(item.Grasa_g) || 0) * contador;
      mealTotals[mealType].proteinas += (parseFloat(item.Proteina_g) || 0) * contador;
      mealTotals[mealType].pesoTotal += peso * contador;

      daily.calorias += (parseFloat(item.Energia_kcal) || 0) * contador;
      daily.carbohidratos += (parseFloat(item.Carbohidratos_g) || 0) * contador;
      daily.grasas += (parseFloat(item.Grasa_g) || 0) * contador;
      daily.proteinas += (parseFloat(item.Proteina_g) || 0) * contador;
      daily.pesoTotal += peso * contador;
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

  const mealTypes = ['DESAYUNO', 'COMIDA', 'CENA', 'SNACK'];
  
  // Iconos para cada tipo de comida
  const mealIcons = {
    DESAYUNO: <FaCoffee className="meal-icon" />,
    COMIDA: <FaHamburger className="meal-icon" />,
    CENA: <FaMoon className="meal-icon" />,
    SNACK: <FaCookie className="meal-icon" />
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

  const renderMealItems = (mealType) => {
    if (!groupByMealType[mealType]) {
      return (
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
      );
    }

    return (
      <>
        {/* Versión de escritorio (tabla) */}
        <div className="d-none d-md-block">
          <div className="table-responsive">
            <table className="table table-hover mb-0 meal-table">
              <thead className="table-light">
                <tr>
                  <th>Alimento</th>
                  <th>Categoría</th>
                  <th>Nutrientes (Total | Por porción)</th>
                  <th>Peso (Total | Por porción)</th>
                  <th>Porciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {groupByMealType[mealType].map((item, index) => {
                  const contador = item.contador || 1;
                  const pesoTotal = (parseFloat(item.peso) * contador).toFixed(1);
                  return (
                    <tr key={`desktop-${index}`}>
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
                        <span className="badge bg-info bg-opacity-10 text-info">
                          {pesoTotal}g | {item.peso}g
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
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
        </div>

        {/* Versión móvil - Lista mejorada para pacientes */}
        <div className="d-md-none">
          <div className="list-group meal-list-mobile">
            {groupByMealType[mealType].map((item, index) => {
              const contador = item.contador || 1;
              const pesoTotal = (parseFloat(item.peso) * contador).toFixed(1);
              
              return (
                <div 
                  key={`mobile-${index}`} 
                  className="list-group-item list-group-item-action py-3 meal-list-item"
                >
                  {/* Header con nombre y acción */}
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-1 text-primary">
                        <FaUtensils className="me-2" size={14} />
                        {item.Alimento}
                      </h5>
                      <small className="text-muted d-block">
                        <FaWeightHanging size={12} className="me-1" />
                        {pesoTotal}g ({item.peso}g × {contador} porción{contador !== 1 ? 'es' : ''})
                      </small>
                    </div>
                    <button 
                      className="btn btn-sm btn-link text-danger p-0"
                      onClick={() => handleDeleteItem(item)}
                      title="Eliminar"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>

                  {/* Detalles nutricionales compactos */}
                  <div className="mt-2 d-flex flex-wrap align-items-center">
                    <div className="nutrient-pill me-2 mb-1">
                      <FaFire className="text-danger" />
                      <span>{(item.Energia_kcal * contador).toFixed(0)} kcal</span>
                    </div>
                    
                    <div className="nutrient-pill me-2 mb-1">
                      <FaDumbbell className="text-success" />
                      <span>{(item.Proteina_g * contador).toFixed(1)}g prot.</span>
                    </div>
                    
                    <div className="nutrient-pill me-2 mb-1">
                      <FaBreadSlice className="text-warning" />
                      <span>{(item.Carbohidratos_g * contador).toFixed(1)}g carb.</span>
                    </div>
                  </div>

                  {/* Info adicional (solo visible al hacer tap) */}
                  <div className="mt-2 additional-info">
                    <div className="d-flex justify-content-between small">
                      <span>
                        <FaListAlt className="me-1" />
                        {item.categoriaAlimento}
                      </span>
                      <span>
                        <FaBalanceScale className="me-1" />
                        {item.porcion}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
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
          
          {/* Botones para copiar y pegar */}
          <button 
            className="btn btn-outline-secondary d-flex align-items-center copy-btn"
            onClick={copyDayMeals}
            title="Copiar alimentos de este día"
          >
            <FaCopy className="me-1" /> Copiar
          </button>
          
          <button 
            className="btn btn-outline-primary d-flex align-items-center paste-btn"
            onClick={pasteDayMeals}
            disabled={copiedItems.length === 0}
            title="Pegar alimentos al día siguiente"
          >
            <FaPaste className="me-1" /> Pegar
          </button>
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
                {renderMealItems(mealType)}
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

          <div className="row nutrition-cards2">
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
        idUsuario={id_usuario}
        refreshData={refreshData}
      />
    </div>
  );
};

export default PacienteBitacora;