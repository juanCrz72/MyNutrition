import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const Login = () => {
    const [credentials, setCredentials] = useState({
        usuario: '',
        contrasenia: ''
    });
    const [error, setError] = useState('');
    const { login, user, logout } = useAuth(); // Añadimos user y logout del contexto
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const result = await login(credentials);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setError('Error al conectar con el servidor');
        }
    };

    const handleLogout = () => {
        logout();
        setCredentials({ usuario: '', contrasenia: '' });
    };

    return (
        <div className="login-container">
            {/* Mostrar información de sesión si está logueado */}
            {user ? (
                <div className="session-info">
                    <div className="user-badge">
                        <span>Sesión iniciada como: <strong>{user.usuario}</strong></span>
                        <button 
                            onClick={handleLogout} 
                            className="btn btn-sm btn-danger"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                    <div className="alert alert-info mt-3">
                        Ya tienes una sesión activa. ¿Quieres <a href="/">ir al inicio</a>?
                    </div>
                </div>
            ) : (
                <>
                    <div className="no-session-alert">
                        No hay sesión iniciada
                    </div>
                    <div className="login-card">
                        <h2>Iniciar Sesión</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    name="usuario"
                                    value={credentials.usuario}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    name="contrasenia"
                                    value={credentials.contrasenia}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Ingresar
                            </button>
                        </form>
                        <div className="mt-3">
                            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Login;