import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { 
  FaHome, FaAddressBook, FaCog, FaGlobeAmericas, FaUsersCog, 
  FaFlask, FaCalendarAlt, FaFileInvoiceDollar, 
  FaShoppingCart, FaUserMd, FaUsers, FaClipboardList,
  FaBoxes, FaChevronDown, FaChevronRight, FaCarrot 
} from 'react-icons/fa';
import './Sidebar.css';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    // { id: 'home', name: 'Home', icon: <FaHome />, path: '/home', submenu: false },
     { id: 'home', name: 'Home', icon: <FaHome />, path: '/', submenu: false },

    { 
      id: 'pacientes', 
      name: 'Gestión de Pacientes', 
      icon: <FaAddressBook />,
      submenu: [
        { id: 'pacientes', name: 'Pacientes', icon: <FaUsersCog />, path: '/pacientes' },
        { id: 'recetas', name: 'Registro de Comidas', icon: <FaClipboardList />, path: '/receta' },
       /*  { id: 'gestionPacientes', name: 'Gestión Pacientes', icon: <FaClipboardList />, path: '/gestionPacientes' } */
      ]
    },
    

    { 
      id: 'inventario', 
      name: 'Alimentación', 
      icon: <FaBoxes />,
      submenu: [
        { id: 'inventario', name: 'Catálogo de Alimentos', icon: <FaCarrot  />, path: '/inventario' }
      ]
    },

    { 
      id: 'Configuración', 
      name: 'Configuración', 
      icon: <FaCog />,
      submenu: [
      { id: 'listaPrecios', name: 'Planes', icon: <FaClipboardList  />, path: '/precios' },    
      { id: 'paises', name: 'Países', icon: <FaGlobeAmericas  />, path: '/paises' }
        //{ id: 'paqueteDetalle', name: 'Paquetes Detalles', icon: <FaBoxes />, path: '/paqueteDetalle' }, 
      ]
    },



  ];

  const toggleMenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3 className="logo">
          <span className="text-primary">Nutrition</span> Admin 
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
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
