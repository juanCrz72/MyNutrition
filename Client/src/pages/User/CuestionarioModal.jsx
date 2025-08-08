import React, { useState, useEffect } from 'react';
import { 
  FaRunning, FaPills, FaFireAlt, FaAllergies, FaBullseye, 
  FaHeartbeat, FaCheckCircle, FaChevronLeft, FaChevronRight,
  FaExclamationTriangle
} from 'react-icons/fa';
import { RiMentalHealthLine } from 'react-icons/ri';
import { MdOutlineMedicalServices } from 'react-icons/md';
import { GiHealthNormal } from 'react-icons/gi';
import { Modal, Button, Form, ProgressBar, Card, Alert, Row, Col } from 'react-bootstrap';
import { createQuestionariojs, getQuestionarioByPersonaIdjs } from '../../assets/js/Cuestionario.js';
import Swal from 'sweetalert2';
import './Css/Estilos.css'; // Asegúrate de tener este archivo CSS para estilos personalizados

const CuestionarioModal = ({ show, onHide, id_persona, idPersona, refreshDashboard }) => {
  const personaId = id_persona || idPersona;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    act_fisica: '',
    diabetes: '0',
    hipertension: '0',
    otra_enfermedad: '0',
    otra_enfermedad_desc: '',
    toma_medicamento: '0',
    medicamento_descrip: '',
    consumo_calorias: '0',
    calorias_descrip: '',
    alergias: 'ninguna',
    metas: ''
  });
  const [hasQuestionnaire, setHasQuestionnaire] = useState(false);

  useEffect(() => {
    if (personaId) {
      checkExistingQuestionnaire();
    }
  }, [personaId]);

  const checkExistingQuestionnaire = async () => {
    try {
      const cuestionario = await getQuestionarioByPersonaIdjs(personaId);
      
      if (cuestionario) {
        setHasQuestionnaire(true);
        setFormData({
          act_fisica: cuestionario.act_fisica || '',
          diabetes: cuestionario.diabetes || '0',
          hipertension: cuestionario.hipertension || '0',
          otra_enfermedad: cuestionario.otra_enfermedad || '0',
          otra_enfermedad_desc: cuestionario.otra_enfermedad_desc || '',
          toma_medicamento: cuestionario.toma_medicamento || '0',
          medicamento_descrip: cuestionario.medicamento_descrip || '',
          consumo_calorias: cuestionario.consumo_calorias || '0',
          calorias_descrip: cuestionario.calorias_descrip || '',
          alergias: cuestionario.alergias || 'ninguna',
          metas: cuestionario.metas || ''
        });
      }
    } catch (error) {
      console.error('Error al verificar cuestionario:', error);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.act_fisica) {
      Swal.fire('Error', 'Por favor selecciona tu nivel de actividad física', 'error');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked ? '1' : '0' });
  };

  const handleSubmitQuestionnaire = async (e) => {
    e.preventDefault();
    
    if (!formData.act_fisica || !formData.metas) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    if (!personaId) {
      Swal.fire('Error', 'No se ha identificado al usuario correctamente', 'error');
      return;
    }

    try {
      await createQuestionariojs(
        personaId,
        formData.act_fisica,
        formData.diabetes,
        formData.hipertension,
        formData.otra_enfermedad,
        formData.toma_medicamento,
        formData.medicamento_descrip,
        formData.consumo_calorias,
        formData.calorias_descrip,
        formData.alergias,
        formData.metas,
        onHide,
        refreshDashboard
      );
      
      setHasQuestionnaire(true);
      setStep(1);
      
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: hasQuestionnaire ? 'Cuestionario actualizado correctamente' : 'Cuestionario registrado correctamente',
      });
      
    } catch (error) {
      console.error('Error al enviar cuestionario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Hubo un problema al enviar el cuestionario',
      });
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="health-questionnaire-modal"
    >
      <Modal.Header closeButton className="bg-gradient-secondary text-white">
        <Modal.Title className="d-flex align-items-center">
          <GiHealthNormal size={28} className="me-2" />
          <div>
            <h5 className="mb-0">Cuestionario de Salud</h5>
            <small className="opacity-75">Paso {step} de 4</small>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3">
        <ProgressBar now={(step / 4) * 100} className="mb-3" style={{height: '6px'}} />
        
        <Form onSubmit={handleSubmitQuestionnaire}>
          {/* Paso 1: Actividad física y condiciones médicas */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-info text-white rounded-circle p-2 d-flex align-items-center justify-content-center me-2" style={{width: '36px', height: '36px'}}>
                  <FaRunning size={16} />
                </div>
                <h5 className="mb-0">Actividad Física y Salud</h5>
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Nivel de actividad física*</Form.Label>
                <Form.Select 
                  name="act_fisica" 
                  value={formData.act_fisica} 
                  onChange={handleChange}
                  required
                  size="sm"
                >
                  <option value="">Selecciona tu nivel</option>
                  <option value="sedentario">Sedentario (poco ejercicio)</option>
                  <option value="ligero">Ligero (1-3 días/semana)</option>
                  <option value="moderado">Moderado (3-5 días/semana)</option>
                  <option value="activo">Activo (6-7 días/semana)</option>
                  <option value="intenso">Muy activo (ejercicio intenso)</option>
                </Form.Select>
              </Form.Group>
              
              <Card className="mb-3">
                <Card.Body className="p-3">
                  <Card.Title className="mb-2 fs-6">Condiciones de Salud</Card.Title>
                  <Row className="g-2">
                    <Col xs={12} sm={6}>
                      <Form.Check 
                        type="checkbox"
                        id="diabetes-check"
                        label={
                          <span className="d-flex align-items-center">
                            <MdOutlineMedicalServices className="me-2 text-danger" />
                            Diabetes
                          </span>
                        }
                        name="diabetes"
                        checked={formData.diabetes === '1'}
                        onChange={handleCheckboxChange}
                        className="mb-2"
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Check 
                        type="checkbox"
                        id="hipertension-check"
                        label={
                          <span className="d-flex align-items-center">
                            <RiMentalHealthLine className="me-2 text-primary" />
                            Hipertensión
                          </span>
                        }
                        name="hipertension"
                        checked={formData.hipertension === '1'}
                        onChange={handleCheckboxChange}
                        className="mb-2"
                      />
                    </Col>
                  </Row>
                  
                  <Form.Check 
                    type="checkbox"
                    id="otra-enfermedad-check"
                    label="Otras condiciones médicas"
                    name="otra_enfermedad"
                    checked={formData.otra_enfermedad === '1'}
                    onChange={handleCheckboxChange}
                    className="mb-2"
                  />
                  {formData.otra_enfermedad === '1' && (
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Describe tu condición"
                      name="otra_enfermedad_desc"
                      value={formData.otra_enfermedad_desc}
                      onChange={handleChange}
                      className="mt-2"
                      size="sm"
                    />
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
          
          {/* Paso 2: Medicamentos y consumo calórico */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-warning text-white rounded-circle p-2 d-flex align-items-center justify-content-center me-2" style={{width: '36px', height: '36px'}}>
                  <FaPills size={16} />
                </div>
                <h5 className="mb-0">Medicamentos y Hábitos</h5>
              </div>
              
              <Card className="mb-3">
                <Card.Body className="p-3">
                  <Form.Check 
                    type="checkbox"
                    id="medicamento-check"
                    label={
                      <span className="d-flex align-items-center">
                        <FaPills className="me-2 text-warning" />
                        ¿Tomas algún medicamento actualmente?
                      </span>
                    }
                    name="toma_medicamento"
                    checked={formData.toma_medicamento === '1'}
                    onChange={handleCheckboxChange}
                    className="mb-2"
                  />
                  {formData.toma_medicamento === '1' && (
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Lista de medicamentos (nombre, dosis, frecuencia)"
                      name="medicamento_descrip"
                      value={formData.medicamento_descrip}
                      onChange={handleChange}
                      className="mt-2"
                      size="sm"
                    />
                  )}
                </Card.Body>
              </Card>
              
              <Card className="mb-3">
                <Card.Body className="p-3">
                  <Form.Check 
                    type="checkbox"
                    id="calorias-check"
                    label={
                      <span className="d-flex align-items-center">
                        <FaFireAlt className="me-2 text-danger" />
                        ¿Llevas control de tu consumo calórico?
                      </span>
                    }
                    name="consumo_calorias"
                    checked={formData.consumo_calorias === '1'}
                    onChange={handleCheckboxChange}
                    className="mb-2"
                  />
                  {formData.consumo_calorias === '1' && (
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Describe cómo llevas el control"
                      name="calorias_descrip"
                      value={formData.calorias_descrip}
                      onChange={handleChange}
                      className="mt-2"
                      size="sm"
                    />
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
          
          {/* Paso 3: Alergias */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-danger text-white rounded-circle p-2 d-flex align-items-center justify-content-center me-2" style={{width: '36px', height: '36px'}}>
                  <FaAllergies size={16} />
                </div>
                <h5 className="mb-0">Alergias e Intolerancias</h5>
              </div>
              
              <Alert variant="info" className="d-flex align-items-start p-2 mb-3">
                <FaExclamationTriangle className="me-2 mt-1 flex-shrink-0" />
                <div className="small">
                  Información crucial para evitar recomendaciones de alimentos que puedan afectar tu salud.
                </div>
              </Alert>
              
              <Card className="mb-3">
                <Card.Body className="p-3">
                  <Form.Group>
                    <Form.Label className="fw-bold d-flex align-items-center mb-2">
                      <FaAllergies className="me-2 text-danger" />
                      Alergias o intolerancias
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Ej: Alergia a mariscos, intolerancia a lactosa, etc."
                      name="alergias"
                      value={formData.alergias}
                      onChange={handleChange}
                      size="sm"
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
          )}
          
          {/* Paso 4: Metas */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center me-2" style={{width: '36px', height: '36px'}}>
                  <FaBullseye size={16} />
                </div>
                <h5 className="mb-0">Tus Metas Nutricionales</h5>
              </div>
              
              <Card className="mb-3">
                <Card.Body className="p-3">
                  <Form.Group>
                    <Form.Label className="fw-bold d-flex align-items-center mb-2">
                      <FaHeartbeat className="me-2 text-success" />
                      Objetivos principales*
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Ej: Perder peso, ganar masa muscular, mejorar energía, etc."
                      name="metas"
                      value={formData.metas}
                      onChange={handleChange}
                      size="sm"
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
          )}
          
          <div className="d-flex justify-content-between mt-4">
            {step > 1 ? (
              <Button 
                variant="outline-secondary" 
                onClick={prevStep}
                size="sm"
                className="d-flex align-items-center px-3"
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
                size="sm"
                className="d-flex align-items-center px-3"
              >
                Siguiente <FaChevronRight className="ms-1" />
              </Button>
            ) : (
              <Button 
                variant="success" 
                type="submit"
                size="sm"
                className="d-flex align-items-center px-3"
              >
                <FaCheckCircle className="me-1" /> {hasQuestionnaire ? 'Actualizar' : 'Enviar'}
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CuestionarioModal;