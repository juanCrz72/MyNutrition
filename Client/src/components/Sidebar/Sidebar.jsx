import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { 
  FaHome, FaUserAlt, FaCog, FaGlobeAmericas, FaUserFriends, 
  FaUtensils, FaCalendarAlt, FaFileAlt, 
  FaShoppingBasket, FaUserShield, FaUsers, FaClipboardCheck,
  FaBoxes, FaChevronDown, FaChevronRight, FaCarrot,
  FaBookMedical, FaWeight, FaFileMedical, FaImages,
  FaAppleAlt, FaFileUpload, FaChartLine
} from 'react-icons/fa';
import './Sidebar.css';
//import './SidebarUser.css';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    { id: 'home', name: 'Inicio', icon: <FaHome />, path: '/', submenu: false },
    
    { 
      id: 'pacientes', 
      name: 'Gestión de Pacientes', 
      icon: <FaUserAlt />,
      submenu: [
        { id: 'personas', name: 'Pacientes', icon: <FaUserFriends />, path: '/personas' },
        { id: 'reportes', name: 'Reportes de Comidas', icon: <FaUtensils />, path: '/reportes' },
        { id: 'dieta', name: 'Dietas', icon: <FaBookMedical />, path: '/dieta' },
        { id: 'personaPlan', name: 'Planes Pacientes', icon: <FaWeight />, path: '/personaPlan' },
        // { id: 'DocumentosPersonas', name: 'Documentos Pacientes', icon: <FaFileMedical />, path: '/DocumentosPersonas' },
        // { id: 'PersonaImage', name: 'Imágenes Pacientes', icon: <FaImages />, path: '/PersonaImage' },
      ]
    },
    
    { 
      id: 'inventario', 
      name: 'Alimentación', 
      icon: <FaShoppingBasket />,
      submenu: [
       // { id: 'Alimentos', name: 'Catálogo de Alimentos', icon: <FaAppleAlt />, path: '/Alimentos' },
         { id: 'Alimentos', name: 'Catálogo de Alimentos', icon: <FaAppleAlt />, path: '/AlimentosImages' },  
/*         { id: 'DocumentosAlimentos', name: 'Documentos Alimentos', icon: <FaFileUpload />, path: '/DocumentosAlimentos' }, 
        { id: 'AlimentosImages', name: 'Imágenes Alimentos', icon: <FaImages />, path: '/AlimentosImages' }
      */ ]
    },

    { 
      id: 'Configuración', 
      name: 'Configuración', 
      icon: <FaCog />,
      submenu: [
        { id: 'Plan', name: 'Planes', icon: <FaChartLine />, path: '/plan' },    
        { id: 'paises', name: 'Países', icon: <FaGlobeAmericas />, path: '/paises' }, 
        { id: 'perfiles', name: 'Perfiles', icon: <FaUserShield />, path: '/perfiles' },
        { id: 'usuarios', name: 'Usuarios', icon: <FaUserAlt />, path: '/GestionUsuarios' },
      ]
    },
  ];

  const toggleMenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}
      
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h3 className="logo">
            <span style={{ color: "#73C883" }}>Nutrition</span> Admin 
          </h3>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <div 
                  className={`menu-item ${expandedMenu === item.id ? 'active' : ''}`}
                  onClick={() => toggleMenu(item.id)}
                  aria-expanded={expandedMenu === item.id}
                  aria-haspopup="true"
                >
                  <div className="menu-icon">{item.icon}</div>
                  {isOpen && <span className="menu-text">{item.name}</span>}
                  {isOpen && (
                    <span className="menu-arrow">
                      {expandedMenu === item.id ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  )}
                </div>
              ) : (
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                  onClick={toggleSidebar}
                >
                  <div className="menu-icon">{item.icon}</div>
                  {isOpen && <span className="menu-text">{item.name}</span>}
                </NavLink>
              )}

              {item.submenu && expandedMenu === item.id && isOpen && (
                <div className="submenu" role="menu">
                  {item.submenu.map((subItem) => (
                    <NavLink 
                      to={subItem.path}
                      key={subItem.id}
                      className="submenu-item"
                      onClick={toggleSidebar}
                    >
                      <div className="submenu-icon">{subItem.icon}</div>
                      <span>{subItem.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;