import { useState } from 'react';
import { AuthProvider } from './pages/Superadmin/AuthContext.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import AppRoutes from './App.Routes.jsx';
import './App.css';

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <AuthProvider>
            <div className="app">
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="app-container">
                    <Sidebar isOpen={sidebarOpen} />
                    <main className={`main-content ${sidebarOpen ? '' : 'full-width'}`}>
                        <AppRoutes />
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}

export default App;