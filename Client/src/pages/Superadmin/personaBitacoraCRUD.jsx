import { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Tab, Tabs, Badge } from 'react-bootstrap';
import { FaSearch, FaUtensils, FaFire, FaHistory, FaStar, FaInfoCircle } from 'react-icons/fa';
import { createBitacoraComidajs, getBitacoraComidasjs } from '../../assets/js/Bitacora.js';
import { getAlimentos } from '../../api/Alimentos.api.js';
import { getBitacoraComidas } from '../../api/Bitacora.api.js';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Función para formatear la fecha de manera segura
  const formatDate = (date) => {
    try {
      const d = date instanceof Date ? date : new Date(date);
      return isNaN(d.getTime()) ? 'Fecha no disponible' : d.toLocaleDateString();
    } catch {
      return 'Fecha no disponible';
    }
  };

  useEffect(() => {
    if (show) {
      setLoading(true);
      setError(null);
      fetchAlimentos();
      fetchMostUsedAlimentos();
    }
  }, [show]);

  const fetchAlimentos = async () => {
    try {
      const data = await getAlimentos();
      const mapped = data.map(item => ({
        id: item.id,
        nombre: item.Alimento,
        porcion: item.Cantidad_Sugerida || 'N/A',
        energia_kcal: parseFloat(item.Energia_kcal) || 0,
        proteina_g: parseFloat(item.Proteina_g) || 0,
        carbohidratos_g: parseFloat(item.Carbohidratos_g) || 0,
        grasa_g: parseFloat(item.Grasa_g) || 0,
        categoria: item.Categoria,
        fibra_g: parseFloat(item.Fibra_g) || 0,
        azucar_g: parseFloat(item.Azucar_g) || 0,
        sodio_mg: parseFloat(item.Sodio_mg) || 0
      }));
      setAlimentos(mapped);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los alimentos');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAlimento) {
      Swal.fire('Error', 'Debes seleccionar un alimento', 'error');
      return;
    }
    
    try {
      await createBitacoraComidajs(
        idUsuario,
        mealType,
        selectedAlimento.id,
        selectedDate,
        contador,
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
    
    const totalCalories = selectedAlimento.energia_kcal * contador;
    const caloriesFromFat = selectedAlimento.grasa_g * contador * 9;
    
    return (
      <div className="nutrition-label">
        <div className="nutrition-header">
          <h5>Información Nutricional</h5>
          <small>Por {contador} porción(es) de {selectedAlimento.porcion}</small>
        </div>
        
        <div className="nutrition-facts">
          <div className="nutrition-row main">
            <span className="nutrition-title">Calorías</span>
            <span className="nutrition-value">{totalCalories.toFixed(0)}</span>
          </div>
          <div className="nutrition-subtext">
            Calorías de grasa: {caloriesFromFat.toFixed(0)}
          </div>
          
          <div className="nutrition-divider"></div>
          
          <div className="nutrition-row">
            <span className="nutrition-title">Grasa Total</span>
            <span className="nutrition-value">{(selectedAlimento.grasa_g * contador).toFixed(1)}g</span>
          </div>
          
          <div className="nutrition-row">
            <span className="nutrition-title">Carbohidratos Totales</span>
            <span className="nutrition-value">{(selectedAlimento.carbohidratos_g * contador).toFixed(1)}g</span>
          </div>
          
          <div className="nutrition-row sub">
            <span className="nutrition-title">• Azúcares</span>
            <span className="nutrition-value">{(selectedAlimento.azucar_g * contador).toFixed(1)}g</span>
          </div>
          
          <div className="nutrition-row sub">
            <span className="nutrition-title">• Fibra Dietética</span>
            <span className="nutrition-value">{(selectedAlimento.fibra_g * contador).toFixed(1)}g</span>
          </div>
          
          <div className="nutrition-row">
            <span className="nutrition-title">Proteína</span>
            <span className="nutrition-value">{(selectedAlimento.proteina_g * contador).toFixed(1)}g</span>
          </div>
          
          <div className="nutrition-row">
            <span className="nutrition-title">Sodio</span>
            <span className="nutrition-value">{(selectedAlimento.sodio_mg * contador).toFixed(0)}mg</span>
          </div>
        </div>
        
        <div className="nutrition-footer">
          <small>Valores diarios basados en una dieta de 2,000 kcal</small>
        </div>
      </div>
    );
  };

  return (
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
                  getAlimentosByTab().map(alimento => (
                    <div 
                      key={alimento.id}
                      className={`alimento-card ${selectedAlimento?.id === alimento.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAlimento(alimento)}
                    >
                      <div className="alimento-card-header">
                        <h5 className="alimento-name">{alimento.nombre}</h5>
                        <Badge bg="light" text="dark" className="alimento-category">
                          {alimento.categoria}
                        </Badge>
                      </div>
                      <div className="alimento-portion">{alimento.porcion}</div>
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
                        <div className="macro-item">
                          <span className="macro-value">{alimento.grasa_g}</span>
                          <span className="macro-label">Grasa</span>
                        </div>
                      </div>
                    </div>
                  ))
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
                <h4 className="selected-alimento-title">{selectedAlimento.nombre}</h4>
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
                  <span className="portion-size">{selectedAlimento.porcion}</span>
                </div>
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