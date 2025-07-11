import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaLeaf, FaAppleAlt  } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './css/Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({
        usuario: '',
        contrasenia: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('login-page');
        return () => document.body.classList.remove('login-page');
    }, []);

    const handleChange = (e) => {
        setError('');
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const result = await login(credentials);
            if (result.success) {
                // Animación antes de redirigir
                await new Promise(resolve => setTimeout(resolve, 800));
                if (result.user.id_perfil === 1) {
                    navigate('/');
                } else {
                    navigate('/usuarios');
                }
            } else {
                setError(result.message || 'Credenciales incorrectas');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error en login:', error);
            setError('Error al conectar con el servidor');
            setIsLoading(false);
        }
    };

    if (user) {
        if (user.id_perfil === 1) {
            navigate('/');
        } else {
            navigate('/usuarios');
        }
        return null;
    }

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="login-card-container"
            >
                <div className="login-card">
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="brand-header"
                    >
                        <div className="logo-container">
                            <FaLeaf className="logo-icon" />
                            <FaAppleAlt  className="logo-icon secondary" />
                        </div>
                        <h1>My Nutrition</h1>
                        <p>Tu salud en las mejores manos</p>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="error-message"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="login-form">
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="form-group"
                        >
                            <label>
                                <FaUser className="input-icon" />
                                <span>Usuario</span>
                            </label>
                            <input
                                type="text"
                                name="usuario"
                                value={credentials.usuario}
                                onChange={handleChange}
                                required
                                placeholder="usuario@ejemplo.com"
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="form-group"
                        >
                            <label>
                                <FaLock className="input-icon" />
                                <span>Contraseña</span>
                            </label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="contrasenia"
                                    value={credentials.contrasenia}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </motion.div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Recordar sesión
                            </label>
                            <a href="/forgot-password" className="forgot-password">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </motion.button>
                    </form>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="register-link"
                    >
                        ¿No tienes cuenta? <a href="/register">Regístrate ahora</a>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;