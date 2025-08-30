import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Superadmin/AuthContext.jsx';
import { 
  FaArrowLeft, FaUtensils, FaCalendarAlt, FaUser, FaChartBar, FaChevronDown, FaChevronUp, 
  FaSearch, FaExclamationTriangle, FaPlus, FaTrash, FaCoffee, FaHamburger, FaMoon, FaCookie, 
  FaWeightHanging, FaFire, FaDumbbell, FaBreadSlice, FaListAlt, FaBalanceScale, FaLeaf, 
  FaChevronLeft, FaChevronRight, FaRandom, FaLightbulb, FaCheck, FaInfoCircle, FaUndo 
} from 'react-icons/fa';
import { getBitacoraComidasjs, deleteBitacoraComidajs, createBitacoraComidajs } from '../../assets/js/Bitacora.js';
import { getAlimentosjs } from '../../assets/js/Alimentos.js';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../Superadmin/css/crud-styles.css';
import PersonaBitacoraCRUD from '../Superadmin/BitacoraCRUD.jsx';
import './../Superadmin/css/BitacoraUser.css';

export const UserBitacora = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bitacoraData, setBitacoraData] = useState([]);
  const [alimentosData, setAlimentosData] = useState([]);
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
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendationsFor, setRecommendationsFor] = useState(null);
  const [similarFoods, setSimilarFoods] = useState([]);
  const [addingFood, setAddingFood] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [similarityThreshold, setSimilarityThreshold] = useState(20);
  const [sortCriteria, setSortCriteria] = useState('similarity');

  // Filtrar alimentos basado en búsqueda y umbral de similitud
const filteredFoods = useMemo(() => {
  let result = similarFoods.filter(food => 
    food.Alimento.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Ordenar según el criterio seleccionado
  switch(sortCriteria) {
    case 'name':
      result.sort((a, b) => a.Alimento.localeCompare(b.Alimento));
      break;
    case 'calories':
      // Ordenar por proximidad a las calorías del alimento original
      const targetCalories = parseFloat(recommendationsFor?.Energia_kcal) || 0;
      result.sort((a, b) => 
        Math.abs(parseFloat(a.Energia_kcal) - targetCalories) - 
        Math.abs(parseFloat(b.Energia_kcal) - targetCalories)
      );
      break;
    case 'protein':
      // Ordenar por proximidad a las proteínas del alimento original
      const targetProtein = parseFloat(recommendationsFor?.Proteina_g) || 0;
      result.sort((a, b) => 
        Math.abs(parseFloat(a.Proteina_g) - targetProtein) - 
        Math.abs(parseFloat(b.Proteina_g) - targetProtein)
      );
      break;
    case 'similarity':
    default:
      // Mantener el orden original (por similitud)
      break;
  }
  
  return result;
}, [similarFoods, searchTerm, sortCriteria, recommendationsFor]);

  // Cargar datos de bitácora y alimentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id_usuario) {
          await getBitacoraComidasjs(setBitacoraData, user.id_usuario);
          await getAlimentosjs(setAlimentosData);
        }
        setLoading(false);
      } catch (error) {
        Swal.fire('Error', 'No se pudo cargar los datos', 'error');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user?.id_usuario]);

  const refreshData = async () => {
    try {
      await getBitacoraComidasjs(setBitacoraData, user?.id_usuario);
    } catch (error) {
      Swal.fire('Error', 'No se pudo actualizar la bitácora', 'error');
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

  // Función para agregar automáticamente un alimento
// Función para agregar automáticamente un alimento
const handleAutoAddFood = async (food, mealType) => {
  setAddingFood(food.id);
  
  try {
    console.log('Enviando datos:', {
      id_usuario: user.id_usuario,
      tipo_comida: mealType,
      id_alimento: food.id,
      fecha_registro: selectedDate,
      contador: 1
    });

    await createBitacoraComidajs(
      user.id_usuario,    // id_usuario
      mealType,          // tipo_comida
      food.id,           // id_alimento
      selectedDate,      // fecha_registro
      1,                 // contador
      () => setShowModal(false),  // setShowModal (aunque no lo usemos aquí)
      refreshData        // refreshData
    );

    Swal.fire({
      icon: 'success',
      title: '¡Alimento agregado!',
      text: `${food.Alimento} se ha añadido a tu ${mealType.toLowerCase()}`,
      timer: 1500,
      showConfirmButton: false
    });
    setShowRecommendations(false);
  } catch (error) {
    Swal.fire('Error', 'No se pudo agregar el alimento', 'error');
    console.error('Detalles del error:', error);
  } finally {
    setAddingFood(null);
  }
};
  // Función para encontrar alimentos similares
  const findSimilarFoods = (currentFood) => {
    if (!currentFood || !alimentosData.length) return [];
    
    const currentCategory = currentFood.categoriaAlimento;
    const currentCalories = parseFloat(currentFood.Energia_kcal) || 0;
    
    // Filtramos alimentos de la misma categoría y con valor nutricional similar
    return alimentosData
      .filter(food => 
        food.Categoria === currentCategory && 
        food.id !== currentFood.id && // Excluir el alimento actual
        food.activo === 1 // Solo alimentos activos
      )
      .map(food => ({
        ...food,
        similarityScore: Math.abs((parseFloat(food.Energia_kcal) || 0) - currentCalories)
      }))
      .sort((a, b) => a.similarityScore - b.similarityScore) // Ordenar por similitud calórica
      .slice(0, 80); // Tomar los 5 más similares
  };

  // Mostrar recomendaciones para un alimento
  const showFoodRecommendations = (foodItem) => {
    const similar = findSimilarFoods(foodItem);
    setSimilarFoods(similar);
    setRecommendationsFor(foodItem);
    setShowRecommendations(true);
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
        <div className="empty-meal-container text-center py-4">
          <div className="empty-meal-icon">
            {mealIcons[mealType]}
          </div>
          <h5 className="empty-meal-title">No hay alimentos registrados</h5>
          <p className="empty-meal-text">Agrega alimentos para comenzar a registrar tu {mealType.toLowerCase()}</p>
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
                        <div className="d-flex align-items-center gap-2">
                          {item.documento_localizacion ? (
                            <img 
                              src={`/${item.documento_localizacion}`} 
                              alt={item.Alimento}
                              className="food-image rounded"
                            />
                          ) : (
                            <div className="food-image-placeholder">
                              <FaLeaf className="placeholder-icon" />
                            </div>
                          )}
                          <div>
                          <div className="fw-semibold">
  {item.Alimento}
</div>

{!item.activo && (
  <div className="alert alert-warning mt-2" role="alert">
    Este alimento no está activo, espera que sea aprobado por tu nutrióloga.
  </div>
)}

                            <small className="text-muted">{item.porcion}</small>
                          </div>
                        </div>
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
             <div className="d-flex gap-1">

                  <button 
                            className="btn btn-sm btn-outline-info rounded-circle"
                            onClick={() => showFoodRecommendations(item)}
                            title="Ver alternativas"
                          >

                          <FaLightbulb size={14} />
                          </button>
                  <button 
                            className="btn btn-sm btn-outline-danger rounded-circle delete-btn"
                            onClick={() => handleDeleteItem(item)}
                            title="Eliminar"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Versión móvil - Lista mejorada */}
   <div className="d-md-none">
  <div className="meal-list-mobile">
    {groupByMealType[mealType].map((item, index) => {
      const contador = item.contador || 1;
      const pesoTotal = (parseFloat(item.peso) * contador).toFixed(1);
      
      return (
        <div 
          key={`mobile-${index}`} 
          className="meal-card compact-card"
        >
          <div className="compact-card-content">
            <div className="compact-image-section">
              {item.documento_localizacion ? (
                <img 
                  src={`/${item.documento_localizacion}`} 
                  alt={item.Alimento}
                  className="compact-meal-image"
                />
              ) : (
                <div className="compact-image-placeholder">
                  <FaLeaf className="compact-placeholder-icon" />
                </div>
              )}
            </div>
            
            <div className="compact-main-content">
              <div className="compact-header">
                <h5 className="compact-meal-name">{item.Alimento}</h5>
                <div className="compact-actions">
                  <button 
                    className="btn btn-outline-info btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => showFoodRecommendations(item)}
                    title="Ver alternativas"
                  >
                    <FaLightbulb size={12} />
                  </button>

                  <button 
                    className="btn btn-outline-danger btn-sm rounded-circle p-1 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => handleDeleteItem(item)}
                    title="Eliminar"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              
                 {!item.activo && (
                <div className="compact-alert mt-1">
                  Este alimento no está activo, espera aprobación de tu nutrióloga.
                </div>
              )}

              <div className="compact-meta-info">
                <span className="compact-category">
                  <FaListAlt size={10} className="me-1" />
                  {item.categoriaAlimento}
                </span>
                <span className="compact-portion">
                  <FaBalanceScale size={10} className="me-1" />
                  {item.porcion}
                </span>
              </div>
              
              <div className="compact-weight-info">
                <FaWeightHanging size={12} className="me-1" />
                {pesoTotal}g ({item.peso}g × {contador} porción{contador !== 1 ? 'es' : ''})
              </div>
              
              <div className="compact-nutrients">
                <div className="compact-nutrient">
                  <FaFire size={12} className="text-danger me-1" />
                  <span>{(item.Energia_kcal * contador).toFixed(0)} kcal</span>
                </div>
                
                <div className="compact-nutrient">
                  <FaDumbbell size={12} className="text-success me-1" />
                  <span>{(item.Proteina_g * contador).toFixed(1)}g prot.</span>
                </div>
                
                <div className="compact-nutrient">
                  <FaBreadSlice size={12} className="text-warning me-1" />
                  <span>{(item.Carbohidratos_g * contador).toFixed(1)}g carb.</span>
                </div>
              </div>
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

  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  return (
    <div className="bitacora-container">
      {/* Header */}
      <div className="bitacora-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" /> Volver
        </button>
        
        <h1 className="bitacora-title">
          <span className="text-gradient">Mi Bitácora Nutricional</span>
        </h1>
      </div>

      {/* Date Navigation */}
      <div className="date-navigation">
        <button className="date-nav-button" onClick={() => changeDate(-1)}>
          <FaChevronLeft />
        </button>
        
        <div className="date-display">
          <FaCalendarAlt className="me-2" />
          <input 
            type="date" 
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        
        <button className="date-nav-button" onClick={() => changeDate(1)}>
          <FaChevronRight />
        </button>
      </div>

      {/* Quick Access Circles */}
      <div className="meal-circles-container">
        {mealTypes.map((mealType, index) => {
          const percentage = getMealPercentage(mealType);
          return (
            <div 
              key={mealType} 
              className="meal-circle"
              onClick={() => {
                toggleMealSection(mealType);
                if (!expandedMeals[mealType]) {
                  document.getElementById(`meal-${mealType}`)?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <div className={`circle-icon ${mealType.toLowerCase()}`}>
                {mealIcons[mealType]}
              </div>
              <span className="meal-label">{mealType.toLowerCase()}</span>
              <div className="progress-circle">
                <svg className="progress-ring" width="70" height="70">
                  <circle
                    className="progress-ring-circle"
                    strokeDasharray={`${percentage}, 100`}
                  />
                </svg>
                <span className="progress-text">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meals Sections */}
      <div className="meals-container">
        {mealTypes.map(mealType => (
          <div key={mealType} id={`meal-${mealType}`} className="meal-section">
            <div 
              className="meal-section-header"
              onClick={() => toggleMealSection(mealType)}
            >
              <div className="meal-header-content">
                <div className="meal-type-icon">
                  {mealIcons[mealType]}
                </div>
                <h3 className="meal-type-title">
                  {mealType.toLowerCase()}
                </h3>
                {mealTypeTotals[mealType] && (
                  <div className="meal-totals">
                    <span className="calories-total">
                      {mealTypeTotals[mealType].calorias.toFixed(0)} kcal
                    </span>
                    <div className="macros-totals">
                      <span>P: {mealTypeTotals[mealType].proteinas.toFixed(1)}g</span>
                      <span>C: {mealTypeTotals[mealType].carbohidratos.toFixed(1)}g</span>
                      <span>G: {mealTypeTotals[mealType].grasas.toFixed(1)}g</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="meal-header-actions">
                <button 
                  className="add-meal-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddMeal(mealType);
                  }}
                >
                  <FaPlus className="me-1" /> Agregar
                </button>
                <div className="toggle-icon">
                  {expandedMeals[mealType] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
            </div>
            
            {expandedMeals[mealType] && (
              <div className="meal-section-content">
                {renderMealItems(mealType)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nutritional Summary */}
      <div className="nutrition-summary">
        <div className="summary-header">
          <FaChartBar className="me-2" />
          <h3>Resumen Nutricional del Día</h3>
        </div>
        
        <div className="summary-content">
          {/* Meta diaria */}
          <div className="daily-goals">
            <h4>Meta diaria:</h4>
            <div className="goals-badges">
              <span className="badge calories">{dailyGoals.calorias} kcal</span>
              <span className="badge protein">P: {dailyGoals.proteinas}g</span>
              <span className="badge carbs">C: {dailyGoals.carbohidratos}g</span>
              <span className="badge fats">G: {dailyGoals.grasas}g</span>
            </div>
          </div>

          {/* Advertencias si se excedió alguna meta */}
          {Object.values(exceeded).some(val => val) && (
            <div className="exceeded-warning">
              <FaExclamationTriangle className="me-2" />
              <div>
                Se ha excedido la meta diaria en: 
                {exceeded.calorias && <span className="exceeded-item">Calorías</span>}
                {exceeded.carbohidratos && <span className="exceeded-item">Carbohidratos</span>}
                {exceeded.grasas && <span className="exceeded-item">Grasas</span>}
                {exceeded.proteinas && <span className="exceeded-item">Proteínas</span>}
              </div>
            </div>
          )}

          <div className="nutrition-cards">
            <div className="nutrition-card calories">
              <h5>Calorías Totales</h5>
              <h2>
                {dailyTotals.calorias.toFixed(0)} kcal
                {exceeded.calorias && <FaExclamationTriangle className="exceeded-icon" />}
              </h2>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${Math.min(percentages.calorias, 100)}%` }}
                ></div>
              </div>
              <small>
                {percentages.calorias}% de la meta diaria
                {exceeded.calorias && <span className="exceeded-amount">(+{(dailyTotals.calorias - dailyGoals.calorias).toFixed(0)} kcal)</span>}
              </small>
            </div>
            
            <div className="nutrition-card protein">
              <h5>Proteínas</h5>
              <h2>
                {dailyTotals.proteinas.toFixed(1)}g
                {exceeded.proteinas && <FaExclamationTriangle className="exceeded-icon" />}
              </h2>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${Math.min(percentages.proteinas, 100)}%` }}
                ></div>
              </div>
              <small>
                {percentages.proteinas}% de la meta diaria
                {exceeded.proteinas && <span className="exceeded-amount">(+{(dailyTotals.proteinas - dailyGoals.proteinas).toFixed(1)}g)</span>}
              </small>
            </div>
            
            <div className="nutrition-card carbs">
              <h5>Carbohidratos</h5>
              <h2>
                {dailyTotals.carbohidratos.toFixed(1)}g
                {exceeded.carbohidratos && <FaExclamationTriangle className="exceeded-icon" />}
              </h2>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${Math.min(percentages.carbohidratos, 100)}%` }}
                ></div>
              </div>
              <small>
                {percentages.carbohidratos}% de la meta diaria
                {exceeded.carbohidratos && <span className="exceeded-amount">(+{(dailyTotals.carbohidratos - dailyGoals.carbohidratos).toFixed(1)}g)</span>}
              </small>
            </div>
            
            <div className="nutrition-card fats">
              <h5>Grasas</h5>
              <h2>
                {dailyTotals.grasas.toFixed(1)}g
                {exceeded.grasas && <FaExclamationTriangle className="exceeded-icon" />}
              </h2>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${Math.min(percentages.grasas, 100)}%` }}
                ></div>
              </div>
              <small>
                {percentages.grasas}% de la meta diaria
                {exceeded.grasas && <span className="exceeded-amount">(+{(dailyTotals.grasas - dailyGoals.grasas).toFixed(1)}g)</span>}
              </small>
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
        idUsuario={user?.id_usuario}
        refreshData={refreshData}
      />

      {/* Modal de recomendaciones */}
{showRecommendations && (
  <div className={`modal fade ${showRecommendations ? 'show d-block' : ''}`} 
    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header secondary text-white">
          <h5 className="modal-title">
            <FaLightbulb className="me-2" />
            Alternativas para {recommendationsFor?.Alimento}
          </h5>
          <button 
            type="button" 
            className="btn-close btn-close-white"
            onClick={() => setShowRecommendations(false)}
          ></button>
        </div>
        
        <div className="modal-body p-3">
          <div className="alert alert-info mb-3">
            <FaInfoCircle className="me-2" />
            <small>Encontraste {similarFoods.length} alimentos en la categoría {recommendationsFor?.categoriaAlimento}. 
            Usa los filtros para encontrar alternativas similares.</small>
          </div>
          
          {/* Filtros de similitud y búsqueda */}
          <div className="recommendation-filters mb-3">
            <div className="row g-2 align-items-end">
              <div className="col-md-7">
                <label className="form-label small mb-1">Buscar por nombre</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text">
                    <FaSearch size={12} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escribe el nombre del alimento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <label className="form-label small mb-1">Ordenar por</label>
                <select 
                  className="form-select form-select-sm"
                  value={sortCriteria}
                  onChange={(e) => setSortCriteria(e.target.value)}
                >
                  <option value="similarity">Similitud (mayor primero)</option>
                  <option value="calories">Calorías (más similares)</option>
                  <option value="name">Nombre (A-Z)</option>
                  <option value="protein">Proteína (más similares)</option>
                </select>
              </div>
            </div>
          </div>
          
          {similarFoods.length > 0 ? (
            <>
              {/* Contador de resultados */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">
                  Mostrando {filteredFoods.length} de {similarFoods.length} alimentos
                </span>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setSortCriteria('similarity');
                  }}
                >
                  <FaUndo className="me-1" /> Reiniciar
                </button>
              </div>
              
              {/* Lista de alimentos - Versión desktop (tabla) */}
              <div className="d-none d-md-block">
                <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="table table-hover table-sm">
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                      <tr>
                        <th>Alimentoss</th>
                        <th>Porción</th>
                        <th>Nutrientes</th>
                        <th>Similitud</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFoods.map((food, index) => (
                        <tr key={`rec-${index}`}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {food.documento_localizacion ? (
                                <img 
                                  src={`/${food.documento_localizacion}`} 
                                  alt={food.Alimento}
                                  className="food-image rounded"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div className="food-image-placeholder small">
                                  <FaLeaf className="placeholder-icon" />
                                </div>
                              )}
                              <span>{food.Alimento}</span>
                            </div>
                          </td>
                          <td>
                            <small>{food.Cantidad_Sugerida} {food.Unidad}</small>
                          </td>
                          <td>
                            <div className="nutrient-badges">
                              <span className="badge bg-primary bg-opacity-10 text-primary me-1 mb-1">
                                {food.Energia_kcal}kcal
                              </span>
                              <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">
                                P:{food.Proteina_g}g
                              </span>
                              <span className="badge bg-warning bg-opacity-10 text-warning me-1 mb-1">
                                C:{food.Carbohidratos_g}g
                              </span>
                              <span className="badge bg-danger bg-opacity-10 text-danger me-1 mb-1">
                                G:{food.Grasa_g}g
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="similarity-indicator">
                              <div className="progress" style={{ height: '8px', width: '60px' }}>
                                <div 
                                  className="progress-bar" 
                                  style={{ width: `${Math.max(10, 100 - food.similarityScore)}%` }}
                                ></div>
                              </div>
                              <small className="text-muted">{Math.round(100 - food.similarityScore)}%</small>
                            </div>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleAutoAddFood(food, recommendationsFor.tipo_comida)}
                              disabled={addingFood === food.id}
                            >
                              {addingFood === food.id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                  Agregar
                                </>
                              ) : (
                                <>
                                  <FaPlus className="me-1" /> Agregar
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Lista de alimentos - Versión móvil (tarjetas) */}
              <div className="d-md-none">
                <div className="recommendation-cards-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {filteredFoods.map((food, index) => (
                    <div key={`mobile-rec-${index}`} className="card recommendation-card mb-2">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center">
                            {food.documento_localizacion ? (
                              <img 
                                src={`/${food.documento_localizacion}`} 
                                alt={food.Alimento}
                                className="food-image rounded me-2"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="food-image-placeholder small me-2">
                                <FaLeaf className="placeholder-icon" />
                              </div>
                            )}
                            <div>
                              <h6 className="card-title mb-0">{food.Alimento}</h6>
                              <small className="text-muted">{food.Cantidad_Sugerida} {food.Unidad}</small>
                            </div>
                          </div>
                          <div className="similarity-indicator text-end">
                            <div className="progress mx-auto mb-1" style={{ height: '6px', width: '40px' }}>
                              <div 
                                className="progress-bar" 
                                style={{ width: `${Math.max(10, 100 - food.similarityScore)}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">{Math.round(100 - food.similarityScore)}% similitud</small>
                          </div>
                        </div>
                        
                        <div className="nutrient-badges mb-3">
                          <span className="badge bg-primary bg-opacity-10 text-primary me-1 mb-1">
                            {food.Energia_kcal}kcal
                          </span>
                          <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">
                            P:{food.Proteina_g}g
                          </span>
                          <span className="badge bg-warning bg-opacity-10 text-warning me-1 mb-1">
                            C:{food.Carbohidratos_g}g
                          </span>
                          <span className="badge bg-danger bg-opacity-10 text-danger me-1 mb-1">
                            G:{food.Grasa_g}g
                          </span>
                        </div>
                        
                        <button 
                          className="btn btn-sm btn-primary w-100"
                          onClick={() => handleAutoAddFood(food, recommendationsFor.tipo_comida)}
                          disabled={addingFood === food.id}
                        >
                          {addingFood === food.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                              Agregando...
                            </>
                          ) : (
                            <>
                              <FaPlus className="me-1" /> Agregar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <FaRandom className="display-4 text-muted mb-2" style={{ fontSize: '3rem' }}/>
              <h5 className="h6">No encontramos alternativas</h5>
              <p className="text-muted small">
                No hay otros alimentos registrados en la categoría {recommendationsFor?.categoriaAlimento}
              </p>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setShowRecommendations(false)}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserBitacora;