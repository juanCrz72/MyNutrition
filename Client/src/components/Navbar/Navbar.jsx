import { FaSearch, FaBell, FaUserCircle, FaBars, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';
import PropTypes from 'prop-types';
import { useAuth } from '../../pages/Superadmin/AuthContext.jsx'; // Asegúrate que la ruta sea correcta

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar-custom">
      {/* --- SECCIÓN IZQUIERDA --- */}
      <div className="navbar-left">
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label="Alternar menú"
        >
          <FaBars />
        </button>

        {/* Opcional: Barra de búsqueda */}
        {/* <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar pacientes, citas, ventas..." 
          />
        </div> */}
      </div>

      {/* --- SECCIÓN DERECHA --- */}
      <div className="navbar-right">
        {/* Opcional: Notificaciones */}
        {/* <div className="notifications">
          <FaBell />
          <span className="badge">3</span>
        </div> */}

        <div className="user-profile">
          <FaUserCircle className="user-avatar" />
          <span className="user-name">
            {user ? user.nombre : 'Usuario no autenticado'}
          </span>
          
          {/* Menú desplegable o botón de logout */}
          <div className="user-dropdown">
            <button 
              className="logout-button"
              onClick={logout}
              aria-label="Cerrar sesión"
            >
              <FaSignOutAlt /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;