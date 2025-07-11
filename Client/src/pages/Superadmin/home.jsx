import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaUser, FaUtensils, FaWeight,
  FaShoppingCart, FaMoneyBillWave, FaCheckCircle,
  FaExclamationTriangle, FaClipboardList, FaChartLine,
  FaClock, FaHamburger, FaAppleAlt, FaDrumstickBite,
  FaHeartbeat, FaRunning, FaWeightHanging
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/home.css';

const Home = () => {
  // ====================================================
  // ESTADOS ESTÁTICOS
  // ====================================================
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Datos estáticos para consultas
  const consultas = [
    {
      idConsulta: 1,
      nombrePaciente: "Juan Pérez",
      total: 850.50,
      estado: "PAGADO",
      createdAt: new Date(),
      Detalles: {
        items: [
          { Servicio: { nombre: "Plan nutricional" } },
          { Servicio: { nombre: "Seguimiento mensual" } }
        ]
      }
    },
    {
      idConsulta: 2,
      nombrePaciente: "María García",
      total: 650.75,
      estado: "PENDIENTE",
      createdAt: new Date(),
      Detalles: {
        items: [
          { Servicio: { nombre: "Evaluación inicial" } }
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
      motivo: "Evaluación nutricional",
      estado: "PENDIENTE",
      Nutriologo: { nombre: "Lic. Ana Martínez" },
      Paciente: { esNuevo: true }
    },
    {
      idCita: 2,
      nombrePaciente: "Laura Méndez",
      fechaHora: new Date(new Date().setHours(new Date().getHours() + 2)),
      motivo: "Seguimiento semanal",
      estado: "CONFIRMADA",
      Nutriologo: { nombre: "Lic. Jorge Ramírez" },
      Paciente: { esNuevo: false }
    }
  ];

  // Datos estáticos para pacientes (ampliados con más información)
  const pacientes = [
    {
      idPaciente: 1,
      nombre: "Juan Pérez",
      fechaNacimiento: "1985-05-15",
      peso: 85.5,
      altura: 175,
      img_perfil: "",
      ultimaVisita: new Date(new Date().setDate(new Date().getDate() - 7)),
      objetivo: "Pérdida de peso",
      progreso: 65,
      dieta: "Keto"
    },
    {
      idPaciente: 2,
      nombre: "María García",
      fechaNacimiento: "1990-08-22",
      peso: 65.2,
      altura: 165,
      img_perfil: "",
      ultimaVisita: new Date(new Date().setDate(new Date().getDate() - 14)),
      objetivo: "Aumento muscular",
      progreso: 40,
      dieta: "Alta en proteínas"
    },
    {
      idPaciente: 3,
      nombre: "Carlos López",
      fechaNacimiento: "1978-11-30",
      peso: 92.0,
      altura: 182,
      img_perfil: "",
      ultimaVisita: new Date(),
      objetivo: "Mantenimiento",
      progreso: 85,
      dieta: "Balanceada"
    },
    {
      idPaciente: 4,
      nombre: "Ana Rodríguez",
      fechaNacimiento: "1995-04-10",
      peso: 58.0,
      altura: 160,
      img_perfil: "",
      ultimaVisita: new Date(new Date().setDate(new Date().getDate() - 3)),
      objetivo: "Pérdida de peso",
      progreso: 30,
      dieta: "Baja en carbohidratos"
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
    doctor: cita.Nutriologo?.nombre || 'Nutriólogo no asignado',
    raw: cita
  });

  // Filtrar consultas del día
  const consultasHoy = consultas.filter(v => 
    new Date(v.createdAt).toLocaleDateString() === hoy
  );

  // Calcular ingresos del día
  const ingresosHoy = consultasHoy.reduce((sum, v) => sum + v.total, 0);

  // Procesar consultas para mostrar
  const procesarConsulta = (consulta) => ({
    id: consulta.idConsulta,
    client: consulta.nombrePaciente || 'Paciente no especificado',
    amount: `$${(Number(consulta.total) || 0).toFixed(2)}`,
    services: consulta.Detalles?.items?.map(d => d.Servicio?.nombre).join(', ') || 'Servicios no especificados',
    status: consulta.estado === 'PAGADO' ? 'pagado' : 'pendiente',
    date: new Date(consulta.createdAt).toLocaleDateString(),
    raw: consulta
  });

  // Consultas recientes (últimas 3)
  const recentConsultas = [...consultas]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .map(procesarConsulta);

  // Consultas pendientes
  const pendingPayments = consultas
    .filter(v => v.estado === 'PENDIENTE')
    .slice(0, 3)
    .map(procesarConsulta);

  // Procesar pacientes para mostrar
  const procesarPaciente = (paciente) => ({
    id: paciente.idPaciente,
    nombre: paciente.nombre || 'Paciente no especificado',
    edad: calcularEdad(paciente.fechaNacimiento),
    imc: calcularIMC(paciente.peso, paciente.altura),
    ultimaVisita: paciente.ultimaVisita ? new Date(paciente.ultimaVisita).toLocaleDateString() : 'No registrada',
    img: paciente.img_perfil || 'default-profile.jpg',
    objetivo: paciente.objetivo || 'No especificado',
    progreso: paciente.progreso || 0,
    dieta: paciente.dieta || 'No especificada',
    raw: paciente
  });

  function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return 'ND';
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  function calcularIMC(peso, altura) {
    if (!peso || !altura) return 'ND';
    const alturaMetros = altura / 100;
    const imc = (peso / (alturaMetros * alturaMetros)).toFixed(1);
    
    let estado = '';
    if (imc < 18.5) estado = 'Bajo peso';
    else if (imc >= 18.5 && imc < 25) estado = 'Normal';
    else if (imc >= 25 && imc < 30) estado = 'Sobrepeso';
    else estado = 'Obesidad';
    
    return { valor: imc, estado };
  }

  // Pacientes recientes (últimos 4)
  const recentPacientes = [...pacientes]
    .sort((a, b) => new Date(b.ultimaVisita) - new Date(a.ultimaVisita))
    .slice(0, 4)
    .map(procesarPaciente);

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
      icon: <FaUser />, 
      trend: 'steady', 
      link: 'pacientes', 
      color: 'var(--teal)' 
    },
    { 
      title: "Evaluaciones", 
      value: citas.filter(c => c.motivo?.includes('Evaluación')).length || 5, 
      icon: <FaClipboardList />, 
      trend: 'up', 
      link: 'evaluaciones', 
      color: 'var(--indigo)' 
    },
    { 
      title: "Consultas Hoy", 
      value: consultasHoy.length, 
      icon: <FaChartLine />, 
      trend: consultasHoy.length > 0 ? 'up' : 'steady', 
      link: 'consultas', 
      color: 'var(--orange)' 
    }
  ];

  // ====================================================
  // DATOS DE DIETAS (estáticos)
  // ====================================================
  const dietStatus = [
    { tipo: 'Pérdida de peso', total: 12, nuevos: 2, color: 'var(--purple)', icon: <FaWeightHanging /> },
    { tipo: 'Aumento muscular', total: 8, nuevos: 1, color: 'var(--blue)', icon: <FaDrumstickBite /> },
    { tipo: 'Mantenimiento', total: 15, nuevos: 0, color: 'var(--teal)', icon: <FaHeartbeat /> },
    { tipo: 'Condiciones especiales', total: 5, nuevos: 1, color: 'var(--green)', icon: <FaRunning /> }
  ];

  const quickAccessItems = [
    { id: 'pacientes', name: 'Pacientes', icon: <FaUser />, path: '/pacientes', submenu: false },
    { id: 'citas', name: 'Citas', icon: <FaCalendarAlt />, path: '/citas', submenu: false },
    { id: 'consultas', name: 'Consultas', icon: <FaChartLine />, path: '/consultas', submenu: false },
    { id: 'evaluaciones', name: 'Evaluaciones', icon: <FaClipboardList />, path: '/evaluaciones', submenu: false },
    { id: 'dietas', name: 'Planes de dieta', icon: <FaUtensils />, path: '/dietas', submenu: false }, 
    { id: 'alimentos', name: 'Alimentos', icon: <FaAppleAlt />, path: '/alimentos' },
    { id: 'bitacora', name: 'Bitácora de comidas', icon: <FaHamburger />, path: '/bitacora' },
    { id: 'finanzas', name: 'Finanzas', icon: <FaMoneyBillWave />, path: '/finanzas' }
  ];

  // ====================================================
  // RENDERIZADO
  // ====================================================
  return (
    <div className="custom-dashboard">
      {/* Título de la página */}
      <h2 className="custom-page-title">My Nutrition Admin</h2>
      
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

      {/* Primera Fila: Citas y Consultas Pendientes */}
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

        {/* Tarjeta de consultas pendientes */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Consultas Pendientes</h4>
            <NavLink to="/consultas" className="btn custom-btn-sm btn-primary text-white">
              Ver todas
            </NavLink>
          </div>
          <div className="custom-card-body">
            {pendingPayments.length > 0 ? (
              pendingPayments.map(consulta => (
                <div key={consulta.id} className="custom-sale-item pending">
                  <div className="custom-sale-client">
                    <h5>{consulta.client}</h5>
                    {windowWidth > 576 && <p>{consulta.services}</p>}
                  </div>
                  <div className="custom-sale-info">
                    <span className="custom-sale-amount">{consulta.amount}</span>
                    {windowWidth > 576 && <span className="custom-sale-date">{consulta.date}</span>}
                  </div>
                  <div className="custom-sale-status pending">
                    {windowWidth > 576 ? 'Pendiente' : 'P'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3">No hay consultas pendientes</div>
            )}
          </div>
        </div>
      </div>

      {/* Segunda Fila: Dietas y Pacientes Recientes */}
      <div className="custom-dashboard-row">
        {/* Tarjeta de tipos de dietas */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Planes de Dieta</h4>
          </div>
          <div className="custom-card-body">
            {dietStatus.map((item, index) => (
              <div key={index} className="custom-inventory-item">
                <div className="custom-inventory-header">
                  <div className="custom-inventory-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <h5>{item.tipo}</h5>
                  {item.nuevos > 0 && <span className="custom-new-badge">+{item.nuevos}</span>}
                </div>
                <div className="custom-inventory-stats">
                  <span className="custom-total">Total: {item.total}</span>
                </div>
                <div className="custom-progress-bar">
                  <div 
                    className="custom-progress-fill" 
                    style={{ 
                      width: `${(item.total / 40) * 100}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta de pacientes recientes - MEJORADA */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Pacientes Recientes</h4>
            <NavLink to="/pacientes" className="btn custom-btn-sm btn-primary text-white">
              Ver todos
            </NavLink>
          </div>
          <div className="custom-card-body">
            {recentPacientes.length > 0 ? (
              <div className="custom-patients-grid">
                {recentPacientes.map(paciente => (
                  <div key={paciente.id} className="custom-patient-card">
                    <div className="custom-patient-header">
                      <div className="custom-patient-avatar">
                        {paciente.nombre.charAt(0)}
                      </div>
                      <div className="custom-patient-name">
                        <h5>{paciente.nombre}</h5>
                        <span>{paciente.edad} años</span>
                      </div>
                    </div>
                    
                    <div className="custom-patient-stats">
                      <div className="custom-patient-stat">
                        <span className="stat-label">IMC</span>
                        <span className={`stat-value ${paciente.imc.estado.toLowerCase().replace(' ', '-')}`}>
                          {paciente.imc.valor} <small>({paciente.imc.estado})</small>
                        </span>
                      </div>
                      <div className="custom-patient-stat">
                        <span className="stat-label">Objetivo</span>
                        <span className="stat-value">{paciente.objetivo}</span>
                      </div>
                    </div>
                    
                    <div className="custom-patient-progress">
                      <div className="progress-info">
                        <span>Progreso</span>
                        <span>{paciente.progreso}%</span>
                      </div>
                      <div className="custom-progress-bar">
                        <div 
                          className="custom-progress-fill" 
                          style={{ 
                            width: `${paciente.progreso}%`,
                            backgroundColor: getProgressColor(paciente.progreso)
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="custom-patient-footer">
                      <span className="diet-badge">{paciente.dieta}</span>
                      <span className="last-visit">Últ. visita: {paciente.ultimaVisita}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3">No hay pacientes recientes</div>
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

  // Función auxiliar para determinar el color del progreso
  function getProgressColor(progress) {
    if (progress < 30) return 'var(--red)';
    if (progress < 60) return 'var(--orange)';
    if (progress < 80) return 'var(--blue)';
    return 'var(--green)';
  }
};

export default Home;