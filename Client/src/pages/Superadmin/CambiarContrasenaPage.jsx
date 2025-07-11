import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getUsuario, updateUsuario } from '../../api/Usuarios.api';
import bcrypt from 'bcryptjs';
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import './css/crud-styles.css';

const CambiarContrasenaPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    contraseniaActual: '',
    nuevaContrasenia: '',
    confirmarContrasenia: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  // Estado para controlar la visibilidad de las contraseñas
  const [showPasswords, setShowPasswords] = useState({
    contraseniaActual: false,
    nuevaContrasenia: false,
    confirmarContrasenia: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para alternar la visibilidad de cada campo
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Validaciones básicas
      if (!user?.id_usuario) {
        throw new Error('Usuario no identificado');
      }
      
      if (formData.nuevaContrasenia !== formData.confirmarContrasenia) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (formData.nuevaContrasenia.length < 8) {
        throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
      }

      // Obtener usuario con contraseña actual
      const usuarioActual = await getUsuario(user.id_usuario);
      
      // Verificar contraseña actual
      const esContraseniaValida = await bcrypt.compare(
        formData.contraseniaActual, 
        usuarioActual.contrasenia
      );

      if (!esContraseniaValida) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Verificar que la nueva contraseña no sea igual a la actual
      const esMismaContrasenia = await bcrypt.compare(
        formData.nuevaContrasenia, 
        usuarioActual.contrasenia
      );

      if (esMismaContrasenia) {
        throw new Error('La nueva contraseña no puede ser igual a la actual');
      }

      // Hashear nueva contraseña
      const hashedPassword = await bcrypt.hash(formData.nuevaContrasenia, 10);
      
      // Actualizar contraseña
      await updateUsuario(user.id_usuario, { 
        contrasenia: hashedPassword 
      });
      
      setSuccess('Contraseña cambiada exitosamente');
      setFormData({
        contraseniaActual: '',
        nuevaContrasenia: '',
        confirmarContrasenia: ''
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setError(error.message || 'Ocurrió un error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="container py-4">
        <div className="profile-card shadow-lg">
          <div className="profile-header">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="profile-title mb-0">Cambiar Contraseña</h4>
              <div className="profile-avatar">
                <FaLock />
              </div>
            </div>
          </div>
          
          <div className="profile-body">
            {error && (
              <div className="alert alert-danger alert-message mb-4">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success alert-message mb-4">
                <i className="fas fa-check-circle me-2"></i>
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="profile-info-section mb-4">
                <div className="form-group-custom">
                  <label className="form-label-custom">
                    <i className="fas fa-key me-2"></i>
                    Contraseña actual
                  </label>
                  <div className="password-input-group">
                    <input
                      type={showPasswords.contraseniaActual ? "text" : "password"}
                      className="form-control form-input-custom"
                      name="contraseniaActual"
                      value={formData.contraseniaActual}
                      onChange={handleInputChange}
                      required
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => togglePasswordVisibility('contraseniaActual')}
                    >
                      {showPasswords.contraseniaActual ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group-custom">
                  <label className="form-label-custom">
                    <i className="fas fa-lock me-2"></i>
                    Nueva contraseña
                  </label>
                  <div className="password-input-group">
                    <input
                      type={showPasswords.nuevaContrasenia ? "text" : "password"}
                      className="form-control form-input-custom"
                      name="nuevaContrasenia"
                      value={formData.nuevaContrasenia}
                      onChange={handleInputChange}
                      required
                      minLength="8"
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => togglePasswordVisibility('nuevaContrasenia')}
                    >
                      {showPasswords.nuevaContrasenia ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <small className="text-muted">La contraseña debe tener al menos 8 caracteres</small>
                </div>
                
                <div className="form-group-custom">
                  <label className="form-label-custom">
                    <i className="fas fa-lock me-2"></i>
                    Confirmar nueva contraseña
                  </label>
                  <div className="password-input-group">
                    <input
                      type={showPasswords.confirmarContrasenia ? "text" : "password"}
                      className="form-control form-input-custom"
                      name="confirmarContrasenia"
                      value={formData.confirmarContrasenia}
                      onChange={handleInputChange}
                      required
                      minLength="8"
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn"
                      onClick={() => togglePasswordVisibility('confirmarContrasenia')}
                    >
                      {showPasswords.confirmarContrasenia ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-primary action-button" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Cambiar contraseña
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-5">
              <h5 className="tips-title">
                <i className="fas fa-lightbulb me-2"></i>
                Consejos para una buena contraseña
              </h5>
              <ul className="tips-list">
                <li>Usa al menos 8 caracteres</li>
                <li>Combina letras mayúsculas y minúsculas</li>
                <li>Incluye números y caracteres especiales</li>
                <li>Evita información personal fácil de adivinar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CambiarContrasenaPage;