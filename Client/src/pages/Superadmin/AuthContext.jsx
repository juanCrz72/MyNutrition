// AuthContext.jsx
//import { BASE_URL } from '../../api/config.js'; 

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../api/config.js'; 

const AuthContext = createContext(null); // Inicializa con null

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const login = async (credentials) => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, credentials);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            return { success: true, user: res.data.user };
        } catch (error) {
            console.error('Error en login:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error en el inicio de sesión' 
            };
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/register`, userData);
            return { success: true, data: res.data };
        } catch (error) {
            console.error('Error en registro:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error en el registro' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    // Verificar token al cargar
    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (token) {
                    const res = await axios.get(`${BASE_URL}/auth/verify`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data.user);
                }
            } catch (error) {
                console.error('Error verificando token:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };
        
        verifyToken();
    }, [token]);

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};