import React, { useState, useEffect } from 'react';
import { useAuth } from '../Superadmin/AuthContext.jsx';
import { 
  FaFileUpload, FaTimes, FaTrash, FaPlus, FaSpinner, 
  FaImage, FaFilePdf, FaFileWord, FaCalendarAlt
} from 'react-icons/fa';
import { 
  Alert, Spinner, Button, Modal, Badge, 
  ProgressBar, Tab, Tabs, Toast, ToastContainer 
} from 'react-bootstrap';
import {
  subirImagenPersona,
  obtenerImagenPersona,
  eliminarImagenPorId
} from '../../api/DocumentosPersonas.api.js';
import './css/Estilos.css';

const PersonaDocumentosUser = () => {
  const { user } = useAuth();
  const [imagenes, setImagenes] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [showSubirModal, setShowSubirModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('todas');
  const [showToast, setShowToast] = useState(false);

  // Cargar imágenes al montar el componente
  useEffect(() => {
    if (user?.idPersona) {
      cargarImagenes();
    }
  }, [user]);

  // Cargar imágenes del usuario
  const cargarImagenes = async () => {
    setLoading(true);
    try {
      const response = await obtenerImagenPersona(user.idPersona);
      const imagenesOrdenadas = Array.isArray(response) ? response : (response.data || []);
      imagenesOrdenadas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setImagenes(imagenesOrdenadas);
      setMensaje({ texto: '', tipo: '' });
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
      setMensaje({ 
        texto: 'Error al cargar tus fotos de seguimiento', 
        tipo: 'danger' 
      });
      setImagenes([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejar subida de imagen con progreso
  const handleSubirImagen = async (e) => {
    e.preventDefault();
    if (!archivo || !user?.idPersona) {
      setMensaje({ texto: 'Por favor, selecciona una foto', tipo: 'warning' });
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      await subirImagenPersona(user.idPersona, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      setMensaje({ texto: '¡Foto subida correctamente!', tipo: 'success' });
      setShowToast(true);
      setArchivo(null);
      setShowSubirModal(false);
      await cargarImagenes();
    } catch (error) {
      setMensaje({ 
        texto: error.response?.data?.message || 'Error al subir la foto', 
        tipo: 'danger' 
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Manejar eliminación de imagen
  const handleEliminarImagen = async (idImagen) => {
    setImageToDelete(idImagen);
    setShowConfirmDelete(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;
    
    setLoading(true);
    try {
      await eliminarImagenPorId(imageToDelete);
      setImagenes(prev => prev.filter(img => img.id !== imageToDelete));
      setMensaje({ texto: 'Foto eliminada correctamente.', tipo: 'success' });
      setShowToast(true);
    } catch (err) {
      console.error('Error al eliminar imagen:', err);
      setMensaje({ 
        texto: err.message || 'Error al eliminar la foto.', 
        tipo: 'danger' 
      });
    } finally {
      setLoading(false);
      setShowConfirmDelete(false);
      setImageToDelete(null);
    }
  };

  // Filtrar imágenes por tipo
  const imagenesFiltradas = imagenes.filter(img => {
    if (activeTab === 'todas') return true;
    if (activeTab === 'imagenes') return img.localizacion.match(/\.(jpg|jpeg|png|gif)$/i);
    if (activeTab === 'documentos') return img.localizacion.match(/\.(pdf|doc|docx)$/i);
    return true;
  });

  // Obtener icono según tipo de archivo
  const getFileIcon = (fileName) => {
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return <FaImage className="text-primary" />;
    if (fileName.match(/\.pdf$/i)) return <FaFilePdf className="text-danger" />;
    if (fileName.match(/\.(doc|docx)$/i)) return <FaFileWord className="text-primary" />;
    return <FaFileUpload className="text-secondary" />;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="documentos-container">
      <div className="documentos-header">
        <h1 className="documentos-title">
          <FaImage className="me-2" /> Mi Progreso Fotográfico
        </h1>
        <p className="documentos-subtitle">
          Registra tu evolución física con fotos periódicas para que tu nutrióloga pueda hacer un mejor seguimiento.
        </p>
      </div>

      {/* Notificaciones Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={5000} 
          autohide
          bg={mensaje.tipo}
        >
          <Toast.Header>
            <strong className="me-auto">Notificación</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{mensaje.texto}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Panel de control */}
      <div className="documentos-control-panel">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div className="mb-3 mb-md-0">
            <Badge bg="light" text="dark" className="p-2 user-badge">
              ID de Seguimiento: <strong>{user?.idPersona}</strong>
            </Badge>
          </div>
          <Button
            variant="success"
            onClick={() => setShowSubirModal(true)}
            className="upload-button"
          >
            <FaPlus className="me-2" /> Agregar Foto
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 documentos-tabs"
        >
          <Tab eventKey="todas" title="Todas" />
          <Tab eventKey="imagenes" title="Fotos" />
          <Tab eventKey="documentos" title="Documentos" />
        </Tabs>
      </div>

      {/* Contenido principal */}
      <div className="documentos-content">
        {loading && !imagenes.length ? (
          <div className="text-center py-5 loading-spinner">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando tu historial fotográfico...</p>
          </div>
        ) : (
          <>
            {imagenesFiltradas.length > 0 ? (
              <div className="gallery-grid">
                {imagenesFiltradas.map((img) => (
                  <div key={img.id} className="gallery-card">
                    <div className="gallery-card-header">
                      <div className="file-icon">
                        {getFileIcon(img.localizacion)}
                      </div>
                      <h6 className="file-title">
                        {img.nombre_original.length > 20 
                          ? `${img.nombre_original.substring(0, 15)}...${img.localizacion.split('.').pop()}`
                          : img.nombre_original}
                      </h6>
                      <button
                        className="btn btn-sm btn-danger delete-btn"
                        onClick={() => handleEliminarImagen(img.id)}
                        disabled={loading}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="gallery-card-body">
                      {img.localizacion.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img
                          src={`/${img.localizacion}`}
                          className="img-fluid gallery-image"
                          alt={`Progreso ${formatDate(img.createdAt)}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/no-image.png';
                          }}
                        />
                      ) : (
                        <div className="document-preview">
                          {getFileIcon(img.localizacion)}
                          <Badge bg="info" className="mt-2 file-badge">
                            {img.localizacion.split('.').pop().toUpperCase()}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="gallery-card-footer">
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        {formatDate(img.createdAt)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-gallery">
                <FaImage size={48} className="mb-3 text-muted" />
                <h4>No hay {activeTab === 'todas' ? 'archivos' : activeTab} registrados</h4>
                <p className="text-muted">
                  {activeTab === 'todas' 
                    ? 'Comienza tu registro fotográfico subiendo tu primera foto.' 
                    : `No tienes ${activeTab} subidos aún.`}
                </p>
                <Button 
                  variant="primary"
                  onClick={() => setShowSubirModal(true)}
                >
                  <FaPlus className="me-2" /> Subir {activeTab === 'documentos' ? 'Documento' : 'Foto'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal para subir imágenes */}
      <Modal 
        show={showSubirModal} 
        onHide={() => {
          setShowSubirModal(false);
          setArchivo(null);
          setUploadProgress(0);
        }}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileUpload className="me-2" /> Subir Foto de Progreso
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubirImagen}>
            <div className="upload-instructions mb-4">
              <h6>Instrucciones para fotos de seguimiento:</h6>
              <ul>
                <li>Usa fondo claro y buena iluminación</li>
                <li>Toma la foto siempre en el mismo ángulo</li>
                <li>Usa ropa ajustada o deportiva para mejor evaluación</li>
                <li>Sube fotos periódicamente (ej. cada 2 semanas)</li>
              </ul>
            </div>
            
            <div className="mb-3">
              <label htmlFor="documentoFile" className="form-label">
                Seleccionar foto (formatos: JPG, PNG)
              </label>
              <div className="file-upload-wrapper">
                <input
                  className="form-control"
                  type="file"
                  id="documentoFile"
                  accept="image/*"
                  onChange={(e) => setArchivo(e.target.files[0])}
                  required
                />
              </div>
            </div>
            
            {archivo && (
              <div className="file-preview mb-3">
                <div className="d-flex align-items-center">
                  {getFileIcon(archivo.name)}
                  <span className="ms-2">{archivo.name}</span>
                </div>
                <small className="text-muted">
                  Tamaño: {(archivo.size / 1024 / 1024).toFixed(2)} MB
                </small>
              </div>
            )}
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-3">
                <ProgressBar 
                  now={uploadProgress} 
                  label={`${uploadProgress}%`} 
                  animated 
                />
                <small className="text-muted">Subiendo tu foto...</small>
              </div>
            )}
            
            {mensaje.texto && (
              <Alert variant={mensaje.tipo} className="mt-3">
                {mensaje.texto}
              </Alert>
            )}
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowSubirModal(false);
                  setArchivo(null);
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !archivo}
              >
                {loading ? (
                  <>
                    <FaSpinner className="fa-spin me-2" />
                    {uploadProgress > 0 ? 'Subiendo...' : 'Procesando...'}
                  </>
                ) : (
                  'Subir Foto'
                )}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal 
        show={showConfirmDelete} 
        onHide={() => setShowConfirmDelete(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-warning d-flex align-items-center">
            <FaTimes className="me-2 flex-shrink-0" />
            <div>
              ¿Estás seguro de eliminar esta foto de tu progreso?
              <p className="mb-0 mt-1">
                <small>Esta acción no se puede deshacer y perderás este registro.</small>
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowConfirmDelete(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteImage} 
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="fa-spin me-2" />
                Eliminando...
              </>
            ) : (
              'Sí, Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PersonaDocumentosUser;