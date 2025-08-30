import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaHome, FaUserAlt, FaHeartbeat, FaUtensils, 
  FaChartLine, FaBook, FaUser, FaClipboardList, 
  FaChevronRight, FaChevronDown, FaPlus, FaCreditCard, FaUsers,
  FaApple, FaImages
} from 'react-icons/fa';
import { IoIosFitness, IoMdNutrition } from 'react-icons/io';
import { GiMeal } from 'react-icons/gi';
import './SidebarUser.css';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [activeItem, setActiveItem] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const active = menuItems.find(item => 
      item.path === currentPath || 
      (item.submenu && item.submenu.some(sub => sub.path === currentPath))
    );
    if (active) setActiveItem(active.id);
  }, [location]);

  const menuItems = [
    { 
      id: 'home', 
      name: 'Inicio', 
      icon: <FaHome className="nav-icon" />, 
      activeIcon: <FaHome className="nav-icon active-nav-icon" />,
      path: '/usuarios', 
      submenu: false 
    },
    { 
      id: 'plan', 
      name: 'Plan de suscripción', 
      icon: <FaCreditCard className="nav-icon" />,
      activeIcon: <FaCreditCard className="nav-icon active-nav-icon" />,
      path: '/planUser',
      submenu: false
    },
    { 
      id: 'salud', 
      name: 'Salud', 
      icon: <FaHeartbeat className="nav-icon" />,
      activeIcon: <IoIosFitness className="nav-icon active-nav-icon" />,
      path: '/vistaCuestionario',
      submenu: [
        { id: 'cuestionario', name: 'Cuestionario', icon: <FaClipboardList />, path: '/vistaCuestionario' },
      ]
    },
    { 
      id: 'dieta', 
      name: 'Dieta', 
      icon: <FaUtensils className="nav-icon" />,
      activeIcon: <GiMeal className="nav-icon active-nav-icon" />,
      path: '/dietaUser',
      submenu: [
        { id: 'plan-alimentacion', name: 'Mi plan', icon: <IoMdNutrition />, path: '/dietaUser' },
        //{ id: 'seguimiento', name: 'Seguimiento', icon: <FaChartLine />, path: '/seguimiento-dieta' },
      ]
    },
    { 
      id: 'documentos', 
      name: 'Fotos/Documentos', 
      icon: <FaImages className="nav-icon" />,
      activeIcon: <FaImages className="nav-icon active-nav-icon" />,
      path: '/DocumentosUser',
      submenu: false
    },
    { 
      id: 'perfil', 
      name: 'Perfil', 
      icon: <FaUser className="nav-icon" />,
      activeIcon: <FaUser className="nav-icon active-nav-icon" />,
      path: '/PersonaUser',
      submenu: [
        { id: 'mi-perfil', name: 'Mi perfil', icon: <FaUser />, path: '/perfil' },
        { id: 'datos', name: 'Mis datos', icon: <FaUsers />, path: '/PersonaUser' },
      ]
    }
  ];

  // Mobile only items (direct access)
  const mobileItems = [
    ...menuItems.slice(0, 3), // Primeros 3 elementos
    { 
      id: 'bitacora', 
      name: '', 
      icon: <div className="add-post-btn"><FaBook /></div>,
      path: '/bitacoraUser',
      submenu: false,
      special: true,
      mobileOnly: true
    },
    ...menuItems.slice(3) // Resto de elementos (excluyendo bitácora original)
  ];

  const toggleMenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
    setActiveItem(menuId);
  };

  if (isMobile) {
    return (
      <div className="mobile-nav-bar">
        {mobileItems.map((item, index) => {
          if (item.special) {
            return (
              <div key={item.id} className="mobile-nav-btn special-btn">
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                </NavLink>
              </div>
            );
          }
          
          if (item.submenu) {
            return (
              <div key={item.id} className="mobile-nav-btn">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveItem(item.id)}
                >
                  {activeItem === item.id ? item.activeIcon : item.icon}
                </NavLink>
              </div>
            );
          }
          
          return (
            <div key={item.id} className="mobile-nav-btn">
              <NavLink 
                to={item.path}
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
              >
                {activeItem === item.id ? item.activeIcon : item.icon}
              </NavLink>
            </div>
          );
        })}
      </div>
    );
  }

  // Versión de escritorio (se mantiene igual)
  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={toggleSidebar}
        />
      )}
      
      <div className={`navigation-panel ${isOpen ? 'open' : 'closed'}`}>
        <div className="panel-header">
          <h3 className="brand-logo">
            {isOpen ? (
              <span style={{ color: "#35b0ab" , fontSize: '1.4rem' }}>Nutrition Concierge</span>
            ) : (
              <FaApple style={{ color: "#35b0ab", fontSize: '1.8rem' }} />
            )}
          </h3>
        </div>

        <nav className="panel-menu">
          {[...menuItems, 
            { 
              id: 'bitacora', 
              name: 'Bitácora', 
              icon: <FaBook className="nav-icon" />,
              activeIcon: <FaBook className="nav-icon active-nav-icon" />,
              path: '/bitacoraUser',
              submenu: false
            }
          ].map((item) => (
            <div key={item.id} className="nav-item-wrapper">
              {item.submenu ? (
                <>
                  <div 
                    className={`nav-btn ${expandedMenu === item.id ? 'active' : ''} ${activeItem === item.id ? 'highlight' : ''}`}
                    onClick={() => toggleMenu(item.id)}
                  >
                    <div className="icon-wrapper">
                      {activeItem === item.id ? item.activeIcon : item.icon}
                    </div>
                    {isOpen && <span className="nav-label">{item.name}</span>}
                    {isOpen && item.submenu && (
                      <span className="dropdown-arrow">
                        {expandedMenu === item.id ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    )}
                  </div>

                  {item.submenu && expandedMenu === item.id && isOpen && (
                    <div className="submenu-container">
                      {item.submenu.map((subItem) => (
                        <NavLink 
                          to={subItem.path}
                          key={subItem.id}
                          className="submenu-btn"
                          onClick={toggleSidebar}
                        >
                          <div className="submenu-icon">{subItem.icon}</div>
                          <span>{subItem.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `nav-btn ${isActive ? 'active highlight' : ''}`}
                  onClick={() => {
                    toggleSidebar();
                    setActiveItem(item.id);
                  }}
                >
                  <div className="icon-wrapper">
                    {activeItem === item.id ? item.activeIcon : item.icon}
                  </div>
                  {isOpen && <span className="nav-label">{item.name}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        <div className="panel-footer">
          {isOpen && (
            <div className="user-info">
              <div className="avatar"></div>
              <span className="user-name">Tu Nutrióloga</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;