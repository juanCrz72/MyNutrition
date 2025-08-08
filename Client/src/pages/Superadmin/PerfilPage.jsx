import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getUsuario, updateUsuario } from '../../api/Usuarios.api';
import { Card, Form, Button, Alert, Spinner, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaUser, FaEdit, FaSave, FaTimes, FaEnvelope, FaIdBadge, FaUserShield, FaHistory, FaCalendarAlt } from 'react-icons/fa';
import './css/crud-styles.css'; // Archivo CSS adicional para estilos personalizados

const PerfilPage = () => {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    correo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const data = await getUsuario(user.id_usuario);
        setUsuario(data);
        setFormData({
          nombre: data.nombre,
          usuario: data.usuario,
          correo: data.correo
        });
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        setError('Error al cargar los datos del perfil');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchUsuario();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const datosActualizacion = {
        nombre: formData.nombre,
        usuario: formData.usuario,
        correo: formData.correo
      };
      
      await updateUsuario(user.id_usuario, datosActualizacion);
      setUsuario(prev => ({ ...prev, ...datosActualizacion }));
      setEditMode(false);
      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setError('Error al actualizar el perfil: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <Container className="d-flex justify-content-center align-items-center loading-container">
        <Spinner animation="grow" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="perfil-page-container py-4">
      <Row className="justify-content-center">
        <Col xl={8} lg={10}>
          <Card className="profile-card shadow-lg">
            <Card.Header className="profile-header">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="profile-avatar me-3">
                    <FaUserShield size={28} />
                  </div>
                  <div>
                    <h2 className="mb-0 profile-title">Mi Perfil</h2>
                    <small className="text-muted">Administra tu información personal</small>
                  </div>
                </div>
                {!editMode && (
                  <Button 
                    variant="primary"
                    className="primary"
                    onClick={() => setEditMode(true)}
                  >
                    <FaEdit className="me-2" /> Editar Perfil
                  </Button>
                )}
              </div>
            </Card.Header>
            
            <Card.Body className="profile-body">
              {error && <Alert variant="danger" className="alert-message">{error}</Alert>}
              {success && <Alert variant="success" className="alert-message">{success}</Alert>}
              
              <Row>
                <Col lg={editMode ? 12 : 6}>
                  {editMode ? (
                    <Form onSubmit={handleSubmit} className="profile-form">
                      <Form.Group className="mb-4 form-group-custom">
                        <Form.Label className="form-label-custom">
                          <FaIdBadge className="me-2" /> Nombre Completo
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                          className="form-input-custom"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-4 form-group-custom">
                        <Form.Label className="form-label-custom">
                          <FaUser className="me-2" /> Nombre de Usuario
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="usuario"
                          value={formData.usuario}
                          onChange={handleInputChange}
                          required
                          className="form-input-custom"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-4 form-group-custom">
                        <Form.Label className="form-label-custom">
                          <FaEnvelope className="me-2" /> Correo Electrónico
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleInputChange}
                          required
                          className="form-input-custom"
                        />
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setEditMode(false)}
                          disabled={loading}
                          className="action-button"
                        >
                          <FaTimes className="me-2" /> Cancelar
                        </Button>
                        <Button 
                          variant="primary" 
                          type="submit"
                          disabled={loading}
                          className="action-button"
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" />
                              <span className="ms-2">Guardando...</span>
                            </>
                          ) : (
                            <>
                              <FaSave className="me-2" /> Guardar Cambios
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div className="profile-info-section">
                      <div className="profile-info-item">
                        <div className="info-icon">
                          <FaIdBadge size={20} />
                        </div>
                        <div className="info-content">
                          <h6 className="info-label">Nombre Completo</h6>
                          <p className="info-value">{usuario.nombre}</p>
                        </div>
                      </div>
                      
                      <div className="profile-info-item">
                        <div className="info-icon">
                          <FaUser size={20} />
                        </div>
                        <div className="info-content">
                          <h6 className="info-label">Nombre de Usuario</h6>
                          <p className="info-value">{usuario.usuario}</p>
                        </div>
                      </div>
                      
                      <div className="profile-info-item">
                        <div className="info-icon">
                          <FaEnvelope size={20} />
                        </div>
                        <div className="info-content">
                          <h6 className="info-label">Correo Electrónico</h6>
                          <p className="info-value">{usuario.correo}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
                
                {!editMode && (
                  <Col lg={6} className="mt-4 mt-lg-0">
                    <Card className="additional-info-card">
                      <Card.Body>
                        <h5 className="additional-info-title">
                          <FaHistory className="me-2" /> Actividad Reciente
                        </h5>
  {/*                       <div className="activity-item">
                          <div className="activity-icon">
                            <FaCalendarAlt />
                          </div>
                          <div className="activity-content">
                            <p className="activity-text">Último inicio de sesión</p>
                            <small className="activity-date">Hoy a las 14:30</small>
                          </div>
                        </div> */}
                        
                        <div className="activity-item">
                        <div className="activity-icon">
                          <FaUserShield />
                        </div>
                        <div className="activity-content">
                          <p className="activity-text">Tipo de cuenta</p>
                          <Badge bg="primary" className="account-badge">
                            {usuario.id_perfil === 1
                              ? "Administrador"
                              : usuario.id_perfil === 2
                              ? "Usuario"
                              : "Desconocido"} {/* opcional para manejar otros casos */}
                          </Badge>
                        </div>
                      </div>

                        
                        <div className="security-tips mt-4">
                          <h6 className="tips-title">Consejos de Seguridad</h6>
                          <ul className="tips-list">
                            <li>Cambia tu contraseña regularmente</li>
                            <li>No compartas tus credenciales</li>
                            <li>Cierra sesión cuando no uses el sistema</li>
                          </ul>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PerfilPage;