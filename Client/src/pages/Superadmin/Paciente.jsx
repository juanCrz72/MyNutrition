import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/crud-styles.css'; // Nuevos estilos CRUD
import { FaUserCircle, FaThLarge, FaList, FaEdit, FaTrash, FaPlus, FaSearch,  FaMapMarkerAlt, FaPhone, FaUserTag, FaVenusMars, FaCalendarAlt, FaNotesMedical, FaIdCard } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { getPacientejs, createPacientejs, updatePacientejs, deletePacientejs } 
from '../../assets/js/Paciente.js';
import { PacienteCRUD } from './PacienteCRUD.jsx';

function Paciente() {
  const [viewMode, setViewMode] = useState("cards"); // "cards" o "list"
  const [pacienteList, setPaciente] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [estado, setEstado] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const navigate = useNavigate();

  useEffect(() => { getPacientejs(setPaciente); }, []);

  const filteredData = pacienteList.filter(item =>
    `${item.nombre} ${item.apellido}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAdd = () => {
    createPacientejs(nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, setShowModal, () => getPacientejs(setPaciente));
  };

  const handleUpdate = () => {
    updatePacientejs(selectedPaciente.idPaciente, nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, setShowEditModal, () => getPacientejs(setPaciente));
  };

  const handleDelete = () => {
    deletePacientejs(selectedPaciente.idPaciente, setShowDeleteModal, () => getPacientejs(setPaciente));
  };

  return (
    <div className="container-fluid py-3 py-md-4 px-2 px-md-3">
      {/* Encabezado - Optimizado para sidebar */}
  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 mb-md-4 gap-2">
  <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaUserCircle className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Gestión de Pacientes
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
                setNombre(""); setApellido(""); setEdad(""); setSexo("");
              setOcupacion(""); setDireccion(""); setLocalidad("");
              setEstado(""); setTelefono(""); setObservaciones("");
              setSelectedPaciente(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> <span className="d-none d-sm-inline">Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* Buscador - Optimizado para sidebar */}
      <div className="crud-search-container mb-3 mb-md-4">
        <FaSearch className="crud-search-icon" />
        <input
          type="text"
          className="form-control crud-search-input ps-4"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Buscar paciente..."
        />
      </div>

      {/* Vista de Tarjetas - Mejorado para sidebar */}
      {viewMode === "cards" && (
        <div className="row g-3 g-md-3 justify-content-start">
          {filteredData.length > 0 ? (
            filteredData.map((paciente) => (
              <div key={paciente.idPaciente} className="col-12 col-sm-6 col-xl-4 col-xxl-3 d-flex">
                <div className="crud-card card-optimized w-100" style={{ minHeight: '280px' }}>
                  {/* Header - Optimizado para texto largo */}
                  <div className="crud-card-header d-flex align-items-center p-2 p-md-3">
                    <div className="crud-avatar-optimized me-2 me-md-3 flex-shrink-0">
                      <FaUserCircle size={22} className="text-white" />
                    </div>
                    <div className="d-flex flex-column flex-grow-1 min-width-0">
                      <h6 className="mb-0 text-white fw-semibold text-truncate" title={`${paciente.nombre} ${paciente.apellido}`}>
                        {paciente.nombre} {paciente.apellido}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className="badge bg-white text-primary px-2 py-1 small">{paciente.edad} años</span>
                        <span className="text-white-50 small text-truncate ms-1">
                          <FaVenusMars className="me-1" /> {paciente.sexo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body - Mejor manejo de contenido largo */}
                  <div className="crud-card-body p-2 p-md-3 d-flex flex-column">
                    <div className="optimized-info-grid flex-grow-1">
                      <div className="info-row-optimized">
                        <FaUserTag className="info-icon-optimized text-primary flex-shrink-0" />
                        <span className="info-text-optimized text-truncate" title={paciente.ocupacion}>
                          {paciente.ocupacion}
                        </span>
                      </div>
                      
                      <div className="info-row-optimized">
                        <FaMapMarkerAlt className="info-icon-optimized text-primary flex-shrink-0" />
                        <span className="info-text-optimized text-truncate" title={`${paciente.direccion}, ${paciente.localidad}, ${paciente.estado}`}>
                          {paciente.localidad}, {paciente.estado}
                        </span>
                      </div>
                      
                      <div className="info-row-optimized">
                        <FaPhone className="info-icon-optimized text-primary flex-shrink-0" />
                        <span className="info-text-optimized text-truncate" title={paciente.telefono}>
                          {paciente.telefono}
                        </span>
                      </div>

                      {paciente.observaciones && (
                        <div className="info-row-optimized mt-2 pt-2 border-top">
                          <FaNotesMedical className="info-icon-optimized text-primary flex-shrink-0" />
                          <span className="info-text-optimized small text-truncate-3" title={paciente.observaciones}>
                            {paciente.observaciones}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer - Optimizado para espacios reducidos */}
                  <div className="crud-card-footer d-flex justify-content-between align-items-center p-2 p-md-3">
                    <small className="text-muted text-truncate me-2" title={new Date(paciente.fechaRegistro).toLocaleDateString('es-ES', {day: '2-digit', month: 'short', year: 'numeric'})}>
                      <FaCalendarAlt className="me-1" />
                      {new Date(paciente.fechaRegistro).toLocaleDateString('es-ES', {day: '2-digit', month: 'short'})}
                    </small>
                    <div className="d-flex gap-1">
                      <button 
                        className="crud-btn btn-warning text-white btn-action-optimized"
                        onClick={() => {
                        setShowEditModal(true);
                          setSelectedPaciente(paciente);
                          setNombre(paciente.nombre);
                          setApellido(paciente.apellido);
                          setEdad(paciente.edad);
                          setSexo(paciente.sexo);
                          setOcupacion(paciente.ocupacion);
                          setDireccion(paciente.direccion);
                          setLocalidad(paciente.localidad);
                          setEstado(paciente.estado);
                          setTelefono(paciente.telefono);
                          setObservaciones(paciente.observaciones);
                        }}
                        title="Editar"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button 
                        className="crud-btn crud-btn-danger btn-action-optimized"
                        onClick={() => {
                           setShowDeleteModal(true);
                          setSelectedPaciente(paciente);
                        }}
                        title="Eliminar"
                      >
                        <FaTrash size={12} />
                      </button>
                      <button
                        className="crud-btn crud-btn-info btn-action-optimized"
                        onClick={() => navigate(`/gestionPacientes?idPaciente=${paciente.idPaciente}`)}
                        title="Historial"
                      >
                        <FaIdCard size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center py-3">
                No hay pacientes registrados
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vista de Lista - Optimizada para sidebar */}
      {viewMode === "list" && (
        <div className="card crud-card">
          <div className="table-responsive">
            <table className="table table-hover crud-table mb-0">
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>Nombre</th>
                  <th style={{ width: '10%' }}>Edad</th>
                  <th style={{ width: '10%' }}>Sexo</th>
                  <th style={{ width: '20%' }}>Ocupación</th>
                  <th style={{ width: '15%' }}>Teléfono</th>
                  <th style={{ width: '20%' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((paciente) => (
                    <tr key={paciente.idPaciente}>
                      <td>
                        <strong className="d-block text-truncate" style={{ maxWidth: '200px' }} title={`${paciente.nombre} ${paciente.apellido}`}>
                          {paciente.nombre} {paciente.apellido}
                        </strong>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }} title={`${paciente.direccion}, ${paciente.localidad}`}>
                          {paciente.direccion}, {paciente.localidad}
                        </small>
                      </td>
                      <td>{paciente.edad} años</td>
                      <td className="text-truncate" style={{ maxWidth: '100px' }}>{paciente.sexo}</td>
                      <td className="text-truncate" style={{ maxWidth: '150px' }} title={paciente.ocupacion}>{paciente.ocupacion}</td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }} title={paciente.telefono}>{paciente.telefono}</td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <button 
                            className="crud-btn btn-warning text-white btn-sm"
                            onClick={() => {
                          setShowEditModal(true);
                          setSelectedPaciente(paciente);
                          setNombre(paciente.nombre);
                          setApellido(paciente.apellido);
                          setEdad(paciente.edad);
                          setSexo(paciente.sexo);
                          setOcupacion(paciente.ocupacion);
                          setDireccion(paciente.direccion);
                          setLocalidad(paciente.localidad);
                          setEstado(paciente.estado);
                          setTelefono(paciente.telefono);
                          setObservaciones(paciente.observaciones);
                            }}
                            title="Editar"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button 
                            className="crud-btn btn-danger btn-sm"
                            onClick={() => {
                               setShowDeleteModal(true);
                          setSelectedPaciente(paciente);
                            }}
                            title="Eliminar"
                          >
                            <FaTrash size={12} />
                          </button>
                          <button
                            className="crud-btn btn-info text-white btn-sm"
                            onClick={() => navigate(`/gestionPacientes?idPaciente=${paciente.idPaciente}`)}
                            title="Historial"
                          >
                            <FaIdCard size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No hay pacientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* [Mantener el componente PacienteCRUD igual...] */}
      <PacienteCRUD 
        formData={{
          nombre, setNombre,
          apellido, setApellido,
          edad, setEdad,
          sexo, setSexo,
          ocupacion, setOcupacion,
          direccion, setDireccion,
          localidad, setLocalidad,
          estado, setEstado,
          telefono, setTelefono,
          observaciones, setObservaciones
        }}
        modals={{
          showModal, setShowModal,
          showEditModal, setShowEditModal,
          showDeleteModal, setShowDeleteModal
        }}
        handlers={{
          handleAdd, handleUpdate, handleDelete
        }}
        selectedPaciente={selectedPaciente}
      />
    </div>
  );
}

export default Paciente;