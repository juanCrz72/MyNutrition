import { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Tab, Tabs, Badge, Row, Col } from 'react-bootstrap';
import { FaSearch, FaUtensils, FaHistory, FaStar, FaInfoCircle, FaImage, FaHamburger, FaAppleAlt, FaDrumstickBite, FaEgg, FaBreadSlice, FaFilter, FaPlus } from 'react-icons/fa';
import { GiFruitBowl, GiMeal, GiChickenOven, GiSodaCan } from 'react-icons/gi';
import { createBitacoraComidajs, getBitacoraComidasjs } from '../../assets/js/Bitacora.js';
import { getAlimentos, createAlimento } from '../../api/Alimentos.api.js';
import { getBitacoraComidas } from '../../api/Bitacora.api.js';
import { obtenerTodasLasImagenesAlimentos } from '../../api/DocumentosAlimentos.api.js';
import { getPaises } from '../../api/Paises.api.js';
import Swal from 'sweetalert2';
import './css/AlimentosCRUD.css';

const PersonaBitacoraCRUD = ({  
  show, 
  onHide, 
  mealType, 
  selectedDate, 
  idUsuario, 
  refreshData 
}) => {
  const [alimentos, setAlimentos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [selectedPais, setSelectedPais] = useState('');
  const [mostUsedAlimentos, setMostUsedAlimentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlimento, setSelectedAlimento] = useState(null);
  const [contador, setContador] = useState(1);
  const [gramaje, setGramaje] = useState(100);
  const [inputMode, setInputMode] = useState('porciones');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [imagenesMap, setImagenesMap] = useState({});
  
  // Estados para el modal de agregar alimento
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [newAlimentoData, setNewAlimentoData] = useState({
    Categoria: '',
    Alimento: '',
    Cantidad_Sugerida: '',
    Unidad: '',
    Peso_Bruto_g: '',
    Peso_Neto_g: '',
    Energia_kcal: '',
    Proteina_g: '',
    Grasa_g: '',
    Carbohidratos_g: '',
    Azucar_g: '',
    Fibra_g: '',
    idPais: [],
    activo: 0 // Por defecto inactivo
  });
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [paisesForModal, setPaisesForModal] = useState([]);

  // Función para normalizar los paises_ids a un array de strings
  const normalizePaisesIds = (paisesIds) => {
    if (!paisesIds || paisesIds === 'N/A') return [];
    
    // Si es un array, convertimos cada elemento a string
    if (Array.isArray(paisesIds)) {
      return paisesIds.map(id => id.toString());
    }
    
    // Si es un string que parece array JSON, lo parseamos
    if (typeof paisesIds === 'string' && paisesIds.startsWith('[') && paisesIds.endsWith(']')) {
      try {
        const parsed = JSON.parse(paisesIds);
        return Array.isArray(parsed) ? parsed.map(id => id.toString()) : [parsed.toString()];
      } catch (e) {
        console.error('Error parsing paises_ids JSON:', e);
        return [];
      }
    }
    
    // Si es un string con comas, lo separamos
    if (typeof paisesIds === 'string' && paisesIds.includes(',')) {
      return paisesIds.split(',').map(id => id.trim().toString());
    }
    
    // Si es un solo número o string, lo convertimos a array
    return [paisesIds.toString()];
  };

  const formatDate = (date) => {
    try {
      const d = date instanceof Date ? date : new Date(date);
      return isNaN(d.getTime()) ? 'Fecha no disponible' : d.toLocaleDateString();
    } catch {
      return 'Fecha no disponible';
    }
  };

  const handleImageError = (id) => {
    setImagenesMap(prev => ({
      ...prev,
      [id]: null
    }));
  };

  const getCategoryIcon = (category) => {
    if (!category) return <FaUtensils size={24} />;
    
    switch(category.toLowerCase()) {
      case 'frutas':
        return <GiFruitBowl size={24} />;
      case 'verduras':
        return <FaAppleAlt size={24} />;
      case 'carnes':
        return <FaDrumstickBite size={24} />;
      case 'lácteos':
      case 'lacteos':
        return <FaEgg size={24} />;
      case 'comida rápida':
      case 'comida rapida':
        return <FaHamburger size={24} />;
      case 'comidas preparadas':
        return <GiMeal size={24} />;
      case 'aves':
        return <GiChickenOven size={24} />;
      case 'panes y cereales':
      case 'pan':
        return <FaBreadSlice size={24} />;
      case 'bebidas':
        return <GiSodaCan size={24} />;
      default:
        return <FaUtensils size={24} />;
    }
  };

  useEffect(() => {
    if (show) {
      setLoading(true);
      setError(null);
      fetchData();
    }
  }, [show]);

  const fetchData = async () => {
    try {
      const [alimentosData, imagenesData, paisesData] = await Promise.all([
        getAlimentos(),
        obtenerTodasLasImagenesAlimentos(),
        getPaises()
      ]);

      // Filtrar alimentos activos y normalizar paises_ids
      const mappedAlimentos = alimentosData
        .filter(item => item.activo === 1)
        .map(item => {
          const paisesIdsNormalized = normalizePaisesIds(item.paises_ids);
          
          return {
            id: item.id,
            nombre: item.Alimento,
            Unidad: item.Unidad || 'N/A',
            porcion: item.Cantidad_Sugerida || 'N/A',
            porcionGramos: parseFloat(item.Peso_Neto_g) || 100,
            energia_kcal: parseFloat(item.Energia_kcal) || 0,
            proteina_g: parseFloat(item.Proteina_g) || 0,
            carbohidratos_g: parseFloat(item.Carbohidratos_g) || 0,
            grasa_g: parseFloat(item.Grasa_g) || 0,
            categoria: item.Categoria,
            fibra_g: parseFloat(item.Fibra_g) || 0,
            azucar_g: parseFloat(item.Azucar_g) || 0,
            sodio_mg: parseFloat(item.Sodio_mg) || 0, 
            paises_nombres: item.paises_nombres || 'N/A', 
            activo: item.activo, 
            paises_ids: paisesIdsNormalized,
            paises_ids_original: item.paises_ids // Mantener original para debug
          };
        });

      const mappedPaises = paisesData
        .filter(pais => pais.activo === 1)
        .map(pais => ({
          id: pais.idPais.toString(), // Convertir a string para comparar
          nombre: pais.nombre_pais
        }));

      const imagenesMap = {};
      imagenesData.forEach(img => {
        if (!imagenesMap[img.idAlimento]) {
          imagenesMap[img.idAlimento] = img.localizacion;
        }
      });

      setAlimentos(mappedAlimentos);
      setPaises(mappedPaises);
      setImagenesMap(imagenesMap);
      await fetchMostUsedAlimentos();
    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchMostUsedAlimentos = async () => {
    try {
      const bitacoraData = await getBitacoraComidas(idUsuario);
      const alimentoCount = {};
      
      bitacoraData.forEach(entry => {
        if (entry.idAlimento in alimentoCount) {
          alimentoCount[entry.idAlimento]++;
        } else {
          alimentoCount[entry.idAlimento] = 1;
        }
      });
      
      const sorted = Object.entries(alimentoCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({ id: parseInt(id), count }));
      
      setMostUsedAlimentos(sorted);
    } catch (error) {
      console.error('Error al obtener alimentos más usados:', error);
    }
  };

  const calculateNutrition = (value) => {
    if (!selectedAlimento) return 0;
    
    let factor;
    if (inputMode === 'porciones') {
      factor = contador;
    } else {
      factor = gramaje / selectedAlimento.porcionGramos;
    }
    
    return (parseFloat(value) * factor).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAlimento) {
      Swal.fire('Error', 'Debes seleccionar un alimento', 'error');
      return;
    }
    
    try {
      let porcionesARegistrar;
      if (inputMode === 'porciones') {
        porcionesARegistrar = contador;
      } else {
        porcionesARegistrar = gramaje / selectedAlimento.porcionGramos;
      }
      
      await createBitacoraComidajs(
        idUsuario,
        mealType,
        selectedAlimento.id,
        selectedDate,
        porcionesARegistrar,
        onHide,
        refreshData
      );
    } catch (error) {
      Swal.fire('Error', 'No se pudo agregar el alimento a la bitácora', 'error');
    }
  };

  // Función para cargar países (para el modal de agregar alimento)
  const cargarPaisesParaModal = async () => {
    setLoadingPaises(true);
    try {
      const response = await getPaises();
      
      let paisesData = [];
      
      if (Array.isArray(response)) {
        paisesData = response;
      } else if (response?.data) {
        if (Array.isArray(response.data)) {
          paisesData = response.data;
        } else if (response.data.paises) {
          paisesData = response.data.paises;
        }
      }
      
      if (!Array.isArray(paisesData)) {
        console.error("Formato de países no reconocido");
        paisesData = [];
      }
      
      // Filtrar solo países activos
      const paisesActivos = paisesData.filter(pais => pais.activo === 1);
      setPaisesForModal(paisesActivos);
    } catch (error) {
      console.error("Error al cargar países:", error);
      setPaisesForModal([]);
    } finally {
      setLoadingPaises(false);
    }
  };

  // Función para manejar el envío del nuevo alimento
  const handleAddNewFood = async () => {
    try {
      // Validar campos obligatorios
      if (!newAlimentoData.Alimento || !newAlimentoData.Categoria) {
        Swal.fire('Error', 'El nombre y la categoría del alimento son obligatorios', 'error');
        return;
      }
      
      // Preparar los datos para enviar
      const alimentoToCreate = {
        ...newAlimentoData,
        idPais: newAlimentoData.idPais.join(',') // Convertir array a string separado por comas
      };
      
      // Crear el alimento
      const nuevoAlimento = await createAlimento(alimentoToCreate);
      
      // Insertar en la bitácora si se creó correctamente
      if (nuevoAlimento && nuevoAlimento.id) {
        await createBitacoraComidajs(
          idUsuario,
          mealType,
          nuevoAlimento.id,
          selectedDate,
          1, // Por defecto 1 porción
          () => {}, // No cerrar el modal principal
          refreshData
        );
      }
      
      Swal.fire('¡Éxito!', 'El alimento ha sido agregado y registrado en tu bitácora. Estará disponible para todos una vez sea aprobado.', 'success');
      setShowAddFoodModal(false);
      
      // Limpiar el formulario
      setNewAlimentoData({
        Categoria: '',
        Alimento: '',
        Cantidad_Sugerida: '',
        Unidad: '',
        Peso_Bruto_g: '',
        Peso_Neto_g: '',
        Energia_kcal: '',
        Proteina_g: '',
        Grasa_g: '',
        Carbohidratos_g: '',
        Azucar_g: '',
        Fibra_g: '',
        idPais: [],
        activo: 0
      });
      
      // Actualizar la lista de alimentos
      fetchData();
    } catch (error) {
      console.error('Error al crear alimento:', error);
      Swal.fire('Error', 'No se pudo agregar el alimento. Inténtalo de nuevo.', 'error');
    }
  };

  // Filtrar alimentos por término de búsqueda y país seleccionado
  const filteredAlimentos = alimentos.filter(alimento => {
    const matchesSearch = alimento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Si no hay país seleccionado, mostrar todos
    if (selectedPais === '') return matchesSearch;
    
    // Si hay país seleccionado, verificar si el alimento pertenece a ese país
    const matchesPais = alimento.paises_ids.includes(selectedPais);
    return matchesSearch && matchesPais;
  });

  const getAlimentosByTab = () => {
    const alimentosToFilter = filteredAlimentos;
    
    switch (activeTab) {
      case 'mostUsed':
        return alimentosToFilter.filter(alimento => 
          mostUsedAlimentos.some(mu => mu.id === alimento.id)
        ).slice(0, 5);
      case 'recent':
        return [...alimentosToFilter].reverse().slice(0, 5);
      default:
        return alimentosToFilter.slice(0, 10);
    }
  };

  const renderNutritionLabel = () => {
    if (!selectedAlimento) return null;
    
    const totalCalories = calculateNutrition(selectedAlimento.energia_kcal);
    const caloriesFromFat = (calculateNutrition(selectedAlimento.grasa_g) * 9).toFixed(0);
    
    return (
      <div className="nutrition-card">
        <div className="nutrition-header">
          <div className="nutrition-title">
            <h4>Información Nutricional</h4>
            <div className="nutrition-subtitle">
              {inputMode === 'porciones' ? (
                <span>{contador} {selectedAlimento.Unidad} ({calculateNutrition(selectedAlimento.porcionGramos)}g)</span>
              ) : (
                <span>{gramaje}g ({(gramaje / selectedAlimento.porcionGramos).toFixed(2)} porciones)</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="nutrition-main-fact">
          <div className="calories-circle">
            <div className="calories-value">{totalCalories}</div>
            <div className="calories-label">kcal</div>
          </div>
          <div className="calories-detail">
            <span>Calorías de grasa: {caloriesFromFat}</span>
          </div>
        </div>
        
        <div className="nutrition-macros">
          <div className="macro-item">
            <div className="macro-bar protein" style={{ width: `${Math.min(100, selectedAlimento.proteina_g * 10)}%` }}></div>
            <div className="macro-info">
              <span className="macro-name">Proteína</span>
              <span className="macro-value">{calculateNutrition(selectedAlimento.proteina_g)}g</span>
            </div>
          </div>
          
          <div className="macro-item">
            <div className="macro-bar carbs" style={{ width: `${Math.min(100, selectedAlimento.carbohidratos_g * 5)}%` }}></div>
            <div className="macro-info">
              <span className="macro-name">Carbohidratos</span>
              <span className="macro-value">{calculateNutrition(selectedAlimento.carbohidratos_g)}g</span>
              <div className="macro-subitems">
                <span>• Azúcares: {calculateNutrition(selectedAlimento.azucar_g)}g</span>
                <span>• Fibra: {calculateNutrition(selectedAlimento.fibra_g)}g</span>
              </div>
            </div>
          </div>
          
          <div className="macro-item">
            <div className="macro-bar fat" style={{ width: `${Math.min(100, selectedAlimento.grasa_g * 10)}%` }}></div>
            <div className="macro-info">
              <span className="macro-name">Grasa</span>
              <span className="macro-value">{calculateNutrition(selectedAlimento.grasa_g)}g</span>
            </div>
          </div>
          
          <div className="macro-item">
            <div className="macro-bar sodium" style={{ width: `${Math.min(100, selectedAlimento.sodio_mg / 20)}%` }}></div>
            <div className="macro-info">
              <span className="macro-name">Sodio</span>
              <span className="macro-value">{calculateNutrition(selectedAlimento.sodio_mg)}mg</span>
            </div>
          </div>
        </div>
        
        <div className="nutrition-footer">
          <small>Valores diarios basados en una dieta de 2,000 kcal</small>
        </div>
      </div>
    );
  };

  const renderAlimentoCard = (alimento) => (
    <div 
      key={alimento.id}
      className={`alimento-card ${selectedAlimento?.id === alimento.id ? 'selected' : ''}`}
      onClick={() => setSelectedAlimento(alimento)}
    >
      <div className="alimento-card-image-container">
        {imagenesMap[alimento.id] ? (
          <img 
            src={`/${imagenesMap[alimento.id]}`}
            alt={alimento.nombre}
            className="alimento-card-image"
            onError={() => handleImageError(alimento.id)}
          />
        ) : (
          <div className="generic-food-icon">
            {getCategoryIcon(alimento.categoria)}
            <FaImage className="image-placeholder-icon" />
          </div>
        )}
      </div>
      <div className="alimento-card-header">
        <h5 className="alimento-name">{alimento.nombre}</h5>
        <Badge bg="light" text="dark" className="alimento-category">
          {alimento.categoria} 
          {alimento.paises_ids.length > 0 && (
            <small className="ms-1">({alimento.paises_ids.join(', ')})</small>
          )}
        </Badge>
      </div>
      <div className="alimento-portion">
        {alimento.porcion} {alimento.Unidad} ({alimento.porcionGramos}g)
      </div>
      <div className="alimento-macros">
        <div className="macro-item">
          <span className="macro-value">{alimento.energia_kcal}</span>
          <span className="macro-label">kcal</span>
        </div>
        <div className="macro-item">
          <span className="macro-value">{alimento.proteina_g}</span>
          <span className="macro-label">Proteína</span>
        </div>
        <div className="macro-item">
          <span className="macro-value">{alimento.carbohidratos_g}</span>
          <span className="macro-label">Carbs</span>
        </div>
      </div>
    </div>
  );

  const renderSelectedAlimentoImage = () => (
    <div className="selected-alimento-image-container">
      {imagenesMap[selectedAlimento.id] ? (
        <img 
          src={`/${imagenesMap[selectedAlimento.id]}`}
          alt={selectedAlimento.nombre}
          className="selected-alimento-image"
          onError={() => handleImageError(selectedAlimento.id)}
        />
      ) : (
        <div className="generic-food-icon large">
          {getCategoryIcon(selectedAlimento.categoria)}
          <span>{selectedAlimento.nombre}</span>
        </div>
      )}
    </div>
  );

  // Campos del formulario para agregar alimento
  const formFields = [
    {
      label: "Categoría",
      name: "Categoria",
      value: newAlimentoData.Categoria,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Categoria: value})),
      type: "text",
      placeholder: "Ej: FRUTAS",
      col: 6
    },
    {
      label: "Alimento*",
      name: "Alimento",
      value: newAlimentoData.Alimento,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Alimento: value})),
      type: "text",
      placeholder: "Ej: MANZANA",
      col: 6
    },
    {
      label: "Cantidad Sugerida",
      name: "Cantidad_Sugerida",
      value: newAlimentoData.Cantidad_Sugerida,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Cantidad_Sugerida: value})),
      type: "number",
      placeholder: "Ej: 1",
      col: 4
    },
    {
      label: "Unidad",
      name: "Unidad",
      value: newAlimentoData.Unidad,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Unidad: value})),
      type: "text",
      placeholder: "Ej: PIEZA",
      col: 4
    },
    {
      label: "Peso Bruto (g)",
      name: "Peso_Bruto_g",
      value: newAlimentoData.Peso_Bruto_g,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Peso_Bruto_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 150.5",
      col: 4
    },
    {
      label: "Peso Neto (g)",
      name: "Peso_Neto_g",
      value: newAlimentoData.Peso_Neto_g,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Peso_Neto_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 120.3",
      col: 4
    },
    {
      label: "Energía (kcal)",
      name: "Energia_kcal",
      value: newAlimentoData.Energia_kcal,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Energia_kcal: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 52.3",
      col: 4
    },
    {
      label: "Proteína (g)",
      name: "Proteina_g",
      value: newAlimentoData.Proteina_g,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Proteina_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 0.3",
      col: 4
    },
    {
      label: "Grasa (g)",
      name: "Grasa_g",
      value: newAlimentoData.Grasa_g,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Grasa_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 0.2",
      col: 4
    },
    {
      label: "Carbohidratos (g)",
      name: "Carbohidratos_g",
      value: newAlimentoData.Carbohidratos_g,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Carbohidratos_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 14",
      col: 4
    },
    {
      label: "Azúcar (g)",
      name: "Azucar_g",
      value: newAlimentoData.Azucar_g,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Azucar_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 10",
      col: 4
    },
    {
      label: "Fibra (g)",
      name: "Fibra_g",
      value: newAlimentoData.Fibra_g,
      setter: (value) => setNewAlimentoData(prev => ({...prev, Fibra_g: value})),
      type: "number",
      step: "0.01",
      placeholder: "Ej: 2.4",
      col: 4
    }
  ];

  const handlePaisChange = (paisId) => {
    setNewAlimentoData(prev => {
      const newPaises = prev.idPais.includes(paisId)
        ? prev.idPais.filter(id => id !== paisId)
        : [...prev.idPais, paisId];
      
      return {
        ...prev,
        idPais: newPaises
      };
    });
  };

  useEffect(() => {
    if (showAddFoodModal) {
      cargarPaisesParaModal();
    }
  }, [showAddFoodModal]);

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered className="food-modal">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <FaUtensils className="me-2" />
            <span className="meal-type">{mealType}</span>
            <small className="text-muted ms-2">{formatDate(selectedDate)}</small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <div className="search-container mb-4">
              <div className="input-group search-input-group">
                <span className="input-group-text search-icon">
                  <FaSearch />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Buscar alimento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              {/* Filtro de países */}
              <div className="pais-filter-container mt-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaFilter />
                  </span>
                  <Form.Select
                    value={selectedPais}
                    onChange={(e) => setSelectedPais(e.target.value)}
                  >
                    <option value="">Todos los países</option>
                    {paises.map(pais => (
                      <option key={pais.id} value={pais.id}>
                        {pais.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                {selectedPais && (
                  <div className="mt-2">
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setSelectedPais('')}
                    >
                      Limpiar filtro
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3 food-tabs"
              fill
            >
              <Tab eventKey="all" title={<><FaUtensils /> Todos</>} />
              <Tab eventKey="mostUsed" title={<><FaStar /> Más usados</>} />
              <Tab eventKey="recent" title={<><FaHistory /> Recientes</>} />
            </Tabs>

            {loading && (
              <div className="text-center py-4 loading-container">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Cargando alimentos...</p>
              </div>
            )}

            {error && (
              <Alert variant="danger" className="alert-custom">
                <FaInfoCircle className="me-2" />
                {error}
              </Alert>
            )}

            {!loading && !error && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    Mostrando {getAlimentosByTab().length} de {filteredAlimentos.length} alimentos
                    {selectedPais && ` (filtrado por país)`}
                  </small>
                </div>
                
                <div className="alimentos-container">
                  <div className="alimentos-grid">
                    {getAlimentosByTab().length > 0 ? (
                      getAlimentosByTab().map(renderAlimentoCard)
                    ) : (
                      <div className="no-results">
                        <FaSearch className="no-results-icon" />
                        <p>No se encontraron alimentos</p>
                        {selectedPais && (
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => setSelectedPais('')}
                          >
                            Ver todos los alimentos
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón para agregar nuevo alimento */}
                <div className="text-center mt-4">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setShowAddFoodModal(true)}
                    className="add-food-btn"
                  >
                    <FaPlus className="me-2" />
                    ¿No encuentras la comida que quieres agregar?
                  </Button>
                </div>
              </>
            )}

            {selectedAlimento && (
              <div className="selected-alimento-container mt-4">
                <div className="selected-alimento-header">
                  {renderSelectedAlimentoImage()}
                  <h4 className="selected-alimento-title">{selectedAlimento.nombre}</h4>
                  
                  <div className="input-mode-selector mb-3">
                    <Form.Check
                      type="radio"
                      label="Por cantidad de porciones"
                      name="inputMode"
                      id="porciones-mode"
                      checked={inputMode === 'porciones'}
                      onChange={() => setInputMode('porciones')}
                      inline
                    />
                    <Form.Check
                      type="radio"
                      label="Por gramaje (g)"
                      name="inputMode"
                      id="gramaje-mode"
                      checked={inputMode === 'gramaje'}
                      onChange={() => setInputMode('gramaje')}
                      inline
                    />
                  </div>
                  
                  {inputMode === 'porciones' ? (
                    <div className="portion-control">
                      <Form.Label className="portion-label">Porciones:</Form.Label>
                      <Form.Control
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={contador}
                        onChange={(e) => setContador(parseFloat(e.target.value) || 1)}
                        className="portion-input"
                      />
                      <span className="portion-size">
                        ({selectedAlimento.porcionGramos}g cada una)
                      </span>
                    </div>
                  ) : (
                    <div className="portion-control">
                      <Form.Label className="portion-label">Gramos (g):</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        step="1"
                        value={gramaje}
                        onChange={(e) => setGramaje(parseFloat(e.target.value) || 100)}
                        className="portion-input"
                      />
                      <span className="portion-size">
                        (equivale a {(gramaje / selectedAlimento.porcionGramos).toFixed(2)} porciones)
                      </span>
                    </div>
                  )}
                </div>
                
                {renderNutritionLabel()}
              </div>
            )}

            <div className="modal-footer-buttons mt-4">
              <Button variant="outline-secondary" onClick={onHide} className="cancel-button">
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={!selectedAlimento}
                className="submit-button"
              >
                Agregar a {mealType.toLowerCase()}
              </Button>
            </div>
            
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para agregar nuevo alimento */}
      <Modal show={showAddFoodModal} onHide={() => setShowAddFoodModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Alimento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            * Campos obligatorios. El alimento se agregará a tu bitácora inmediatamente, pero estará inactivo para otros usuarios hasta que sea aprobado.
          </p>
          
          <Row className="g-3">
            {formFields.map(field => (
              <div className={`col-md-${field.col}`} key={field.label}>
                <div className="input-group mb-3">
                  <span className="input-group-text" style={{ minWidth: '150px' }}>{field.label}:</span>
                  <input
                    type={field.type}
                    className="form-control"
                    name={field.name}
                    value={field.value || ''}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    step={field.step}
                    style={{ padding: '0.5rem 0.75rem' }}
                  />
                </div>
              </div>
            ))}
            
            {/* Selector de países */}
            <div className="col-md-12">
              <div className="input-group mb-3">
                <span className="input-group-text" style={{ minWidth: '150px' }}>Países asociados:</span>
                <div className="form-control" style={{ padding: '0.5rem 0.75rem', height: 'auto', minHeight: '38px' }}>
                  {loadingPaises ? (
                    <div>Cargando países...</div>
                  ) : paisesForModal.length === 0 ? (
                    <div>No hay países disponibles</div>
                  ) : (
                    <div className="d-flex flex-wrap gap-3">
                      {paisesForModal.map(pais => (
                        <div key={pais.idPais} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`pais-${pais.idPais}`}
                            checked={newAlimentoData.idPais.includes(pais.idPais)}
                            onChange={() => handlePaisChange(pais.idPais)}
                          />
                          <label className="form-check-label" htmlFor={`pais-${pais.idPais}`}>
                            {pais.nombre_pais}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddFoodModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddNewFood}
            disabled={!newAlimentoData.Alimento || !newAlimentoData.Categoria}
          >
            Agregar alimento y registrar en bitácora
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PersonaBitacoraCRUD;