import { FaSearch, FaBell, FaUserCircle, FaBars } from 'react-icons/fa';
import './Navbar.css'; // Tus estilos personalizados se mantienen
import PropTypes from 'prop-types';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar-custom"> {/* Clase personalizada */}
      {/* --- SECCIÓN IZQUIERDA --- */}
      <div className="navbar-left">
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label="Alternar menú"
        >
          <FaBars />
        </button>

    {/*     <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar pacientes, citas, ventas..." 
          />
        </div> */}
      </div>

      {/* --- SECCIÓN DERECHA --- */}
      <div className="navbar-right">
       {/*  <div className="notifications">
          <FaBell />
          <span className="badge">3</span>
        </div> */}

        <div className="user-profile">
          <FaUserCircle className="user-avatar" />
          <span className="user-name">Ana Lopez</span>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;