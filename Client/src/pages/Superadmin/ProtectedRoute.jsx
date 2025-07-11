import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Cargando...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
   if (!allowedRoles.includes(user.id_perfil)) {
        // Redirigir a la página por defecto según el rol
        const defaultRoute = user.id_perfil === 1 ? '/' : '/usuarios';
        return <Navigate to={defaultRoute} replace />;
    }
    
    return children;
};

export default ProtectedRoute;