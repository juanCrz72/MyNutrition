import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './pages/Superadmin/AuthContext.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
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

    return (
        <div className="app">
            {/* Mostrar Navbar excepto en rutas específicas */}
            {!shouldHideLayout && (
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            )}
            
            <div className="app-container">
                {/* Mostrar Sidebar para admin (rol 1) en rutas permitidas */}
                {!shouldHideLayout && user?.id_perfil === 1 && (
                    <Sidebar isOpen={sidebarOpen} />
                )}
                
                {/* Ajustar el contenido principal */}
                <main className={`main-content ${
                    sidebarOpen && user?.id_perfil === 1 && !shouldHideLayout 
                        ? 'with-sidebar' 
                        : 'full-width'
                }`}>
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