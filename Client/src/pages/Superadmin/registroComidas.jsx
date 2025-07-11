import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert, Tab, Tabs, Table, Badge } from 'react-bootstrap';
import { FaUser, FaCalendarAlt, FaChartLine, FaSearch, FaUtensils, FaFire, FaDrumstickBite, FaBreadSlice, FaHamburger } from 'react-icons/fa';
import { getUsuarios } from '../../api/Usuarios.api.js';
import { getBitacoraComidas } from '../../api/Bitacora.api.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useMediaQuery } from 'react-responsive';

const ReportesProgreso = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [rangoTiempo, setRangoTiempo] = useState('semana');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [datosReporte, setDatosReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('nutricion');
  const [detalleComidas, setDetalleComidas] = useState([]);

  // Obtener lista de usuarios al cargar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (err) {
        setError('Error al cargar los usuarios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Calcular fechas por defecto según el rango de tiempo seleccionado
  useEffect(() => {
    const hoy = new Date();
    let inicio, fin;

    switch (rangoTiempo) {
      case 'semana':
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 7);
        fin = new Date(hoy);
        break;
      case 'mes':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
        fin = new Date(hoy);
        break;
      case 'personalizado':
        return;
      default:
        inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 7);
        fin = new Date(hoy);
    }

    setFechaInicio(inicio.toISOString().split('T')[0]);
    setFechaFin(fin.toISOString().split('T')[0]);
  }, [rangoTiempo]);

  // Generar reporte
  const generarReporte = async () => {
    if (!usuarioSeleccionado) {
      setError('Debe seleccionar un usuario');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const bitacoraData = await getBitacoraComidas(usuarioSeleccionado.idPersona);
      
      const datosFiltrados = bitacoraData.filter(item => {
        const fechaItem = new Date(item.fecha_registro);
        return fechaItem >= new Date(fechaInicio) && fechaItem <= new Date(fechaFin);
      });

      const { datosNutricion, resumen, detalles } = procesarDatosParaReporte(datosFiltrados);
      setDatosReporte({ datosNutricion, resumen });
      setDetalleComidas(detalles);
    } catch (err) {
      setError('Error al generar el reporte: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Procesar datos para el reporte
  const procesarDatosParaReporte = (datos) => {
    const datosPorFecha = {};
    const detallesComidas = [];
    
    datos.forEach(item => {
      const fecha = item.fecha_registro.split('T')[0];
      if (!datosPorFecha[fecha]) {
        datosPorFecha[fecha] = {
          fecha,
          calorias: 0,
          proteinas: 0,
          carbohidratos: 0,
          grasas: 0,
          comidas: 0
        };
      }
      
      const porciones = item.contador || 1;
      const pesoNeto = item.peso || 100;
      const factor = porciones * (pesoNeto / 100);
      
      datosPorFecha[fecha].calorias += (item.Energia_kcal || 0) * factor;
      datosPorFecha[fecha].proteinas += (item.Proteina_g || 0) * factor;
      datosPorFecha[fecha].carbohidratos += (item.Carbohidratos_g || 0) * factor;
      datosPorFecha[fecha].grasas += (item.Grasa_g || 0) * factor;
      datosPorFecha[fecha].comidas += 1;
      
      detallesComidas.push({
        fecha: item.fecha_registro,
        tipoComida: item.tipo_comida,
        alimento: item.Alimento,
        categoria: item.categoriaAlimento,
        porciones: porciones,
        calorias: (item.Energia_kcal || 0) * factor,
        proteinas: (item.Proteina_g || 0) * factor,
        carbohidratos: (item.Carbohidratos_g || 0) * factor,
        grasas: (item.Grasa_g || 0) * factor,
        unidad: item.Unidad
      });
    });

    const datosArray = Object.values(datosPorFecha).sort((a, b) => 
      new Date(a.fecha) - new Date(b.fecha)
    );

    const totalDias = datosArray.length;
    const sumaCalorias = datosArray.reduce((sum, item) => sum + item.calorias, 0);
    const sumaProteinas = datosArray.reduce((sum, item) => sum + item.proteinas, 0);
    const sumaCarbs = datosArray.reduce((sum, item) => sum + item.carbohidratos, 0);
    const sumaGrasas = datosArray.reduce((sum, item) => sum + item.grasas, 0);

    return {
      datosNutricion: datosArray,
      resumen: {
        totalDias,
        promedioCalorias: totalDias > 0 ? sumaCalorias / totalDias : 0,
        promedioProteinas: totalDias > 0 ? sumaProteinas / totalDias : 0,
        promedioCarbs: totalDias > 0 ? sumaCarbs / totalDias : 0,
        promedioGrasas: totalDias > 0 ? sumaGrasas / totalDias : 0,
        totalComidas: datos.length,
        comidasPorDia: totalDias > 0 ? datos.length / totalDias : 0
      },
      detalles: detallesComidas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    };
  };

  // Formatear fechas
  const formatFecha = (fechaStr) => {
    return new Date(fechaStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: isMobile ? undefined : 'numeric'
    });
  };

  const formatHora = (fechaStr) => {
    return new Date(fechaStr).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMealIcon = (tipoComida) => {
    switch(tipoComida.toLowerCase()) {
      case 'desayuno':
        return <FaBreadSlice className="text-warning" />;
      case 'almuerzo':
        return <FaDrumstickBite className="text-danger" />;
      case 'cena':
        return <FaHamburger className="text-info" />;
      default:
        return <FaUtensils className="text-secondary" />;
    }
  };

  // Componente para mostrar comidas en móvil
  const MobileMealCard = ({ comida }) => (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            {getMealIcon(comida.tipoComida)}
            <span className="ms-2 fw-bold">{comida.tipoComida}</span>
          </div>
          <small className="text-muted">{formatHora(comida.fecha)}</small>
        </div>
        
        <h5 className="mb-2">{comida.alimento}</h5>
        <small className="text-muted d-block mb-2">{comida.categoria}</small>
        
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-light text-dark">
            {comida.porciones} {comida.unidad}
          </span>
          <span className="text-primary fw-bold">
            {comida.calorias.toFixed(0)} kcal
          </span>
        </div>
        
        <div className="nutrientes-mobile">
          <div className="nutriente-item">
            <FaDrumstickBite className="text-danger" />
            <span>{comida.proteinas.toFixed(1)}g</span>
          </div>
          <div className="nutriente-item">
            <FaBreadSlice className="text-warning" />
            <span>{comida.carbohidratos.toFixed(1)}g</span>
          </div>
          <div className="nutriente-item">
            <FaHamburger className="text-info" />
            <span>{comida.grasas.toFixed(1)}g</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  // Renderizado condicional según dispositivo
  return (
    <>
      {isMobile ? (
        // VERSIÓN MÓVIL
        <Container className="my-3 px-2">
          <h4 className="mb-3">
            <FaChartLine className="me-2 text-primary" />
            Reportes Nutricionales
          </h4>

          <Card className="mb-3 shadow-sm">
            <Card.Body className="p-3">
              <Row>
                <Col xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Usuario</Form.Label>
                    <Form.Select
                      size="sm"
                      value={usuarioSeleccionado?.id_usuario || ''}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const usuario = usuarios.find(u => u.id_usuario == selectedId);
                        setUsuarioSeleccionado(usuario || null);
                      }}
                      disabled={loading}
                    >
                      <option value="">Seleccione un usuario</option>
                      {usuarios.map(usuario => (
                        <option key={usuario.id_usuario} value={usuario.id_usuario}>
                          {usuario.nombre} {usuario.apellidos || ''}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} sm={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-bold">Periodo</Form.Label>
                    <Form.Select
                      size="sm"
                      value={rangoTiempo}
                      onChange={(e) => setRangoTiempo(e.target.value)}
                      disabled={loading}
                    >
                      <option value="semana">Última semana</option>
                      <option value="mes">Último mes</option>
                      <option value="personalizado">Personalizado</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {rangoTiempo === 'personalizado' && (
                  <>
                    <Col xs={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">Inicio</Form.Label>
                        <Form.Control
                          type="date"
                          size="sm"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">Fin</Form.Label>
                        <Form.Control
                          type="date"
                          size="sm"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>

              <Button 
                variant="primary"
                size="sm"
                onClick={generarReporte}
                disabled={!usuarioSeleccionado || loading}
                className="w-100"
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" />
                    <span className="ms-2">Generando...</span>
                  </>
                ) : (
                  'Generar Reporte'
                )}
              </Button>
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="danger" className="mb-3 py-2">
              <small>{error}</small>
            </Alert>
          )}

          {datosReporte && (
            <>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
                fill
              >
                <Tab eventKey="nutricion" title={<><FaChartLine /> Nutrición</>} />
                <Tab eventKey="resumen" title={<><FaFire /> Resumen</>} />
                <Tab eventKey="detalle" title={<><FaUtensils /> Comidas</>} />
              </Tabs>

              {activeTab === 'nutricion' && (
                <Card className="mb-3 shadow-sm">
                  <Card.Body className="p-3">
                    <h6 className="mb-3">Consumo Diario</h6>
                    <div style={{ height: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={datosReporte.datosNutricion}
                          margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                        >
                          <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="fecha" 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(fecha) => formatFecha(fecha)}
                            interval={2}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value, name) => {
                              const unit = name === 'calorias' ? 'kcal' : 'g';
                              return [`${value.toFixed(2)} ${unit}`, 
                                name === 'calorias' ? 'Calorías' : 
                                name === 'proteinas' ? 'Proteínas' :
                                name === 'carbohidratos' ? 'Carbs' : 'Grasas'];
                            }}
                            labelFormatter={(fecha) => `Fecha: ${formatFecha(fecha)}`}
                            contentStyle={{ fontSize: 12 }}
                          />
                          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                          <Bar 
                            dataKey="calorias" 
                            fill="#8884d8" 
                            name="Calorías" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {activeTab === 'resumen' && datosReporte.resumen && (
                <div className="mb-3">
                  <Card className="mb-3 shadow-sm">
                    <Card.Body className="p-3">
                      <h6 className="mb-3">Resumen del Periodo</h6>
                      <Row>
                        <Col xs={6} className="mb-3">
                          <div className="summary-card">
                            <div className="summary-value">{datosReporte.resumen.totalDias}</div>
                            <div className="summary-label">Días</div>
                          </div>
                        </Col>
                        <Col xs={6} className="mb-3">
                          <div className="summary-card">
                            <div className="summary-value">{datosReporte.resumen.comidasPorDia.toFixed(1)}</div>
                            <div className="summary-label">Comidas/día</div>
                          </div>
                        </Col>
                        <Col xs={12} className="mb-3">
                          <div className="summary-card large">
                            <div className="summary-value">
                              {datosReporte.resumen.promedioCalorias.toFixed(0)}
                              <small className="text-muted ms-1">kcal/día</small>
                            </div>
                            <div className="summary-label">Promedio calorías</div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="shadow-sm">
                    <Card.Body className="p-3">
                      <h6 className="mb-3">Macronutrientes</h6>
                      <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={datosReporte.datosNutricion}
                            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                          >
                            <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="fecha" 
                              tick={{ fontSize: 12 }}
                              tickFormatter={(fecha) => formatFecha(fecha)}
                              interval={2}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip 
                              formatter={(value) => [`${value.toFixed(2)}g`]}
                              labelFormatter={(fecha) => `Fecha: ${formatFecha(fecha)}`}
                              contentStyle={{ fontSize: 12 }}
                            />
                            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                            <Line 
                              type="monotone" 
                              dataKey="proteinas" 
                              stroke="#82ca9d" 
                              name="Proteínas" 
                              strokeWidth={2}
                              dot={false}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="carbohidratos" 
                              stroke="#ffc658" 
                              name="Carbs" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {activeTab === 'detalle' && (
                <div className="mb-3">
                  <h6 className="mb-3 px-2">Comidas Registradas</h6>
                  {detalleComidas.length > 0 ? (
                    detalleComidas.map((comida, index) => (
                      <MobileMealCard key={index} comida={comida} />
                    ))
                  ) : (
                    <Card className="shadow-sm">
                      <Card.Body className="text-center py-4 text-muted">
                        No hay comidas registradas en este periodo
                      </Card.Body>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      ) : (
        // VERSIÓN DESKTOP
        <Container className="my-4">
          <h2 className="mb-4">
            <FaChartLine className="me-2" />
            Reportes de Progreso Nutricional
          </h2>

          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser className="me-2" />
                      Seleccionar Usuario
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={usuarioSeleccionado?.id_usuario || ''}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const usuario = usuarios.find(u => u.id_usuario == selectedId);
                        setUsuarioSeleccionado(usuario || null);
                      }}
                      disabled={loading}
                    >
                      <option value="">Seleccione un usuario</option>
                      {usuarios.map(usuario => (
                        <option key={usuario.id_usuario} value={usuario.id_usuario}>
                          {usuario.nombre} {usuario.apellidos || ''}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaCalendarAlt className="me-2" />
                      Rango de Tiempo
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={rangoTiempo}
                      onChange={(e) => setRangoTiempo(e.target.value)}
                      disabled={loading}
                    >
                      <option value="semana">Última semana</option>
                      <option value="mes">Último mes</option>
                      <option value="personalizado">Personalizado</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                {rangoTiempo === 'personalizado' && (
                  <>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha Inicio</Form.Label>
                        <Form.Control
                          type="date"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha Fin</Form.Label>
                        <Form.Control
                          type="date"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>

              <div className="d-flex justify-content-end">
                <Button 
                  variant="primary" 
                  onClick={generarReporte}
                  disabled={!usuarioSeleccionado || loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Generando...</span>
                    </>
                  ) : (
                    'Generar Reporte'
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {datosReporte && (
            <>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="nutricion" title="Nutrición" />
                <Tab eventKey="resumen" title="Resumen" />
                <Tab eventKey="detalle" title="Detalle de Comidas" />
              </Tabs>

              {activeTab === 'nutricion' && (
                <Card className="mb-4">
                  <Card.Body>
                    <h4 className="mb-4">Consumo Nutricional Diario</h4>
                    <div style={{ height: '400px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={datosReporte.datosNutricion}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="fecha" 
                            angle={-45} 
                            textAnchor="end" 
                            height={60}
                            tickFormatter={(fecha) => formatFecha(fecha)}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name) => {
                              const unit = name === 'calorias' ? 'kcal' : 'g';
                              return [`${value.toFixed(2)} ${unit}`, 
                                name === 'calorias' ? 'Calorías' : 
                                name === 'proteinas' ? 'Proteínas' :
                                name === 'carbohidratos' ? 'Carbohidratos' : 'Grasas'];
                            }}
                            labelFormatter={(fecha) => `Fecha: ${formatFecha(fecha)}`}
                          />
                          <Legend />
                          <Bar dataKey="calorias" fill="#8884d8" name="Calorías (kcal)" />
                          <Bar dataKey="proteinas" fill="#82ca9d" name="Proteínas (g)" />
                          <Bar dataKey="carbohidratos" fill="#ffc658" name="Carbs (g)" />
                          <Bar dataKey="grasas" fill="#ff8042" name="Grasas (g)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {activeTab === 'resumen' && datosReporte.resumen && (
                <Card className="mb-4">
                  <Card.Body>
                    <h4 className="mb-4">Resumen del Período</h4>
                    <Row>
                      <Col md={3}>
                        <Card className="text-center mb-3">
                          <Card.Body>
                            <Card.Title>{datosReporte.resumen.totalDias}</Card.Title>
                            <Card.Text>Días registrados</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center mb-3">
                          <Card.Body>
                            <Card.Title>{datosReporte.resumen.promedioCalorias.toFixed(0)}</Card.Title>
                            <Card.Text>Calorías promedio (kcal/día)</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center mb-3">
                          <Card.Body>
                            <Card.Title>{datosReporte.resumen.promedioProteinas.toFixed(1)}</Card.Title>
                            <Card.Text>Proteínas promedio (g/día)</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center mb-3">
                          <Card.Body>
                            <Card.Title>{datosReporte.resumen.comidasPorDia.toFixed(1)}</Card.Title>
                            <Card.Text>Comidas promedio por día</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <h5 className="mt-4 mb-3">Distribución de Macronutrientes</h5>
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={datosReporte.datosNutricion}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="fecha" 
                            tickFormatter={(fecha) => formatFecha(fecha)}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name) => {
                              return [`${value.toFixed(2)}g`, 
                                name === 'proteinas' ? 'Proteínas' :
                                name === 'carbohidratos' ? 'Carbohidratos' : 'Grasas'];
                            }}
                            labelFormatter={(fecha) => `Fecha: ${formatFecha(fecha)}`}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="proteinas" stroke="#82ca9d" name="Proteínas (g)" />
                          <Line type="monotone" dataKey="carbohidratos" stroke="#ffc658" name="Carbs (g)" />
                          <Line type="monotone" dataKey="grasas" stroke="#ff8042" name="Grasas (g)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {activeTab === 'detalle' && (
                <Card className="mb-4">
                  <Card.Body>
                    <h4 className="mb-4">Detalle de Comidas Registradas</h4>
                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Tipo</th>
                            <th>Alimento</th>
                            <th>Categoría</th>
                            <th>Porciones</th>
                            <th>Calorías</th>
                            <th>Proteínas</th>
                            <th>Carbs</th>
                            <th>Grasas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalleComidas.map((comida, index) => (
                            <tr key={index}>
                              <td>{formatFecha(comida.fecha)}</td>
                              <td>{formatHora(comida.fecha)}</td>
                              <td>{comida.tipoComida}</td>
                              <td>{comida.alimento}</td>
                              <td>{comida.categoria}</td>
                              <td>{comida.porciones} {comida.unidad}</td>
                              <td>{comida.calorias.toFixed(1)} kcal</td>
                              <td>{comida.proteinas.toFixed(1)}g</td>
                              <td>{comida.carbohidratos.toFixed(1)}g</td>
                              <td>{comida.grasas.toFixed(1)}g</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </Container>
      )}

      <style jsx>{`
        .nutrientes-mobile {
          display: flex;
          justify-content: space-around;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 8px 0;
          margin-top: 8px;
        }
        .nutriente-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
        }
        .nutriente-item span {
          margin-top: 4px;
          font-weight: 500;
        }
        .summary-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }
        .summary-card.large {
          padding: 16px;
        }
        .summary-value {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
        .summary-card.large .summary-value {
          font-size: 24px;
        }
        .summary-label {
          font-size: 12px;
          color: #6c757d;
          margin-top: 4px;
        }
      `}</style>
    </>
  );
};

export default ReportesProgreso;