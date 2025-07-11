import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/crud-styles.css';
import { 
  FaUserCircle, FaUtensils, FaThLarge, FaList, FaEdit, 
  FaTrash, FaPlus, FaSearch, FaVenusMars, FaCalendarAlt,
  FaWeight, FaRulerVertical, FaGlobeAmericas, FaIdCard,
  FaEnvelope, FaUserShield, FaKey 
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { getUsuariosjs, createUsuariosjs, updateUsuariosjs, deleteUsuariosjs } from '../../assets/js/Usuarios.js';
import { UsuarioCRUD } from './UsuariosCRUD.jsx';

function Usuarios() {
    const [viewMode, setViewMode] = useState("cards");
    const [usuariosList, setUsuariosList] = useState([]);
    const [nombre, setNombre] = useState("");
    const [usuario, setUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [idPersona, setIdPersona] = useState("");
    const [id_perfil, setIdPerfil] = useState("");
    const [activo, setActivo] = useState(true);
    const [date_add, setDateAdd] = useState("");
    const [date_upt, setDateUpt] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = () => {
        getUsuariosjs(setUsuariosList);
    };

    const filteredData = usuariosList.filter(usuarioItem =>
        `${usuarioItem.nombre} ${usuarioItem.usuario}`.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAdd = () => {
        const usuarioData = {
            nombre,
            usuario,
            correo,
            contrasenia,
            idPersona,
            id_perfil,
            activo,
            date_add,
            date_upt
        };
        createUsuariosjs(usuarioData, setShowModal, fetchUsuarios);
    };

    const handleUpdate = () => {
        const usuarioData = {
            nombre,
            usuario,
            correo,
            contrasenia,
            idPersona,
            id_perfil,
            activo,
            date_add,
            date_upt
        };
        updateUsuariosjs(selectedUsuario.id_usuario, usuarioData, setShowEditModal, fetchUsuarios);
    };

    const handleDelete = () => {
        deleteUsuariosjs(selectedUsuario.id_usuario, setShowDeleteModal, fetchUsuarios);
    };

    return (
        <div className="container-fluid py-3 py-md-4 px-2 px-md-3">
            {/* Encabezado */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 mb-md-4 gap-2">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                    <FaUserCircle className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Gestión de Usuarios
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
                            setUsuario(""); 
                            setCorreo(""); 
                            setContrasenia("");
                            setIdPersona(""); 
                            setIdPerfil("");
                            setActivo(true); 
                            setDateAdd("");
                            setDateUpt("");
                            setSelectedUsuario(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus className="me-1" /> <span className="d-none d-sm-inline">Nuevo Usuario</span>
                    </button>
                </div>
            </div>

            {/* Buscador */}
            <div className="crud-search-container mb-3 mb-md-4">
                <FaSearch className="crud-search-icon" />
                <input
                    type="text"
                    className="form-control crud-search-input ps-4"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Buscar usuario..."
                />
            </div>

            {/* Vista de Tarjetas */}
            {viewMode === "cards" && (
                <div className="row g-3 g-md-3 justify-content-start">
                    {filteredData.length > 0 ? (
                        filteredData.map((usuarioItem) => (
                            <div key={usuarioItem.id_usuario} className="col-12 col-sm-6 col-xl-4 col-xxl-3 d-flex">
                                <div className="crud-card card-optimized w-100" style={{ minHeight: '280px' }}>
                                    <div className="crud-card-header d-flex align-items-center p-2 p-md-3">
                                        <div className="crud-avatar-optimized me-2 me-md-3 flex-shrink-0">
                                            <FaUserCircle size={22} className="text-white" />
                                        </div>
                                        <div className="d-flex flex-column flex-grow-1 min-width-0">
                                            <h6 className="mb-0 text-white fw-semibold text-truncate" title={`${usuarioItem.nombre} (${usuarioItem.usuario})`}>
                                                {usuarioItem.nombre} <span className="text-white-50">({usuarioItem.usuario})</span>
                                            </h6>
                                            <span className="text-white-50 small text-truncate mt-1">
                                                <FaEnvelope className="me-1" /> {usuarioItem.correo}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="crud-card-body p-2 p-md-3 d-flex flex-column">
                                        <div className="optimized-info-grid flex-grow-1">
                                            <div className="info-row-optimized">
                                                <FaKey className="info-icon-optimized text-primary flex-shrink-0" />
                                                <span className="info-text-optimized">
                                                    Contraseña: <span className="text-muted">********</span>
                                                </span>
                                            </div>

                                            <div className="info-row-optimized">
                                                <FaUserShield className="info-icon-optimized text-primary flex-shrink-0" />
                                                <span className="info-text-optimized">
                                                    Perfil: {usuarioItem.id_perfil}
                                                </span>
                                            </div>

                                            <div className="info-row-optimized">
                                                <FaIdCard className="info-icon-optimized text-primary flex-shrink-0" />
                                                <span className="info-text-optimized">
                                                    ID Persona: {usuarioItem.idPersona} {usuarioItem.nombre_persona ? `(${usuarioItem.nombre_persona} ${usuarioItem.apellidos})` : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="crud-card-footer d-flex justify-content-between align-items-center p-2 p-md-3">
                                        <small className="text-muted text-truncate me-2">
                                            <FaCalendarAlt className="me-1" />
                                            {usuarioItem.date_add && new Date(usuarioItem.date_add).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </small>
                                        <div className="d-flex gap-1">
                                            <button
                                                className="crud-btn crud-btn-danger btn-action-optimized"
                                                onClick={() => {
                                                    setShowDeleteModal(true);
                                                    setSelectedUsuario(usuarioItem);
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
                                No hay usuarios registrados
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
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Nombre</th>
                                    <th style={{ width: '20%' }}>Correo</th>
                                    <th style={{ width: '15%' }}>Usuario</th>
                                    <th style={{ width: '10%' }}>Perfil</th>
                                    <th style={{ width: '15%' }}>Fecha Registro</th>
                                    <th style={{ width: '15%' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((usuarioItem) => (
                                        <tr key={usuarioItem.id_usuario}>
                                            <td>
                                                <strong className="d-block text-truncate" style={{ maxWidth: '200px' }} title={usuarioItem.nombre}>
                                                    {usuarioItem.nombre}
                                                </strong>
                                            </td>
                                            <td className="text-truncate" title={usuarioItem.correo}>
                                                {usuarioItem.correo}
                                            </td>
                                            <td>{usuarioItem.usuario}</td>
                                            <td>{usuarioItem.id_perfil}</td>
                                            <td>
                                                {usuarioItem.date_add && new Date(usuarioItem.date_add).toLocaleDateString('es-ES')}
                                            </td>
                                            <td>
                                                <div className="d-flex gap-1 flex-wrap">
                                                    <button
                                                        className="crud-btn btn-danger btn-sm"
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setSelectedUsuario(usuarioItem);
                                                        }}
                                                        title="Eliminar"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No hay usuarios registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <UsuarioCRUD
                formData={{
                    nombre, setNombre,
                    usuario, setUsuario,
                    correo, setCorreo,
                    contrasenia, setContrasenia,
                    idPersona, setIdPersona,
                    id_perfil, setIdPerfil,
                    activo, setActivo,
                    date_add, setDateAdd,
                    date_upt, setDateUpt
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
                selectedUsuario={selectedUsuario}
            />
        </div>
    );
}

export default Usuarios;