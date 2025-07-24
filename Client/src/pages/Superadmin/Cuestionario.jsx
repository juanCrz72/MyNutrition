import React, { useState, useEffect } from 'react';
import { 
  getQuestionariosjs, 
  createQuestionariojs, 
  updateQuestionariojs, 
  deleteQuestionariojs 
} from '../../assets/js/Cuestionario.js';
import Swal from 'sweetalert2';
import { getPersonas } from '../../api/Persona.api.js';
import { Modal, Form, ProgressBar, Card, Row, Col, Alert, Button } from 'react-bootstrap';
import {
  FaRunning,
  FaPills,
  FaFireAlt,
  FaAllergies,
  FaBullseye,
  FaHeartbeat,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import { MdOutlineMedicalServices } from 'react-icons/md';
import { RiMentalHealthLine } from 'react-icons/ri';

const Cuestionario = () => {
  // Estados principales
  const [questionarios, setQuestionarios] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [currentQuestionario, setCurrentQuestionario] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [step, setStep] = useState(1);

  // Formulario estado
  const [formData, setFormData] = useState({
    id_persona: '',
    act_fisica: '',
    diabetes: '0',
    hipertension: '0',
    otra_enfermedad: '0',
    otra_enfermedad_desc: '',
    toma_medicamento: '0',
    medicamento_descrip: '',
    consumo_calorias: '0',
    calorias_descrip: '',
    alergias: '',
    metas: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await getQuestionariosjs(setQuestionarios);
      const pacientesData = await getPersonas();
      setPacientes(pacientesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Manejadores de formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? '1' : '0') : value
    }));
  };

  // Navegación del cuestionario
  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Crear cuestionario
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.id_persona) {
      Swal.fire('Error', 'Debe seleccionar un paciente', 'error');
      return;
    }

    await createQuestionariojs(
      formData.id_persona,
      formData.act_fisica || 'sedentario',
      formData.diabetes,
      formData.hipertension,
      formData.otra_enfermedad,
      formData.toma_medicamento,
      formData.medicamento_descrip,
      formData.consumo_calorias,
      formData.calorias_descrip,
      formData.alergias,
      formData.metas,
      setShowCreateModal,
      () => getQuestionariosjs(setQuestionarios)
    );
    resetForm();
  };

  // Editar cuestionario
  const handleEdit = async (e) => {
  e.preventDefault();
  
  // Solo enviar si estamos en el paso 4
  if (step === 4) {
    await updateQuestionariojs(
      currentQuestionario.id,
      formData.act_fisica,
      formData.diabetes,
      formData.hipertension,
      formData.otra_enfermedad,
      formData.otra_enfermedad_desc,
      formData.toma_medicamento,
      formData.medicamento_descrip,
      formData.consumo_calorias,
      formData.calorias_descrip,
      formData.alergias,
      formData.metas,
      setShowEditModal,
      () => getQuestionariosjs(setQuestionarios)
    );
    resetForm();
  } else {
    // Si no es el paso 4, avanzar al siguiente paso
    nextStep();
  }
};

  // Eliminar cuestionario
  const handleDelete = async () => {
    await deleteQuestionariojs(
      currentQuestionario.id,
      setShowDeleteModal,
      () => getQuestionariosjs(setQuestionarios)
    );
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      id_persona: '',
      act_fisica: '',
      diabetes: '0',
      hipertension: '0',
      otra_enfermedad: '0',
      otra_enfermedad_desc: '',
      toma_medicamento: '0',
      medicamento_descrip: '',
      consumo_calorias: '0',
      calorias_descrip: '',
      alergias: '',
      metas: ''
    });
    setStep(1);
  };

  // Preparar edición
  const prepareEdit = (questionario) => {
    setCurrentQuestionario(questionario);
    setFormData({
      id_persona: questionario.id_persona,
      act_fisica: questionario.act_fisica,
      diabetes: questionario.diabetes,
      hipertension: questionario.hipertension,
      otra_enfermedad: questionario.otra_enfermedad,
      otra_enfermedad_desc: questionario.otra_enfermedad_desc || '',
      toma_medicamento: questionario.toma_medicamento,
      medicamento_descrip: questionario.medicamento_descrip,
      consumo_calorias: questionario.consumo_calorias,
      calorias_descrip: questionario.calorias_descrip,
      alergias: questionario.alergias,
      metas: questionario.metas
    });
    setShowEditModal(true);
  };

  // Preparar eliminación
  const prepareDelete = (questionario) => {
    setCurrentQuestionario(questionario);
    setShowDeleteModal(true);
  };

  // Obtener nombre del paciente
  const getPacienteNombre = (id_persona) => {
    const paciente = pacientes.find(p => p.idpersona == id_persona);
    return paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'Desconocido';
  };

  // Función para formatear Sí/No
  const formatSiNo = (value) => value === '1' ? 'Sí' : 'No';

  // Estilo condicional para la tabla
  const getConditionStyle = (value) => {
    return value === '1' ? { color: 'red', fontWeight: 'bold' } : {};
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Cuestionarios de Salud</h1>
      
      {/* Botón para agregar nuevo */}
      <button 
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Nuevo Cuestionario
      </button>

      {/* Tabla de cuestionarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Paciente</th>
              <th className="py-2 px-4 border">Act. Física</th>
              <th className="py-2 px-4 border">Condiciones</th>
              <th className="py-2 px-4 border">Alergias</th>
              <th className="py-2 px-4 border">Metas</th>
              <th className="py-2 px-4 border">Fecha</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {questionarios.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{q.id}</td>
                <td className="py-2 px-4 border">{getPacienteNombre(q.id_persona)}</td>
                <td className="py-2 px-4 border capitalize">{q.act_fisica}</td>
                <td className="py-2 px-4 border">
                  <div style={getConditionStyle(q.diabetes)}>Diabetes: {formatSiNo(q.diabetes)}</div>
                  <div style={getConditionStyle(q.hipertension)}>Hipertensión: {formatSiNo(q.hipertension)}</div>
                  <div style={getConditionStyle(q.otra_enfermedad)}>Otras: {formatSiNo(q.otra_enfermedad)}</div>
                </td>
                <td className="py-2 px-4 border max-w-xs truncate">
                  {q.alergias || 'Ninguna'}
                </td>
                <td className="py-2 px-4 border max-w-xs truncate">
                  {q.metas || 'No especificadas'}
                </td>
                <td className="py-2 px-4 border">{new Date(q.date_add).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">
                  <button 
                    onClick={() => prepareEdit(q)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => prepareDelete(q)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear */}
      {showCreateModal && (
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
          <Modal.Header closeButton className="bg-gradient-primary text-white">
            <Modal.Title className="d-flex align-items-center">
              <GiHealthNormal size={28} className="me-3" />
              <div>
                <h3 className="mb-0">Nuevo Cuestionario de Salud</h3>
                <small className="opacity-75">Seleccione el paciente</small>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleCreate}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Paciente</Form.Label>
                <Form.Select
                  name="id_persona"
                  value={formData.id_persona}
                  onChange={handleInputChange}
                  required
                  className="form-control-custom"
                >
                  <option value="">Seleccione un paciente</option>
                  {pacientes.map(p => (
                    <option key={p.idpersona} value={p.idpersona}>
                      {p.nombre} {p.apellidos} (ID: {p.idpersona})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <div className="d-flex justify-content-end mt-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowCreateModal(false)}
                  className="me-2"
                >
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                >
                  Crear Cuestionario
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Modal para editar con cuestionario completo */}
      {showEditModal && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
          <Modal.Header closeButton className="bg-gradient-primary text-white">
            <Modal.Title className="d-flex align-items-center">
              <GiHealthNormal size={28} className="me-3" />
              <div>
                <h3 className="mb-0">Editar Cuestionario de Salud</h3>
                <small className="opacity-75">Paso {step} de 4</small>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <ProgressBar now={(step / 4) * 100} className="mb-4 progress-custom" />
            
            <Form onSubmit={handleEdit} className="questionnaire-form">
              {/* Paso 1: Actividad física y condiciones médicas */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <div className="d-flex align-items-center mb-4">
                    <div className="step-icon bg-info text-white">
                      <FaRunning size={20} />
                    </div>
                    <h4 className="mb-0 ms-3">Actividad Física y Salud</h4>
                  </div>
                  
                  <Form.Group className="mb-4 form-group-custom">
                    <Form.Label className="fw-bold">Nivel de actividad física</Form.Label>
                    <Form.Select 
                      name="act_fisica" 
                      value={formData.act_fisica} 
                      onChange={handleChange}
                      required
                      className="form-control-custom"
                    >
                      <option value="">Selecciona tu nivel de actividad</option>
                      <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
                      <option value="ligero">Ligero (ejercicio 1-3 días/semana)</option>
                      <option value="moderado">Moderado (ejercicio 3-5 días/semana)</option>
                      <option value="activo">Activo (ejercicio 6-7 días/semana)</option>
                      <option value="intenso">Muy activo (ejercicio intenso diario)</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Esto nos ayuda a calcular tus necesidades calóricas
                    </Form.Text>
                  </Form.Group>
                  
                  <Card className="mb-4 health-conditions-card">
                    <Card.Body>
                      <Card.Title className="mb-3">Condiciones de Salud</Card.Title>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3 custom-checkbox">
                            <Form.Check 
                              type="checkbox"
                              id="diabetes-check"
                              label={
                                <>
                                  <MdOutlineMedicalServices className="me-2 text-danger" />
                                  Diabetes
                                </>
                              }
                              name="diabetes"
                              checked={formData.diabetes === '1'}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3 custom-checkbox">
                            <Form.Check 
                              type="checkbox"
                              id="hipertension-check"
                              label={
                                <>
                                  <RiMentalHealthLine className="me-2 text-primary" />
                                  Hipertensión
                                </>
                              }
                              name="hipertension"
                              checked={formData.hipertension === '1'}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="custom-checkbox">
                        <Form.Check 
                          type="checkbox"
                          id="otra-enfermedad-check"
                          label="Otras condiciones médicas"
                          name="otra_enfermedad"
                          checked={formData.otra_enfermedad === '1'}
                          onChange={handleChange}
                        />
                        {formData.otra_enfermedad === '1' && (
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Por favor describe tu condición"
                            name="otra_enfermedad_desc"
                            value={formData.otra_enfermedad_desc}
                            onChange={handleChange}
                            className="mt-2 form-control-custom"
                          />
                        )}
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </div>
              )}
              
              {/* Paso 2: Medicamentos y consumo calórico */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <div className="d-flex align-items-center mb-4">
                    <div className="step-icon bg-warning text-white">
                      <FaPills size={20} />
                    </div>
                    <h4 className="mb-0 ms-3">Medicamentos y Hábitos</h4>
                  </div>
                  
                  <Card className="mb-4 medication-card">
                    <Card.Body>
                      <Form.Group className="custom-checkbox">
                        <Form.Check 
                          type="checkbox"
                          id="medicamento-check"
                          label={
                            <>
                              <FaPills className="me-2 text-warning" />
                              ¿Tomas algún medicamento actualmente?
                            </>
                          }
                          name="toma_medicamento"
                          checked={formData.toma_medicamento === '1'}
                          onChange={handleChange}
                        />
                        {formData.toma_medicamento === '1' && (
                          <>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Lista de medicamentos (nombre, dosis, frecuencia)"
                              name="medicamento_descrip"
                              value={formData.medicamento_descrip}
                              onChange={handleChange}
                              className="mt-3 form-control-custom"
                              required
                            />
                            <Form.Text className="text-muted">
                              Ej: Metformina 500mg, 1 tableta cada 12 horas
                            </Form.Text>
                          </>
                        )}
                      </Form.Group>
                    </Card.Body>
                  </Card>
                  
                  <Card className="mb-4 calories-card">
                    <Card.Body>
                      <Form.Group className="custom-checkbox">
                        <Form.Check 
                          type="checkbox"
                          id="calorias-check"
                          label={
                            <>
                              <FaFireAlt className="me-2 text-danger" />
                              ¿Llevas un control de tu consumo calórico?
                            </>
                          }
                          name="consumo_calorias"
                          checked={formData.consumo_calorias === '1'}
                          onChange={handleChange}
                        />
                        {formData.consumo_calorias === '1' && (
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Describe cómo llevas el control (app, diario, etc.)"
                            name="calorias_descrip"
                            value={formData.calorias_descrip}
                            onChange={handleChange}
                            className="mt-3 form-control-custom"
                          />
                        )}
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </div>
              )}
              
              {/* Paso 3: Alergias */}
              {step === 3 && (
                <div className="animate-fade-in">
                  <div className="d-flex align-items-center mb-4">
                    <div className="step-icon bg-danger text-white">
                      <FaAllergies size={20} />
                    </div>
                    <h4 className="mb-0 ms-3">Alergias e Intolerancias</h4>
                  </div>
                  
                  <Alert variant="info" className="d-flex align-items-center">
                    <FaExclamationTriangle className="me-2 flex-shrink-0" />
                    <div>
                      Esta información es crucial para evitar recomendaciones de alimentos que puedan afectar tu salud.
                    </div>
                  </Alert>
                  
                  <Card className="mt-4 allergies-card">
                    <Card.Body>
                      <Form.Group>
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FaAllergies className="me-2 text-danger" />
                          Alergias o intolerancias alimentarias
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          placeholder="Ej: Alergia a los mariscos, intolerancia a la lactosa, alergia a frutos secos, etc."
                          name="alergias"
                          value={formData.alergias}
                          onChange={handleChange}
                          className="form-control-custom"
                        />
                        <Form.Text className="text-muted">
                          Si no tienes ninguna, escribe "Ninguna"
                        </Form.Text>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </div>
              )}
              
              {/* Paso 4: Metas */}
              {step === 4 && (
                <div className="animate-fade-in">
                  <div className="d-flex align-items-center mb-4">
                    <div className="step-icon bg-success text-white">
                      <FaBullseye size={20} />
                    </div>
                    <h4 className="mb-0 ms-3">Tus Metas Nutricionales</h4>
                  </div>
                  
                  <Card className="goals-card">
                    <Card.Body>
                      <Form.Group>
                        <Form.Label className="fw-bold d-flex align-items-center mb-3">
                          <FaHeartbeat className="me-2 text-success" />
                          ¿Cuáles son tus principales objetivos con la nutrición?
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          placeholder="Ej: Perder peso, ganar masa muscular, mejorar mi energía, controlar diabetes, reducir colesterol, mejorar digestión, etc."
                          name="metas"
                          value={formData.metas}
                          onChange={handleChange}
                          className="form-control-custom"
                          required
                        />
                        <Form.Text className="text-muted">
                          Sé lo más específico posible para que podamos ayudarte mejor
                        </Form.Text>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                  
                  <Alert variant="success" className="mt-4 d-flex align-items-center">
                    <FaCheckCircle className="me-2 flex-shrink-0" />
                    <div>
                      <h5 className="mb-1">¡Estás a punto de terminar!</h5>
                      <p className="mb-0">
                        Revisa que toda la información proporcionada sea correcta antes de enviar.
                      </p>
                    </div>
                  </Alert>
                </div>
              )}
              
              <div className="d-flex justify-content-between mt-5">
                {step > 1 ? (
                  <Button 
                    variant="outline-secondary" 
                    onClick={prevStep}
                    className="d-flex align-items-center step-button"
                  >
                    <FaChevronLeft className="me-1" /> Anterior
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {step < 4 ? (
                  <Button 
                    variant="primary" 
                    onClick={nextStep}
                    className="d-flex align-items-center step-button"
                  >
                    Siguiente <FaChevronRight className="ms-1" />
                  </Button>
                ) : (
                  <Button 
                    variant="success" 
                    type="submit"
                    className="d-flex align-items-center submit-button"
                  >
                    <FaCheckCircle className="me-2" /> Guardar Cambios
                  </Button>
                )}
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Modal para eliminar */}
      {showDeleteModal && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>Confirmar Eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Estás seguro de que deseas eliminar el cuestionario de {currentQuestionario && getPacienteNombre(currentQuestionario.id_persona)}?</p>
            <p className="text-danger fw-bold">Esta acción no se puede deshacer.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      
    </div>
  );
};

export default Cuestionario;