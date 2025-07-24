import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './pages/Superadmin/AuthContext.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import SidebarAdmin from './components/Sidebar/Sidebar.jsx'; // Renombra tu sidebar actual
import SidebarUser from './components/Sidebar/SidebarUser.jsx';
import AppRoutes from './App.Routes.jsx';
import './App.css';

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const { user, loading } = useAuth();

    // Rutas que no deben mostrar el layout completo
    const hideLayoutRoutes = ['/login', '/register'];
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return <div className="loading-screen">Cargando...</div>;
    }

    // Determinar qué sidebar mostrar según el rol
    const renderSidebar = () => {
        if (shouldHideLayout) return null;
        
        switch(user?.id_perfil) {
            case 1: // Admin
                return <SidebarAdmin isOpen={sidebarOpen} />;
            case 2: // Usuario normal (ajusta según tus roles)
                return <SidebarUser isOpen={sidebarOpen} />;
            // Agrega más casos según necesites
            default:
                return null;
        }
    };

    // Determinar clases del contenido principal
    const getMainContentClass = () => {
        if (shouldHideLayout) return 'full-width';
        if (!user) return 'full-width';
        
        return sidebarOpen ? 'with-sidebar' : 'full-width';
    };

    return (
        <div className="app">
            {/* Mostrar Navbar excepto en rutas específicas */}
            {!shouldHideLayout && (
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            )}
            
            <div className="app-container">
                {/* Mostrar el sidebar correspondiente */}
                {renderSidebar()}
                
                {/* Ajustar el contenido principal */}
                <main className={`main-content ${getMainContentClass()}`}>
                    <AppRoutes />
                </main>
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppLayout />
        </AuthProvider>
    );
}

export default App;