import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaUtensils, FaInfoCircle, FaImage } from "react-icons/fa";
import './css/crud-styles.css';
import { getAlimentosjs, createAlimentojs, updateAlimentojs, deleteAlimentojs } from '../../assets/js/Alimentos.js';
import { AlimentoCRUD } from './AlimentosCRUD.jsx';
import {
  subirImagenAlimento,
  obtenerTodasLasImagenesAlimentos,
  eliminarImagenAlimentoPorId,
  obtenerImagenAlimento
} from '../../api/DocumentosAlimentos.api.js';
import { Alert, Spinner, Modal, Button, Form } from 'react-bootstrap';
import './css/crud-styles.css'; // Nuevos estilos CRUD

function Alimentos() {
  // Estados para la lista y formulario
  const [alimentoList, setAlimentoList] = useState([]);
  const [alimentoData, setAlimentoData] = useState({
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
    activo: 1
  });

  // Estados para los modales
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

  // Estados para imágenes
  const [imagenes, setImagenes] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [mensajeImagen, setMensajeImagen] = useState({ texto: '', tipo: '' });
  const [cargandoImagen, setCargandoImagen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // Estados para búsqueda y selección
  const [searchText, setSearchText] = useState("");
  const [selectedAlimento, setSelectedAlimento] = useState(null);
  const [gramaje, setGramaje] = useState(100);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estado para controlar el ancho de la pantalla
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Actualizar estado de mobile al cambiar el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Obtener alimentos e imágenes al cargar el componente
  useEffect(() => {
    getAlimentosjs(setAlimentoList);
    cargarImagenes();
  }, []);

  useEffect(() => {
  const img = new Image();
  img.src = '/images/no-image.png';
}, []);


  // Cargar imágenes
  const cargarImagenes = async () => {
    try {
      const data = await obtenerTodasLasImagenesAlimentos();
      setImagenes(data);
    } catch (error) {
      setMensajeImagen({ texto: 'Error al cargar las imágenes', tipo: 'danger' });
    }
  };

  // Obtener imagen de un alimento específico
  const getImagenAlimento = (idAlimento) => {
    return imagenes.find(img => img.idAlimento == idAlimento) || null;
  };

  // Manejar subida de imagen
  const handleSubirImagen = async () => {
    if (!archivo || !selectedAlimento?.id) {
      setMensajeImagen({ texto: 'Por favor, selecciona un archivo', tipo: 'warning' });
      return;
    }

    setCargandoImagen(true);
    try {
      await subirImagenAlimento(selectedAlimento.id, archivo);
      setMensajeImagen({ texto: 'Imagen subida correctamente.', tipo: 'success' });
      setArchivo(null);
      document.getElementById('form-file').value = '';
      await cargarImagenes();
    } catch (error) {
      setMensajeImagen({ texto: 'Error al subir la imagen.', tipo: 'danger' });
    } finally {
      setCargandoImagen(false);
    }
  };

  // Manejar eliminación de imagen
  const handleEliminarImagen = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      setCargandoImagen(true);
      try {
        await eliminarImagenAlimentoPorId(id);
        setMensajeImagen({ texto: 'Imagen eliminada correctamente.', tipo: 'success' });
        await cargarImagenes();
      } catch (err) {
        setMensajeImagen({ texto: 'Error al eliminar la imagen.', tipo: 'danger' });
      } finally {
        setCargandoImagen(false);
      }
    }
  };

  // Filtrar datos según búsqueda
  const filteredData = alimentoList.filter(item =>
    (item?.Alimento ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (item?.Categoria ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handlers para CRUD
  const handleAdd = () => {
    createAlimentojs(alimentoData, setShowModal, () => getAlimentosjs(setAlimentoList));
  };

  const handleUpdate = () => {
    updateAlimentojs(selectedAlimento.id, alimentoData, setShowEditModal, () => getAlimentosjs(setAlimentoList));
  };

  const handleDelete = () => {
    deleteAlimentojs(selectedAlimento.id, setShowDeleteModal, () => getAlimentosjs(setAlimentoList));
  };

  // Resetear formulario
  const resetForm = () => {
    setAlimentoData({
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
      activo: 1
    });
  };

  // Mostrar información nutricional
  const showNutritionInfo = (alimento) => {
    setSelectedAlimento(alimento);
    setGramaje(100);
    setShowNutritionModal(true);
  };

  // Mostrar imagen del alimento
  const showImageInfo = (alimento) => {
    setSelectedAlimento(alimento);
    const imagen = getImagenAlimento(alimento.id);
    if (imagen) {
      setCurrentImage(imagen);
      setShowImageModal(true);
    } else {
      setMensajeImagen({ texto: 'Este alimento no tiene imagen asociada', tipo: 'warning' });
    }
  };

  // Mostrar modal para subir imagen
  const showImageUpload = (alimento) => {
    setSelectedAlimento(alimento);
    setShowImageUploadModal(true);
  };

  // Calcular valores nutricionales según gramaje
  const calculateNutrition = (value) => {
    if (!selectedAlimento) return 0;
    const factor = gramaje / 100;
    return (parseFloat(value) * factor).toFixed(2);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaUtensils className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Catálogo de Alimentos
        </h2>
        <div className="d-flex flex-wrap gap-2">
          <button className="crud-btn crud-btn-primary text-white">
            <FaList className="me-1" /> Lista
          </button>
          <button
            className="crud-btn crud-btn-success text-white"
            onClick={() => {
              resetForm();
              setSelectedAlimento(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nuevo Alimento
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="crud-search-container">
            <FaSearch className="crud-search-icon" />
            <input
              type="text"
              className="form-control crud-search-input ps-4"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por Nombre o Categoría..."
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="crud-search-container">
            <FaList className="crud-search-icon" />
            <select
              className="form-select crud-search-input ps-4"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  Mostrar {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vista para dispositivos móviles (cards) */}
      {isMobile ? (
        <div className="row">
          {currentItems.length > 0 ? (
            currentItems.map((alimento) => {
              const imagenAlimento = getImagenAlimento(alimento.id);
              return (
                <div key={alimento.id} className="col-12 mb-3">
                  <div className="card crud-card">
                    {imagenAlimento && (
                      <img 
                        src={`/${imagenAlimento.localizacion}`} 
                        className="card-img-top" 
                        alt={alimento.Alimento}
                        style={{ height: '150px', objectFit: 'cover' }}
                        onClick={() => showImageInfo(alimento)}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{alimento.Alimento}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">{alimento.Categoria}</h6>
                      <p className="card-text">
                        <strong>Cantidad Sugerida:</strong> {alimento.Cantidad_Sugerida} {alimento.Unidad}<br />
                        <strong>Peso Bruto:</strong> {alimento.Peso_Bruto_g}g<br />
                        <strong>Peso Neto:</strong> {alimento.Peso_Neto_g}g<br />
                        <strong>Energía:</strong> {alimento.Energia_kcal} kcal<br />
                        <strong>Estado:</strong> {alimento.activo === 1 ? "ACTIVO" : "INACTIVO"}
                      </p>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="crud-btn btn-info btn-sm text-white"
                          onClick={() => showNutritionInfo(alimento)}
                        >
                          <FaInfoCircle />
                        </button>
                        <button
                          className="crud-btn btn-secondary btn-sm text-white"
                          onClick={() => showImageUpload(alimento)}
                        >
                          <FaImage />
                        </button>
                        <button
                          className="crud-btn btn-warning text-white btn-sm"
                          onClick={() => {
                            setShowEditModal(true);
                            setSelectedAlimento(alimento);
                            setAlimentoData({
                              Categoria: alimento.Categoria,
                              Alimento: alimento.Alimento,
                              Cantidad_Sugerida: alimento.Cantidad_Sugerida,
                              Unidad: alimento.Unidad,
                              Peso_Bruto_g: alimento.Peso_Bruto_g,
                              Peso_Neto_g: alimento.Peso_Neto_g,
                              Energia_kcal: alimento.Energia_kcal,
                              Proteina_g: alimento.Proteina_g,
                              Grasa_g: alimento.Grasa_g,
                              Carbohidratos_g: alimento.Carbohidratos_g,
                              Azucar_g: alimento.Azucar_g,
                              Fibra_g: alimento.Fibra_g,
                              idPais: alimento.paises_ids,
                              activo: alimento.activo
                            });
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="crud-btn btn-danger btn-sm"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedAlimento(alimento);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-4 text-muted">
              No hay alimentos registrados
            </div>
          )}
        </div>
      ) : (
        /* Vista para escritorio (tabla) */
        <div className="card crud-card">
          <div className="table-responsive">
            <table className="table table-hover crud-table mb-0">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Categoría</th>
                  <th>Alimento</th>
                  <th>Cantidad Sugerida</th>
                  <th>Peso Bruto</th>
                  <th>Peso Neto</th>
                  <th>Energía (kcal)</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((alimento) => {
                    const imagenAlimento = getImagenAlimento(alimento.id);
                    return (
                      <tr key={alimento.id}>
                        <td>
                          {imagenAlimento ? (
                            <img 
                              src={`/${imagenAlimento.localizacion}`} 
                              alt={alimento.Alimento}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'pointer' }}
                              onClick={() => showImageInfo(alimento)}
                              className="rounded"
                            />
                          ) : (
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => showImageUpload(alimento)}
                            >
                              <FaImage />
                            </button>
                          )}
                        </td>
                        <td>{alimento.Categoria}</td>
                        <td>{alimento.Alimento}</td>
                        <td>{alimento.Cantidad_Sugerida} {alimento.Unidad}</td>
                        <td>{alimento.Peso_Bruto_g}g</td>
                        <td>{alimento.Peso_Neto_g}g</td>
                        <td>{alimento.Energia_kcal}</td>
                        <td>{alimento.activo === 1 ? "ACTIVO" : "INACTIVO"}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="crud-btn btn-info btn-sm text-white"
                              onClick={() => showNutritionInfo(alimento)}
                            >
                              <FaInfoCircle />
                            </button>
                            {!imagenAlimento && (
                              <button
                                className="crud-btn btn-secondary btn-sm text-white"
                                onClick={() => showImageUpload(alimento)}
                              >
                                <FaImage />
                              </button>
                            )}
                            <button
                              className="crud-btn btn-warning text-white btn-sm"
                              onClick={() => {
                                setShowEditModal(true);
                                setSelectedAlimento(alimento);
                                setAlimentoData({
                                  Categoria: alimento.Categoria,
                                  Alimento: alimento.Alimento,
                                  Cantidad_Sugerida: alimento.Cantidad_Sugerida,
                                  Unidad: alimento.Unidad,
                                  Peso_Bruto_g: alimento.Peso_Bruto_g,
                                  Peso_Neto_g: alimento.Peso_Neto_g,
                                  Energia_kcal: alimento.Energia_kcal,
                                  Proteina_g: alimento.Proteina_g,
                                  Grasa_g: alimento.Grasa_g,
                                  Carbohidratos_g: alimento.Carbohidratos_g,
                                  Azucar_g: alimento.Azucar_g,
                                  Fibra_g: alimento.Fibra_g,
                                  idPais: alimento.paises_ids,
                                  activo: alimento.activo
                                });
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="crud-btn btn-danger btn-sm"
                              onClick={() => {
                                setShowDeleteModal(true);
                                setSelectedAlimento(alimento);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      No hay alimentos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Controles de paginación */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">
          Página {currentPage} de {totalPages}
        </span>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      <AlimentoCRUD
        formData={{ alimentoData, setAlimentoData }}
        modals={{ showModal, setShowModal, showEditModal, setShowEditModal, showDeleteModal, setShowDeleteModal }}
        handlers={{ handleAdd, handleUpdate, handleDelete }}
        selectedAlimento={selectedAlimento}
      />

      {/* Modal de información nutricional */}
     {/* Modal de información nutricional */}
{/* Modal de información nutricional */}
{selectedAlimento && (
  <div className={`modal fade ${showNutritionModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showNutritionModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header text-white sticky-top" style={{ backgroundColor: 'rgba(52,73,94,255)' }}>
          <h5 className="modal-title fw-bold">Información Nutricional</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={() => setShowNutritionModal(false)}
          ></button>
        </div>
        
        <div className="modal-body p-0">
          <div className="nutrition-label">
            {/* Sección de imagen FULL WIDTH arriba */}
            <div className="nutrition-image-container bg-light py-3 text-center">
              {getImagenAlimento(selectedAlimento.id) ? (
                <img
                  src={`/${getImagenAlimento(selectedAlimento.id).localizacion}`}
                  alt={selectedAlimento.Alimento}
                  className="nutrition-image img-fluid rounded"
                  style={{
                    maxHeight: '200px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/no-image.png';
                  }}
                />
              ) : (
                <div className="d-inline-flex align-items-center justify-content-center bg-white rounded p-4">
                  <FaImage className="text-muted" size="3em" />
                </div>
              )}
            </div>
            
            {/* Contenido principal con padding adecuado */}
            <div className="px-6 pt-3 pb-2">
              {/* Título y categoría centrados */}
              <div className="text-center mb-3">
                <h2 className="mb-1" style={{ fontSize: '1.8rem', fontWeight: '400' }}>{selectedAlimento.Alimento}</h2>
                <p className="text-muted" style={{ fontSize: '1.1rem' }}>{selectedAlimento.Categoria}</p>
              </div>
              
              {/* Gramaje en su propia sección */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center bg-light p-3 rounded mb-3">
                <p className="mb-2 mb-md-0 text-center text-md-start">
                  <strong>Tamaño de porción:</strong> {selectedAlimento.Cantidad_Sugerida} {selectedAlimento.Unidad}
                </p>
                <div className="input-group" style={{ width: '180px' }}>
                  <span className="input-group-text bg-white">Gramaje (g)</span>
                  <input 
                    type="number" 
                    className="form-control"
                    value={gramaje}
                    onChange={(e) => setGramaje(parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
              </div>
              
              {/* Separador */}
              <hr className="my-2 border-2 opacity-25" />
              
              {/* Tabla nutricional */}
              <div className="nutrition-facts mt-3">
                <div className="d-flex justify-content-between align-items-baseline border-bottom border-dark border-3 mb-2 pb-2">
                  <h3 className="mb-0 fw-bold" style={{ fontSize: '1.3rem' }}>Información Nutricional</h3>
                  <p className="mb-0 text-muted small">Por {gramaje}g</p>
                </div>
                
                <div className="nutrition-table">
                  {/* Encabezado */}
                  <div className="row fw-bold py-2 small" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                    <div className="col-7">Nutriente</div>
                    <div className="col-5 text-end">% Valor Diario*</div>
                  </div>
                  
                  {/* Filas de nutrientes */}
                  {[
                    { name: 'Calorías', value: calculateNutrition(selectedAlimento.Energia_kcal), unit: '', percentage: '' },
                    { name: 'Grasa Total', value: calculateNutrition(selectedAlimento.Grasa_g), unit: 'g', percentage: Math.round((parseFloat(calculateNutrition(selectedAlimento.Grasa_g)) / 65) * 100) },
                    { name: 'Carbohidratos Totales', value: calculateNutrition(selectedAlimento.Carbohidratos_g), unit: 'g', percentage: Math.round((parseFloat(calculateNutrition(selectedAlimento.Carbohidratos_g)) / 300) * 100) },
                    { name: 'Azúcares', value: calculateNutrition(selectedAlimento.Azucar_g), unit: 'g', percentage: '' },
                    { name: 'Proteína', value: calculateNutrition(selectedAlimento.Proteina_g), unit: 'g', percentage: '' },
                    { name: 'Fibra Dietética', value: calculateNutrition(selectedAlimento.Fibra_g), unit: 'g', percentage: Math.round((parseFloat(calculateNutrition(selectedAlimento.Fibra_g)) / 25) * 100) }
                  ].map((nutrient, index) => (
                    <div key={index} className="row py-2 border-bottom">
                      <div className="col-7">
                        <span className="fw-bold">{nutrient.name}</span> {nutrient.value}{nutrient.unit}
                      </div>
                      <div className="col-5 text-end">
                        {nutrient.percentage && `${nutrient.percentage}%`}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Notas al pie */}
                <div className="nutrition-footer mt-3 pt-2">
                  <p className="small text-muted mb-2">
                    * Los porcentajes de valores diarios están basados en una dieta de 2,000 calorías. 
                    Sus valores diarios pueden ser mayores o menores dependiendo de sus necesidades calóricas.
                  </p>
                  <div className="d-flex flex-wrap gap-3 small justify-content-center justify-content-md-start">
                    <span><strong>Peso Bruto:</strong> {calculateNutrition(selectedAlimento.Peso_Bruto_g)}g</span>
                    <span><strong>Peso Neto:</strong> {calculateNutrition(selectedAlimento.Peso_Neto_g)}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer sticky-bottom bg-light">
          <button
            type="button"
            className="crud-btn crud-btn-primary"
            onClick={() => setShowNutritionModal(false)}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Modal para visualizar imagen */}
      {selectedAlimento && currentImage && (
        <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedAlimento.Alimento}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <img 
              src={`/${currentImage.localizacion}`} 
              alt={selectedAlimento.Alimento}
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/no-image.png';
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowImageModal(false)}>
              Cerrar
            </Button>
            <Button 
              variant="danger" 
              onClick={() => {
                handleEliminarImagen(currentImage.id);
                setShowImageModal(false);
              }}
              disabled={cargandoImagen}
            >
              {cargandoImagen ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="visually-hidden">Eliminando...</span>
                </>
              ) : (
                'Eliminar Imagen'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal para subir imagen */}
      {selectedAlimento && (
        <Modal show={showImageUploadModal} onHide={() => setShowImageUploadModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Subir Imagen para {selectedAlimento.Alimento}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {mensajeImagen.texto && (
              <Alert variant={mensajeImagen.tipo} onClose={() => setMensajeImagen({ texto: '', tipo: '' })} dismissible>
                {mensajeImagen.texto}
              </Alert>
            )}
            <Form>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Seleccionar imagen</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setArchivo(e.target.files[0])}
                  id="form-file"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowImageUploadModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubirImagen}
              disabled={cargandoImagen || !archivo}
            >
              {cargandoImagen ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="visually-hidden">Subiendo...</span>
                </>
              ) : (
                'Subir Imagen'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Alimentos;