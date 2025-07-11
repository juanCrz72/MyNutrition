import { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaBars, FaSignOutAlt, FaUser, FaKey, FaChevronDown, FaBell, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import PropTypes from 'prop-types';
import { useAuth } from '../../pages/Superadmin/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { io } from 'socket.io-client';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const target = useRef(null);
  const socket = useRef(null);
  const notificationRef = useRef(null);

  // Cerrar notificaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        const bellIcon = document.querySelector('.notification-icon');
        if (bellIcon && !bellIcon.contains(event.target)) {
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Conectar al servidor Socket.io
    socket.current = io('http://localhost:3000');

    // Escuchar notificaciones
    socket.current.on('new-user', (data) => {
      addNotification({
        id: Date.now(),
        type: 'user',
        message: `Nuevo usuario creado: ${data.nombre}`,
        timestamp: new Date(),
        read: false
      });
    });

    socket.current.on('update-user', (data) => {
      addNotification({
        id: Date.now(),
        type: 'user',
        message: `Usuario actualizado: ${data.nombre}`,
        timestamp: new Date(),
        read: false
      });
    });

    socket.current.on('new-person', (data) => {
      addNotification({
        id: Date.now(),
        type: 'person',
        message: `Nueva persona registrada: ${data.nombre} ${data.apellidos}`,
        timestamp: new Date(),
        read: false
      });
    });

    socket.current.on('update-person', (data) => {
      addNotification({
        id: Date.now(),
        type: 'person',
        message: `Persona actualizada: ${data.nombre} ${data.apellidos}`,
        timestamp: new Date(),
        read: false
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleProfileClick = () => {
    navigate('/perfil');
    setShowDropdown(false);
  };

  const handleChangePassword = () => {
    navigate('/CambiarContrasena');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar-custom fixed-top">
      <div className="navbar-left">
        <button 
          className="sidebar-toggle btn btn-link" 
          onClick={toggleSidebar}
          aria-label="Alternar menú"
        >
          <FaBars />
        </button>
      </div>

      <div className="navbar-right">
        <div className="notification-wrapper position-relative">
          <div 
            className="notification-icon mx-3 position-relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell size={20} className="hover-effect text-white" />
            {unreadCount > 0 && (
              <span className="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle">
                {unreadCount}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className="notification-dropdown" ref={notificationRef}>
              <div className="notification-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="m-0">Notificaciones</h5>
                  <div className="d-flex">
                    <button 
                      className="btn btn-icon"
                      onClick={markAllAsRead}
                      title="Marcar todas como leídas"
                    >
                      <FaCheck className="icon-sm text-white" />
                    </button>
                    <button 
                      className="btn btn-icon ms-2"
                      onClick={clearAllNotifications}
                      title="Limpiar todas"
                    >
                      <FaTrash className="icon-sm text-white" />
                    </button>
                    <button 
                      className="btn btn-icon ms-2"
                      onClick={() => setShowNotifications(false)}
                      title="Cerrar"
                    >
                      <FaTimes className="icon-sm text-white" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-badge">
                        {notification.type === 'user' ? (
                          <FaUser className="icon-user" />
                        ) : (
                          <FaUserCircle className="icon-person" />
                        )}
                      </div>
                      <div className="notification-content">
                        <div className="d-flex justify-content-between">
                          <strong>{notification.type === 'user' ? 'Usuario' : 'Persona'}</strong>
                          <small>
                            {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </small>
                        </div>
                        <p>{notification.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-notifications">
                    <FaBell className="empty-icon" />
                    <p>No hay notificaciones nuevas</p>
                  </div>
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="notification-footer">
                  <button 
                    className="btn btn-clear-all text-white"
                    onClick={clearAllNotifications}
                  >
                    Limpiar todas
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div 
          ref={target}
          className="user-profile d-flex align-items-center"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FaUserCircle className="user-avatar" />
          <span className="user-name mx-2">
            {user ? user.nombre : 'Usuario no autenticado'}
          </span>
          <FaChevronDown className={`transition-all ${showDropdown ? 'rotate-180' : ''}`} />
        </div>

        <Dropdown show={showDropdown} onToggle={setShowDropdown} align="end">
          <Dropdown.Toggle 
            as="div" 
            style={{ display: 'none' }} 
            id="dropdown-custom"
          />
          
          <Dropdown.Menu 
            className="shadow-lg border-0 animate__animated animate__fadeIn"
            style={{
              minWidth: '220px',
              backgroundColor: 'rgb(12, 31, 49)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'absolute',
              right: '0',
              left: 'auto'
            }}
            popperConfig={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 5],
                  },
                },
              ],
            }}
          >
            <Dropdown.Header className="text-white fw-bold d-flex align-items-center">
              <FaUserCircle className="me-2" /> {user ? user.nombre : 'Usuario'}
            </Dropdown.Header>
            <Dropdown.Divider className="bg-secondary" />
            
            <Dropdown.Item 
              className="text-white d-flex align-items-center py-2 hover-item"
              onClick={handleProfileClick}
            >
              <FaUser className="me-2" /> Mi perfil
            </Dropdown.Item>
            
            <Dropdown.Item 
              className="text-white d-flex align-items-center py-2 hover-item"
              onClick={handleChangePassword}
            >
              <FaKey className="me-2" /> Cambiar contraseña
            </Dropdown.Item>
            
            <Dropdown.Divider className="bg-secondary" />
            
            <Dropdown.Item 
              className="text-danger d-flex align-items-center py-2 hover-item"
              onClick={logout}
            >
              <FaSignOutAlt className="me-2" /> Cerrar sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;