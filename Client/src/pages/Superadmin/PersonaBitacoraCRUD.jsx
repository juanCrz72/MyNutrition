import { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Tab, Tabs, Badge } from 'react-bootstrap';
import { FaSearch, FaUtensils, FaHistory, FaStar, FaInfoCircle, FaImage, FaHamburger, FaAppleAlt, FaDrumstickBite, FaEgg, FaBreadSlice } from 'react-icons/fa';
import { GiFruitBowl, GiMeal, GiChickenOven, GiSodaCan } from 'react-icons/gi';
import { createBitacoraComidajs, getBitacoraComidasjs } from '../../assets/js/Bitacora.js';
import { getAlimentos } from '../../api/Alimentos.api.js';
import { getBitacoraComidas } from '../../api/Bitacora.api.js';
import { obtenerTodasLasImagenesAlimentos } from '../../api/DocumentosAlimentos.api.js';
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
      [id]: null // Usaremos null para indicar que no hay imagen disponible
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
      const [alimentosData, imagenesData] = await Promise.all([
        getAlimentos(),
        obtenerTodasLasImagenesAlimentos()
      ]);

      const mappedAlimentos = alimentosData.map(item => ({
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
        sodio_mg: parseFloat(item.Sodio_mg) || 0
      }));

      const imagenesMap = {};
      imagenesData.forEach(img => {
        if (!imagenesMap[img.idAlimento]) {
          imagenesMap[img.idAlimento] = img.localizacion;
        }
      });

      setAlimentos(mappedAlimentos);
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

  const filteredAlimentos = alimentos.filter(alimento =>
    alimento.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAlimentosByTab = () => {
    switch (activeTab) {
      case 'mostUsed':
        return alimentos.filter(alimento => 
          mostUsedAlimentos.some(mu => mu.id === alimento.id)
        ).slice(0, 5);
      case 'recent':
        return [...alimentos].reverse().slice(0, 5);
      default:
        return filteredAlimentos.slice(0, 10);
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

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="food-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title>
          <FaUtensils className="me-2" />
          <span className="meal-type">{mealType}</span>
          <small className="text-white  ms-2">{formatDate(selectedDate)}</small>
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
            <div className="alimentos-container">
              <div className="alimentos-grid">
                {getAlimentosByTab().length > 0 ? (
                  getAlimentosByTab().map(renderAlimentoCard)
                ) : (
                  <div className="no-results">
                    <FaSearch className="no-results-icon" />
                    <p>No se encontraron alimentos</p>
                  </div>
                )}
              </div>
            </div>
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
  );
};

export default PersonaBitacoraCRUD;
