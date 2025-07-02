import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const Register = () => {
    const [userData, setUserData] = useState({
        nombre: '',
        usuario: '',
        correo: '',
        contrasenia: '',
        confirmContrasenia: '',
        id_perfil: 2 // Por defecto como usuario normal
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (userData.contrasenia !== userData.confirmContrasenia) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        const { confirmContrasenia, ...dataToSend } = userData;
        
        const result = await register(dataToSend);
        if (result.success) {
            setSuccess('Registro exitoso. Redirigiendo al login...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Registro</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre Completo</label>
                        <input
                            type="text"
                            name="nombre"
                            value={userData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            name="usuario"
                            value={userData.usuario}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            value={userData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group password-group">
                        <label>Contraseña</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="contrasenia"
                                value={userData.contrasenia}
                                onChange={handleChange}
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>
                    <div className="form-group password-group">
                        <label>Confirmar Contraseña</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmContrasenia"
                                value={userData.confirmContrasenia}
                                onChange={handleChange}
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Registrarse
                    </button>
                </form>
                <div className="mt-3">
                    ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
                </div>
            </div>
        </div>
    );
};

export default Register;