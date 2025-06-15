import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaUtensils, FaInfoCircle } from "react-icons/fa";

import { getAlimentosjs, createAlimentojs, updateAlimentojs, deleteAlimentojs } from '../../assets/js/Alimentos.js';
import { AlimentoCRUD } from './AlimentosCRUD.jsx';

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

  // Estados para búsqueda y selección
  const [searchText, setSearchText] = useState("");
  const [selectedAlimento, setSelectedAlimento] = useState(null);

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

  // Obtener alimentos al cargar el componente
  useEffect(() => {
    getAlimentosjs(setAlimentoList);
  }, []);

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
    setShowNutritionModal(true);
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
            currentItems.map((alimento) => (
              <div key={alimento.id} className="col-12 mb-3">
                <div className="card crud-card">
                  <div className="card-body">
                    <h5 className="card-title">{alimento.Alimento}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{alimento.Categoria}</h6>
                    <p className="card-text">
                      <strong>Cantidad Sugerida:</strong> {alimento.Cantidad_Sugerida} {alimento.Unidad}<br />
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
            ))
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
                  <th>Categoría</th>
                  <th>Alimento</th>
                  <th>Cantidad Sugerida</th>
                  <th>Energía (kcal)</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((alimento) => (
                    <tr key={alimento.id}>
                      <td>{alimento.Categoria}</td>
                      <td>{alimento.Alimento}</td>
                      <td>{alimento.Cantidad_Sugerida} {alimento.Unidad}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
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
{selectedAlimento && (
  <div className={`modal fade ${showNutritionModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showNutritionModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div className="modal-content">
        {/* Header modificado para usar tus estilos */}
      <div
  className="modal-header text-white sticky-top"
  style={{ backgroundColor: 'rgba(52,73,94,255)' }}
>

        <h5 className="modal-title fw-bold">Información Nutricional</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={() => setShowNutritionModal(false)}
          ></button>
        </div>
        
        {/* Contenido nutricional SIN cambios (igual que antes) */}
        <div className="modal-body p-0">
          <div className="nutrition-label p-3">
            <div className="nutrition-header text-center">
              <h3 className="mb-1">{selectedAlimento.Alimento}</h3>
              <p className="text-muted mb-2">{selectedAlimento.Categoria}</p>
              <hr className="my-2" />
              <p className="serving-size mb-3">
                <strong>Tamaño de porción:</strong> {selectedAlimento.Cantidad_Sugerida} {selectedAlimento.Unidad}
              </p>
            </div>
            
            <div className="nutrition-facts">
              <div className="nutrition-facts-header border-bottom border-dark border-3 mb-2 pb-1">
                <h4 className="mb-0 fw-bold">Información Nutricional</h4>
                <p className="mb-0 small">Por {selectedAlimento.Cantidad_Sugerida} {selectedAlimento.Unidad}</p>
              </div>
              
              <div className="nutrition-table">
                <div className="nutrition-row border-bottom border-dark border-2 fw-bold">
                  <div className="nutrition-cell">Cantidad por porción</div>
                  <div className="nutrition-cell text-end">% Valor Diario*</div>
                </div>
                
                <div className="nutrition-row border-bottom">
                  <div className="nutrition-cell">
                    <span className="fw-bold">Calorías</span> {selectedAlimento.Energia_kcal}
                  </div>
                  <div className="nutrition-cell text-end"></div>
                </div>
                
                <div className="nutrition-row border-bottom">
                  <div className="nutrition-cell">
                    <span className="fw-bold">Grasa Total</span> {selectedAlimento.Grasa_g}g
                  </div>
                  <div className="nutrition-cell text-end">
                    {Math.round((parseFloat(selectedAlimento.Grasa_g || 0) / 65) * 100)}%
                  </div>
                </div>
                
                <div className="nutrition-row border-bottom">
                  <div className="nutrition-cell">
                    <span className="fw-bold">Carbohidratos Totales</span> {selectedAlimento.Carbohidratos_g}g
                  </div>
                  <div className="nutrition-cell text-end">
                    {Math.round((parseFloat(selectedAlimento.Carbohidratos_g || 0) / 300) * 100)}%
                  </div>
                </div>
                
                <div className="nutrition-row border-bottom">
                  <div className="nutrition-cell">
                    <span className="fw-bold">Azúcares</span> {selectedAlimento.Azucar_g}g
                  </div>
                  <div className="nutrition-cell text-end"></div>
                </div>
                
                <div className="nutrition-row border-bottom">
                  <div className="nutrition-cell">
                    <span className="fw-bold">Proteína</span> {selectedAlimento.Proteina_g}g
                  </div>
                  <div className="nutrition-cell text-end"></div>
                </div>
                
                <div className="nutrition-row border-bottom">
                  <div className="nutrition-cell">
                    <span className="fw-bold">Fibra Dietética</span> {selectedAlimento.Fibra_g}g
                  </div>
                  <div className="nutrition-cell text-end">
                    {Math.round((parseFloat(selectedAlimento.Fibra_g || 0) / 25) * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="nutrition-footer mt-3">
                <p className="small mb-1">
                  * Los porcentajes de valores diarios están basados en una dieta de 2,000 calorías. 
                  Sus valores diarios pueden ser mayores o menores dependiendo de sus necesidades calóricas.
                </p>
                <p className="small mb-0">
                  <strong>Peso Bruto:</strong> {selectedAlimento.Peso_Bruto_g}g | 
                  <strong> Peso Neto:</strong> {selectedAlimento.Peso_Neto_g}g
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer con botón de cerrar usando tus estilos */}
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

{/* Estilos (se mantienen igual) */}
<style jsx>{`
  .nutrition-label {
    border: 2px solid black;
    padding: 15px;
    max-width: 400px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    background-color: white;
  }
  
  @media (max-width: 768px) {
    .nutrition-label {
      max-width: 100%;
      border: none;
      padding: 10px;
    }
    
    .modal-dialog {
      margin: 0;
      max-width: 100%;
      height: 100vh;
    }
    
    .modal-content {
      height: 100%;
      border-radius: 0;
    }
    
    .modal-body {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
  
  .nutrition-header h3 {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }
  
  .nutrition-facts-header h4 {
    font-size: 1.25rem;
  }
  
  .nutrition-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
  }
  
  .nutrition-cell {
    padding: 0.25rem 0;
  }
  
  .serving-size {
    font-size: 0.9rem;
  }
  
  .small {
    font-size: 0.75rem;
  }
`}</style>

    </div>
  );
}

export default Alimentos;