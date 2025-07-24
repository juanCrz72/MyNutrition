import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/crud-styles.css';

import { FaUserCircle, FaUtensils, FaThLarge, FaList, FaEdit, FaTrash, FaPlus, FaSearch, FaVenusMars, FaCalendarAlt, FaWeight, FaRulerVertical, FaGlobeAmericas, FaIdCard, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { getPersonasjs, createPersonajs, updatePersonajs, deletePersonajs } from '../../assets/js/Persona.js';
import { PersonaCRUD } from './PersonaCRUD.jsx'

function Persona() {
  const [viewMode, setViewMode] = useState("cards");
  const [personaList, setPersonaList] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [edad, setEdad] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [idPais, setIdPais] = useState("");
  const [idPlan, setIdPlan] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [questionnaireFilter, setQuestionnaireFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => { 
    getPersonasjs(setPersonaList); 
  }, []);

  const hasQuestionnaireData = (persona) => {
    return persona.act_fisica !== null || persona.metas !== null;
  };

  const filteredData = personaList.filter(item => {
    const nameMatch = `${item.nombre} ${item.apellidos}`.toLowerCase().includes(searchText.toLowerCase());
    const countryMatch = selectedCountry ? item.idPais == selectedCountry : true;
    
    let questionnaireMatch = true;
    if (questionnaireFilter === "with") {
      questionnaireMatch = hasQuestionnaireData(item);
    } else if (questionnaireFilter === "without") {
      questionnaireMatch = !hasQuestionnaireData(item);
    }
    
    return nameMatch && countryMatch && questionnaireMatch;
  }).slice(0, itemsPerPage);

  const uniqueCountries = [...new Set(personaList.map(item => item.idPais))].filter(Boolean);

  const handleAdd = () => {
    const personaData = {
      nombre,
      apellidos,
      fecha_nacimiento,
      sexo,
      edad,
      altura,
      peso,
      idPais,
      idPlan
    };
    createPersonajs(personaData, setShowModal, () => getPersonasjs(setPersonaList));
  };

  const handleUpdate = () => {
    const personaData = {
      nombre,
      apellidos,
      fecha_nacimiento,
      sexo,
      edad,
      altura,
      peso,
      idPais,
      idPlan
    };
    updatePersonajs(selectedPersona.idpersona, personaData, setShowEditModal, () => getPersonasjs(setPersonaList));
  };

  const handleDelete = () => {
    deletePersonajs(selectedPersona.idpersona, setShowDeleteModal, () => getPersonasjs(setPersonaList));
  };

  return (
    <div className="container-fluid py-3 py-md-4 px-2 px-md-3">
      {/* Encabezado */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 mb-md-4 gap-2">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaUserCircle className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Gestión de Personas
        </h2>
        <div className="d-flex flex-wrap gap-2 w-100 w-sm-auto justify-content-start justify-content-sm-end">
          <button 
            className={`crud-btn ${viewMode === "cards" ? "crud-btn-primary text-white" : "btn-outline-primary"} flex-grow-1 flex-sm-grow-0`}
            onClick={() => setViewMode("cards")}
          >
            <FaThLarge className="me-1" /> <span className="d-none d-sm-inline">Tarjetas</span>
          </button>
          <button 
            className={`crud-btn ${viewMode === "list" ? "crud-btn-primary text-white" : "btn-outline-primary"} flex-grow-1 flex-sm-grow-0`}
            onClick={() => setViewMode("list")}
          >
            <FaList className="me-1" /> <span className="d-none d-sm-inline">Lista</span>
          </button>
          <button 
            className="crud-btn crud-btn-success text-white flex-grow-1 flex-sm-grow-0"
            onClick={() => {
              setNombre(""); 
              setApellidos(""); 
              setFechaNacimiento(""); 
              setSexo("");
              setEdad(""); 
              setAltura(""); 
              setPeso("");
              setIdPais(""); 
              setIdPlan("");
              setSelectedPersona(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> <span className="d-none d-sm-inline"> Persona</span>
          </button> 
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-3 mb-md-4 g-2">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="crud-search-container">
            <FaSearch className="crud-search-icon" />
            <input
              type="text"
              className="form-control crud-search-input ps-4"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar persona..."
            />
          </div>
        </div>
        
        <div className="col-6 col-md-3 col-lg-2">
          <select 
            className="form-select crud-select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10 items</option>
            <option value={25}>25 items</option>
            <option value={50}>50 items</option>
          </select>
        </div>
        
        <div className="col-6 col-md-3 col-lg-2">
          <select 
            className="form-select crud-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Todos los países</option>
            {uniqueCountries.map(countryId => (
              <option key={countryId} value={countryId}>
                {personaList.find(p => p.idPais === countryId)?.nombre_pais || `País ${countryId}`}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-6 col-md-3 col-lg-2">
          <select 
            className="form-select crud-select"
            value={questionnaireFilter}
            onChange={(e) => setQuestionnaireFilter(e.target.value)}
          >
            <option value="all">Todos los cuestionarios</option>
            <option value="with">Con información</option>
            <option value="without">Sin información</option>
          </select>
        </div>
      </div>

      {/* Vista de Tarjetas */}
      {viewMode === "cards" && (
        <div className="row g-3 g-md-3 justify-content-start">
          {filteredData.length > 0 ? (
            filteredData.map((persona) => (
              <div key={persona.idpersona} className="col-12 col-sm-6 col-xl-4 col-xxl-3 d-flex">
                <div className="crud-card card-optimized w-100" style={{ minHeight: '280px' }}>
                  <div className="crud-card-header d-flex align-items-center p-2 p-md-3">
                    <div className="crud-avatar-optimized me-2 me-md-3 flex-shrink-0">
                      <FaUserCircle size={22} className="text-white" />
                    </div>
                    <div className="d-flex flex-column flex-grow-1 min-width-0">
                      <h6 className="mb-0 text-white fw-semibold text-truncate" title={`${persona.nombre} ${persona.apellidos}`}>
                        {persona.nombre} {persona.apellidos}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className="badge bg-white text-primary px-2 py-1 small">{persona.edad} años</span>
                        <span className="text-white-50 small text-truncate ms-1">
                          <FaVenusMars className="me-1" /> {persona.sexo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="crud-card-body p-2 p-md-3 d-flex flex-column">
                    <div className="optimized-info-grid flex-grow-1">
                      <div className="info-row-optimized">
                        <FaRulerVertical className="info-icon-optimized text-turquoise flex-shrink-0" />
                        <span className="info-text-optimized">
                          Altura: {persona.altura} cm
                        </span>
                      </div>
                      
                      <div className="info-row-optimized">
                        <FaWeight className="info-icon-optimized text-turquoise flex-shrink-0" />
                        <span className="info-text-optimized">
                          Peso: {persona.peso} kg
                        </span>
                      </div>
                      
                      <div className="info-row-optimized">
                        <FaGlobeAmericas className="info-icon-optimized text-turquoise flex-shrink-0" />
                        <span className="info-text-optimized text-truncate" title={persona.nombre_pais}>
                          {persona.nombre_pais}
                        </span>
                      </div>

                      <div className="info-row-optimized">
                        <FaIdCard className="info-icon-optimized text-turquoise flex-shrink-0" />
                        <span className="info-text-optimized text-truncate" title={persona.plan_nombre}>
                          Plan: {persona.plan_nombre}
                        </span>
                      </div>

                      <div className="info-row-optimized">
                        <FaIdCard className="info-icon-optimized text-turquoise flex-shrink-0" />
                        <span className="info-text-optimized text-truncate">
                          Cuestionario: 
                          {hasQuestionnaireData(persona) ? (
                            <span className="text-success ms-1">
                              <FaCheckCircle className="me-1" /> Completado
                            </span>
                          ) : (
                            <span className="text-warning ms-1">
                              <FaExclamationTriangle className="me-1" /> Incompleto
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="crud-card-footer d-flex justify-content-between align-items-center p-2 p-md-3">
                    <small className="text-muted text-truncate me-2">
                      <FaCalendarAlt className="me-1" />
                      {persona.fecha_nacimiento && new Date(persona.fecha_nacimiento).toLocaleDateString('es-ES', {day: '2-digit', month: 'short', year: 'numeric'})}
                    </small>
                    <div className="d-flex gap-1">
                      <button
                        className="crud-btn crud-btn-primary btn-action-optimized"
                        onClick={() => navigate(`/personaBitacora/${persona.idpersona}`)}
                        title="Bitácora de Comidas"
                      >
                        <FaUtensils size={12} />
                      </button>

                      <button
                        className="crud-btn crud-btn-info btn-action-optimized"
                        onClick={() => navigate(`/gestionPacientes?idpersona=${persona.idpersona}`)}
                        title="Historial"
                      >
                        <FaIdCard size={12} />
                      </button>
                      
                      <button 
                        className="crud-btn crud-btn-danger btn-action-optimized"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setSelectedPersona(persona);
                        }}
                        title="Eliminar"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center py-3">
                No hay personas registradas que coincidan con los filtros
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vista de Lista */}
      {viewMode === "list" && (
        <div className="card crud-card">
          <div className="table-responsive">
            <table className="table table-hover crud-table mb-0">
              <thead className={window.innerWidth <= 768 ? 'd-none' : ''}>
                <tr>
                  <th style={{ width: '25%' }}>Nombre</th>
                  <th style={{ width: '10%' }}>Edad</th>
                  <th style={{ width: '10%' }}>Sexo</th>
                  <th style={{ width: '15%' }}>Altura/Peso</th>
                  <th style={{ width: '20%' }}>País</th>
                  <th style={{ width: '20%' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((persona) => (
                    <tr key={persona.idpersona}>
                      {window.innerWidth <= 768 ? (
                        <td className="mobile-list-view">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong className="d-block">{persona.nombre} {persona.apellidos}</strong>
                              <small className="text-muted">{persona.edad} años, {persona.sexo}</small>
                            </div>
                            <div className="d-flex gap-1">
                              <button
                                className="crud-btn crud-btn-primary btn-action-optimized"
                                onClick={() => navigate(`/personaBitacora/${persona.idpersona}`)}
                                title="Bitácora de Comidas"
                              >
                                <FaUtensils size={12} />
                              </button>
                              
                              <button
                                className="crud-btn crud-btn-info btn-action-optimized"
                                onClick={() => navigate(`/gestionPacientes?idpersona=${persona.idpersona}`)}
                                title="Historial"
                              >
                                <FaIdCard size={12} />
                              </button>
                              
                              <button 
                                className="crud-btn btn-danger btn-sm"
                                onClick={() => {
                                  setShowDeleteModal(true);
                                  setSelectedPersona(persona);
                                }}
                                title="Eliminar"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td>
                            <strong className="d-block text-truncate" style={{ maxWidth: '200px' }} title={`${persona.nombre} ${persona.apellidos}`}>
                              {persona.nombre} {persona.apellidos}
                            </strong>
                            <small className="text-muted d-block">
                              {persona.fecha_nacimiento && new Date(persona.fecha_nacimiento).toLocaleDateString('es-ES')}
                            </small>
                          </td>
                          <td>{persona.edad} años</td>
                          <td>{persona.sexo}</td>
                          <td>
                            {persona.altura} cm / {persona.peso} kg
                          </td>
                          <td className="text-truncate" style={{ maxWidth: '150px' }} title={persona.nombre_pais}>
                            {persona.nombre_pais}
                          </td>
                          <td>
                            <div className="d-flex gap-1 flex-wrap">
                              <button
                                className="crud-btn crud-btn-primary btn-action-optimized"
                                onClick={() => navigate(`/personaBitacora/${persona.idpersona}`)}
                                title="Bitácora de Comidas"
                              >
                                <FaUtensils size={12} />
                              </button>
                                                        
                              <button
                                className="crud-btn crud-btn-info btn-action-optimized"
                                onClick={() => navigate(`/gestionPacientes?idpersona=${persona.idpersona}`)}
                                title="Historial"
                              >
                                <FaIdCard size={12} />
                              </button>
                              
                              <button 
                                className="crud-btn btn-danger btn-sm"
                                onClick={() => {
                                  setShowDeleteModal(true);
                                  setSelectedPersona(persona);
                                }}
                                title="Eliminar"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No hay personas registradas que coincidan con los filtros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PersonaCRUD
        formData={{
          nombre, setNombre,
          apellidos, setApellidos,
          fecha_nacimiento, setFechaNacimiento,
          sexo, setSexo,
          edad, setEdad,
          altura, setAltura,
          peso, setPeso,
          idPais, setIdPais,
          idPlan, setIdPlan,
          img_perfil: selectedPersona?.img_perfil || "",
          setImgPerfil: (img) => {
            if (selectedPersona) {
              setSelectedPersona({...selectedPersona, img_perfil: img});
            }
          }
        }}
        modals={{ 
          showModal, setShowModal, 
          showEditModal, setShowEditModal, 
          showDeleteModal, setShowDeleteModal 
        }}
        handlers={{ 
          handleAdd, 
          handleUpdate, 
          handleDelete 
        }}
        selectedPersona={selectedPersona}
      />
    </div>
  );
}

export default Persona;