import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaUserInjured, FaEye, FaGlasses,
  FaShoppingCart, FaMoneyBillWave, FaCheckCircle,
  FaExclamationTriangle, FaClipboardList, FaFileInvoiceDollar,
  FaClock
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/home.css';

const Home = () => {
  // ====================================================
  // ESTADOS ESTÁTICOS
  // ====================================================
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Datos estáticos para ventas
  const ventas = [
    {
      idVenta: 1,
      nombrePaciente: "Juan Pérez",
      total: 1250.50,
      estado: "LIQUIDADO",
      createdAt: new Date(),
      Cotizacion: {
        detalles: [
          { Producto: { nombre: "Lentes progresivos" } },
          { Producto: { nombre: "Armazón de titanio" } }
        ]
      }
    },
    {
      idVenta: 2,
      nombrePaciente: "María García",
      total: 850.75,
      estado: "PENDIENTE",
      createdAt: new Date(),
      Cotizacion: {
        detalles: [
          { Producto: { nombre: "Lentes fotosensibles" } }
        ]
      }
    }
  ];

  // Datos estáticos para citas
  const citas = [
    {
      idCita: 1,
      nombrePaciente: "Carlos López",
      fechaHora: new Date(),
      motivo: "Examen de la vista",
      estado: "PENDIENTE",
      Optometrista: { nombre: "Dra. Ana Martínez" },
      Paciente: { esNuevo: true }
    },
    {
      idCita: 2,
      nombrePaciente: "Laura Méndez",
      fechaHora: new Date(new Date().setHours(new Date().getHours() + 2)),
      motivo: "Consulta de rutina",
      estado: "CONFIRMADA",
      Optometrista: { nombre: "Dr. Jorge Ramírez" },
      Paciente: { esNuevo: false }
    }
  ];

  // Efecto solo para manejar el resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ====================================================
  // DATOS PROCESADOS
  // ====================================================

  // Procesar y filtrar citas pendientes para hoy
  const hoy = new Date().toLocaleDateString();
  const citasHoy = citas.filter(c => 
    new Date(c.fechaHora).toLocaleDateString() === hoy && 
    c.estado === 'PENDIENTE'
  ).sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

  // Procesar citas para mostrar
  const procesarCita = (cita) => ({
    id: cita.idCita,
    patient: cita.nombrePaciente || 'Paciente no especificado',
    time: new Date(cita.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: cita.motivo || 'Consulta',
    status: cita.estado.toLowerCase(),
    doctor: cita.Optometrista?.nombre || 'Optometrista no asignado',
    raw: cita
  });

  // Filtrar ventas del día
  const ventasHoy = ventas.filter(v => 
    new Date(v.createdAt).toLocaleDateString() === hoy
  );

  // Calcular ingresos del día
  const ingresosHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);

  // Procesar ventas para mostrar
  const procesarVenta = (venta) => ({
    id: venta.idVenta,
    client: venta.nombrePaciente || 'Cliente no especificado',
    amount: `$${(Number(venta.total) || 0).toFixed(2)}`,
    products: venta.Cotizacion?.detalles?.map(d => d.Producto?.nombre).join(', ') || 'Productos no especificados',
    status: venta.estado === 'LIQUIDADO' ? 'liquidado' : 'pendiente',
    date: new Date(venta.createdAt).toLocaleDateString(),
    raw: venta
  });

  // Ventas recientes (últimas 3)
  const recentSales = [...ventas]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .map(procesarVenta);

  // Ventas pendientes
  const pendingPayments = ventas
    .filter(v => v.estado === 'PENDIENTE')
    .slice(0, 3)
    .map(procesarVenta);

  // ====================================================
  // ESTADÍSTICAS
  // ====================================================
  const stats = [
    { 
      title: "Citas Hoy", 
      value: citasHoy.length, 
      icon: <FaCalendarAlt />, 
      trend: citasHoy.length > 0 ? 'up' : 'steady', 
      link: 'citas', 
      color: 'var(--purple)' 
    },
    { 
      title: "Pacientes Nuevos", 
      value: citas.filter(c => c.Paciente?.esNuevo).length || 3, 
      icon: <FaUserInjured />, 
      trend: 'steady', 
      link: 'pacientes', 
      color: 'var(--teal)' 
    },
    { 
      title: "Exámenes", 
      value: citas.filter(c => c.motivo?.includes('Examen')).length || 15, 
      icon: <FaEye />, 
      trend: 'up', 
      link: 'examenes', 
      color: 'var(--indigo)' 
    },
    { 
      title: "Ventas Hoy", 
      value: ventasHoy.length, 
      icon: <FaShoppingCart />, 
      trend: ventasHoy.length > 0 ? 'up' : 'steady', 
      link: 'ventas', 
      color: 'var(--orange)' 
    },
    { 
      title: "Ingresos", 
      value: `$${ingresosHoy.toFixed(2)}`, 
      icon: <FaMoneyBillWave />, 
      trend: ingresosHoy > 0 ? 'up' : 'steady', 
      link: 'ventas', 
      color: 'var(--green)' 
    }
  ];

  // ====================================================
  // DATOS DE INVENTARIO (estáticos)
  // ====================================================
  const inventoryStatus = [
    { category: 'Armazones', total: 45, lowStock: 2, color: 'var(--purple)' },
    { category: 'Lentes', total: 120, lowStock: 5, color: 'var(--blue)' },
    { category: 'Contacto', total: 35, lowStock: 1, color: 'var(--teal)' },
    { category: 'Soluciones', total: 28, lowStock: 0, color: 'var(--green)' }
  ];

  const quickAccessItems = [
    { id: 'pacientes', name: 'Pacientes', icon: <FaUserInjured />, path: '/pacientes', submenu: false },
    { id: 'citas', name: 'Citas', icon: <FaCalendarAlt />, path: '/citas', submenu: false },
    { id: 'ventas', name: 'Ventas', icon: <FaShoppingCart />, path: '/ventas', submenu: false },
    { id: 'examenVista', name: 'Exámenes', icon: <FaEye />, path: '/examenVista', submenu: false },
    { id: 'receta', name: 'Recetas', icon: <FaClipboardList />, path: '/receta', submenu: false },
    { id: 'cotizacion', name: 'Cotización', icon: <FaFileInvoiceDollar />, path: '/Cotizacion', submenu: false }, 
    { id: 'inventario', name: 'Armazones', icon: <FaGlasses />, path: '/inventario' },
    { id: 'precios', name: 'Lista de Precios', icon: <FaFileInvoiceDollar />, path: '/precios' }
  ];

  // ====================================================
  // RENDERIZADO
  // ====================================================
  return (
    <div className="custom-dashboard">
      {/* Título de la página */}
      <h2 className="custom-page-title">Dashboard</h2>
      
      {/* Estadísticas Principales */}
      <div className="custom-stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="custom-stat-card"
            style={{ borderLeft: `4px solid ${stat.color}` }}
          >
            <div className="custom-stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="custom-stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            <div className={`custom-stat-trend ${stat.trend}`}>
              {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
            </div>
          </div>
        ))}
      </div>

      {/* Primera Fila: Citas y Ventas Pendientes */}
      <div className="custom-dashboard-row">
        {/* Tarjeta de próximas citas */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Próximas Citas</h4>
            <NavLink to="/citas" className="btn custom-btn-sm btn-primary text-white">
              Ver todas
            </NavLink>
          </div>
          <div className="custom-card-body">
            {citasHoy.length > 0 ? (
              citasHoy.slice(0, 3).map(cita => {
                const processed = procesarCita(cita);
                return (
                  <div key={cita.idCita} className={`custom-appointment-item ${processed.status}`}>
                    <div className="custom-appointment-time">
                      <FaClock className="me-2" />
                      {processed.time}
                    </div>
                    <div className="custom-appointment-details">
                      <h5>{processed.patient}</h5>
                      <p>{processed.type} • {processed.doctor}</p>
                    </div>
                    <div className="custom-appointment-status">
                      <span className={`custom-status-badge ${processed.status}`}>
                        {processed.status === 'confirmada' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                        {windowWidth > 576 ? processed.status : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-3">No hay citas pendientes para hoy</div>
            )}
          </div>
        </div>

        {/* Tarjeta de ventas pendientes */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Ventas Pendientes</h4>
            <NavLink to="/ventas" className="btn custom-btn-sm btn-primary text-white">
              Ver todas
            </NavLink>
          </div>
          <div className="custom-card-body">
            {pendingPayments.length > 0 ? (
              pendingPayments.map(sale => (
                <div key={sale.id} className="custom-sale-item pending">
                  <div className="custom-sale-client">
                    <h5>{sale.client}</h5>
                    {windowWidth > 576 && <p>{sale.products}</p>}
                  </div>
                  <div className="custom-sale-info">
                    <span className="custom-sale-amount">{sale.amount}</span>
                    {windowWidth > 576 && <span className="custom-sale-date">{sale.date}</span>}
                  </div>
                  <div className="custom-sale-status pending">
                    {windowWidth > 576 ? 'Pendiente' : 'P'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3">No hay ventas pendientes</div>
            )}
          </div>
        </div>
      </div>

      {/* Segunda Fila: Inventario y Ventas Recientes */}
      <div className="custom-dashboard-row">
        {/* Tarjeta de estado del inventario */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Estado del Inventario</h4>
          </div>
          <div className="custom-card-body">
            {inventoryStatus.map((item, index) => (
              <div key={index} className="custom-inventory-item">
                <div className="custom-inventory-header">
                  <h5>{item.category}</h5>
                  {item.lowStock > 0 && <span className="custom-low-stock-alert">!</span>}
                </div>
                <div className="custom-inventory-stats">
                  <span className="custom-total">Total: {item.total}</span>
                  {item.lowStock > 0 && <span className="custom-low-stock">Bajo stock: {item.lowStock}</span>}
                </div>
                <div className="custom-progress-bar">
                  <div 
                    className="custom-progress-fill" 
                    style={{ 
                      width: `${100 - (item.lowStock / item.total * 100)}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta de ventas recientes */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Ventas Recientes</h4>
            <NavLink to="/ventas" className="btn custom-btn-sm btn-primary text-white">
              Ver todas
            </NavLink>
          </div>
          <div className="custom-card-body">
            {recentSales.length > 0 ? (
              recentSales.map(sale => (
                <div key={sale.id} className={`custom-sale-item ${sale.status}`}>
                  <div className="custom-sale-client">
                    <h5>{sale.client}</h5>
                    {windowWidth > 576 && <p>{sale.products}</p>}
                  </div>
                  <div className="custom-sale-info">
                    <span className="custom-sale-amount">{sale.amount}</span>
                    {windowWidth > 576 && <span className="custom-sale-date">{sale.date}</span>}
                  </div>
                  <div className={`custom-sale-status ${sale.status}`}>
                    {windowWidth > 576 ? (sale.status === 'liquidado' ? 'Pagado' : 'Pendiente') : 
                    (sale.status === 'liquidado' ? 'P' : 'P')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3">No hay ventas recientes</div>
            )}
          </div>
        </div>
      </div>

      {/* Acceso Rápido */}
      <div className="custom-dashboard-card">
        <div className="custom-card-header">
          <h4>Acceso Rápido</h4>
        </div>
        <div className="custom-card-body">
          <div className="custom-quick-access-grid">
            {quickAccessItems.map(item => (
              <NavLink 
                key={item.id}
                to={item.path}
                className="custom-quick-access-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="custom-quick-access-icon">
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;