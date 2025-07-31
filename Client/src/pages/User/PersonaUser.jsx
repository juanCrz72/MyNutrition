import React, { useState, useEffect } from 'react';
import {
  getPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona
} from '../../api/PersonaImage.api.js';
import { getPaises } from "../../api/Paises.api.js";
import { FaUser, FaGlobe, FaVenusMars, FaRulerVertical, FaWeight, FaCalendarAlt, FaCamera, FaTimes, FaCheck } from "react-icons/fa";
import { useAuth } from '../Superadmin/AuthContext.jsx';
import './css/Estilos.css';

const PersonaManager = () => {
  const { user } = useAuth();
  const [personas, setPersonas] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
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
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPersonas();
    cargarPaises();
  }, []);

  useEffect(() => {
    if (user?.idPersona && personas.length > 0) {
      const filtered = personas.filter(p => p.idpersona === user.idPersona);
      setFilteredPersonas(filtered);
      if (filtered.length > 0 && !editingId) {
        handleEdit(user.idPersona);
      }
    }
  }, [user, personas]);

  const cargarPaises = async () => {
    try {
      setLoadingPaises(true);
      setErrorPaises(null);
      const response = await getPaises();
      
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
    setError('');
    setSuccess('');
    
    try {
      const personaData = {
        ...formData,
        image: image
      };

      if (editingId) {
        await updatePersona(editingId, personaData);
        setSuccess('Tus cambios se han guardado correctamente');
      } else {
        await createPersona(personaData);
      }

      loadPersonas();
    } catch (err) {
      setError('Error al guardar los cambios. Por favor intenta nuevamente.');
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
    if (id !== user?.idPersona) {
      setError('Solo puedes editar tu propia información');
      return;
    }

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
      setError('Error al cargar información para editar');
      console.error(err);
    } finally {
      setIsLoading(false);
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
    setSuccess('');
  };

  return (
    <div className="user-dashboard">
      <div className="profile-edit-container animate-fade-in">
        <div className="dashboard-header">
          <div className="welcome-section">
            <div className="welcome-message">
              <h1>Editar <span className="highlight-text">Perfil</span></h1>
              <p className="subtitle">Actualiza tu información personal</p>
            </div>
          </div>
        </div>

        {/* Eliminamos el contenedor card y dejamos el contenido directo */}
        <div className="profile-picture-section">
          <div className="avatar-container">
            {imagePreview ? (
              <div className="avatar-with-badge">
                <img 
                  src={imagePreview} 
                  alt="Perfil" 
                  className="profile-avatar"
                />
                <button 
                  className="change-photo-btn"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <FaCamera />
                </button>
              </div>
            ) : (
              <div className="avatar-placeholder">
                <FaUser size={24} />
                <button 
                  className="change-photo-btn"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <FaCamera />
                </button>
              </div>
            )}
            <input 
              id="fileInput"
              type="file" 
              className="d-none" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {imagePreview && (
            <button 
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={handleRemoveImage}
            >
              <FaTimes className="me-1" /> Eliminar foto
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger mb-4 mx-3 mx-md-0">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4 mx-3 mx-md-0">
            <FaCheck className="me-2" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form px-3 px-md-0">
          <div className="row">
            <div className="col-12 mb-3">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <FaUser className="me-2" /> Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="col-12 mb-3">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <FaUser className="me-2" /> Apellidos
                </label>
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
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <FaCalendarAlt className="me-2" /> Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                />
                <small className="text-muted">Se calculará automáticamente la edad</small>
              </div>
            </div>
            
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <FaUser className="me-2" /> Edad
                </label>
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
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <FaVenusMars className="me-2" /> Sexo
                </label>
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
            </div>
            
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <FaGlobe className="me-2" /> País
                </label>
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
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <FaRulerVertical className="me-2" /> Altura (cm)
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="altura"
                  value={formData.altura}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6 mb-3">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <FaWeight className="me-2" /> Peso (kg)
                </label>
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
          </div>
          
          <div className="form-group form-check form-switch mb-4 px-3">
            <input
              type="checkbox"
              className="form-check-input"
              name="activo"
              role="switch"
              checked={formData.activo}
              onChange={(e) => setFormData({...formData, activo: e.target.checked ? 1 : 0})}
            />
            <label className="form-check-label">Perfil activo</label>
          </div>
          
          <div className="d-flex justify-content-end gap-3 px-3 px-md-0 mb-4">
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={resetForm}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary action-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Guardando...
                </>
              ) : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .profile-edit-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0;
        }
        
        .dashboard-header {
          padding: 1.5rem 1rem 0;
        }
        
        .profile-picture-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1.5rem 0;
          padding: 0 1rem;
        }
        
        .avatar-container {
          position: relative;
          margin-bottom: 1rem;
        }
        
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 2.5rem;
          border: 3px solid #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .avatar-with-badge {
          position: relative;
        }
        
        .change-photo-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .change-photo-btn:hover {
          background: #2980b9;
          transform: scale(1.1);
        }
        
        .profile-form {
          width: 100%;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .form-control, .form-select {
          border-radius: 10px;
          padding: 12px 15px;
          border: 1px solid #dfe6e9;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 0.25rem rgba(52, 152, 219, 0.25);
        }
        
        .form-check-input:checked {
          background-color: #3498db;
          border-color: #3498db;
        }
        
        .btn-primary {
          background-color: #3498db;
          border-color: #3498db;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 600;
        }
        
        .btn-primary:hover {
          background-color: #2980b9;
          border-color: #2980b9;
        }
        
        .btn-outline-secondary {
          border-radius: 10px;
          padding: 10px 24px;
          font-weight: 600;
        }
        
        @media (min-width: 768px) {
          .profile-edit-container {
            padding: 2rem 1rem;
          }
          
          .dashboard-header {
            padding: 0 0 1.5rem;
          }
          
          .profile-form {
            padding: 0;
          }
          
          .form-check.form-switch {
            padding-left: 0;
          }
        }
        
        @media (max-width: 767px) {
          .profile-avatar, .avatar-placeholder {
            width: 100px;
            height: 100px;
          }
          
          .row {
            margin-left: -0.5rem;
            margin-right: -0.5rem;
          }
          
          .col-md-6, .col-12 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .btn {
            width: 100%;
            margin-bottom: 0.5rem;
          }
          
          .d-flex.justify-content-end {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default PersonaManager;