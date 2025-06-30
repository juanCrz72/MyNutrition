import React, { useState, useEffect } from 'react';
import {
  getPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona
} from '../../api/PersonaImage.api.js';
import { getPaises } from "../../api/Paises.api.js";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaIdCard, FaCalendarAlt } from "react-icons/fa";

const PersonaManager = () => {
  const [personas, setPersonas] = useState([]);
  const [paises, setPaises] = useState([]);
  const [loadingPaises, setLoadingPaises] = useState(false);
  const [errorPaises, setErrorPaises] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    sexo: 'M',
    edad: '',
    altura: '',
    peso: '',
    img_perfil: '',
    tipo_persona: 0,
    idPais: '',
    idPlan: 0,
    activo: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar personas y países al montar el componente
  useEffect(() => {
    loadPersonas();
    cargarPaises();
  }, []);

  const cargarPaises = async () => {
    try {
      setLoadingPaises(true);
      setErrorPaises(null);
      const response = await getPaises();
      
      // Verificar si la respuesta es un array
      if (Array.isArray(response)) {
        setPaises(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setPaises(response.data);
      } else {
        setErrorPaises("Formato de datos no válido");
        console.error("La respuesta de países no contiene un array válido:", response);
      }
    } catch (error) {
      setErrorPaises("Error al cargar los países");
      console.error("Error al cargar países:", error);
    } finally {
      setLoadingPaises(false);
    }
  };

  const loadPersonas = async () => {
    setIsLoading(true);
    try {
      const response = await getPersonas();
      setPersonas(response.data);
    } catch (err) {
      setError('Error al cargar personas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    // Si cambia la fecha de nacimiento, calcular la edad automáticamente
    if (name === 'fecha_nacimiento') {
      const age = calculateAge(value);
      newFormData.edad = age;
    }
    
    setFormData(newFormData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
    setFormData({
      ...formData,
      img_perfil: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const personaData = {
        ...formData,
        image: image
      };

      if (editingId) {
        await updatePersona(editingId, personaData);
      } else {
        await createPersona(personaData);
      }

      resetForm();
      loadPersonas();
    } catch (err) {
      setError('Error al guardar persona');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

    const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const handleEdit = async (id) => {
    setIsLoading(true);
    try {
      const response = await getPersonaById(id);
      const persona = response.data;
      
      setFormData({
        nombre: persona.nombre,
        apellidos: persona.apellidos,
        fecha_nacimiento: formatDateForInput(persona.fecha_nacimiento) || '',
        sexo: persona.sexo,
        edad: persona.edad || calculateAge(persona.fecha_nacimiento),
        altura: persona.altura,
        peso: persona.peso,
        img_perfil: persona.img_perfil || '',
        tipo_persona: persona.tipo_persona,
        idPais: persona.idPais,
        idPlan: persona.idPlan,
        activo: persona.activo
      });

      if (persona.img_perfil) {
        setImagePreview(persona.img_perfil);
      } else {
        setImagePreview('');
      }

      setEditingId(id);
    } catch (err) {
      setError('Error al cargar persona para editar');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta persona?')) {
      setIsLoading(true);
      try {
        await deletePersona(id);
        loadPersonas();
      } catch (err) {
        setError('Error al eliminar persona');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellidos: '',
      fecha_nacimiento: '',
      sexo: 'M',
      edad: '',
      altura: '',
      peso: '',
      img_perfil: '',
      tipo_persona: 0,
      idPais: '',
      idPlan: 0,
      activo: 1
    });
    setEditingId(null);
    setImage(null);
    setImagePreview('');
    setError('');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Personas</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {errorPaises && <div className="alert alert-danger">{errorPaises}</div>}
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">{editingId ? 'Editar Persona' : 'Agregar Nueva Persona'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Apellidos *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                    />
                    <small className="text-muted">Si ingresa fecha, se calculará automáticamente la edad</small>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Edad *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="edad"
                      value={formData.edad}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Sexo *</label>
                    <select
                      className="form-select"
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">País *</label>
                    <select
                      className="form-select"
                      name="idPais"
                      value={formData.idPais}
                      onChange={handleInputChange}
                      required
                      disabled={loadingPaises}
                    >
                      <option value="">Seleccione un país</option>
                      {paises.map((pais) => (
                        <option key={pais.idPais} value={pais.idPais}>
                          {pais.nombre_pais}
                        </option>
                      ))}
                    </select>
                    {loadingPaises && <small className="text-muted">Cargando países...</small>}
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Altura (cm) *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="altura"
                      value={formData.altura}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Peso (kg) *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="peso"
                      value={formData.peso}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Imagen de Perfil</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2 d-flex align-items-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="img-thumbnail"
                        style={{ width: '80px', height: '80px' }} 
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={handleRemoveImage}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mb-3 form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="activo"
                    role="switch"
                    checked={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: e.target.checked ? 1 : 0})}
                  />
                  <label className="form-check-label">Activo</label>
                </div>
                
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Guardando...
                      </>
                    ) : 'Guardar'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Lista de Personas</h3>
            </div>
            <div className="card-body">
              {isLoading && !personas.length ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Edad</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personas.map((persona) => (
                        <tr key={persona.idpersona}>
                          <td>
                            {persona.img_perfil ? (
                              <img 
                                src={persona.img_perfil} 
                                alt={`${persona.nombre} ${persona.apellidos}`}
                                className="rounded-circle"
                                style={{ 
                                  width: '40px', 
                                  height: '40px',
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <div 
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  backgroundColor: '#f0f0f0'
                                }}
                              >
                                <i className="bi bi-person text-secondary"></i>
                              </div>
                            )}
                          </td>
                          <td>{persona.nombre}</td>
                          <td>{persona.apellidos}</td>
                          <td>{persona.edad}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEdit(persona.idpersona)}
                              >
                                <i className="bi bi-pencil">
                                     <FaEdit />
                                </i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(persona.idpersona)}
                              >
                                <i className="bi bi-trash">
                                    <FaTrash />
                                </i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaManager;