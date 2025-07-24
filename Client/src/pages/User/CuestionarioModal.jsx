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

const CuestionarioModal = ({ show, onHide, id_persona, idPersona, refreshDashboard }) => {
  // Unificamos los posibles nombres del prop en una sola variable
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
    console.log('ID de persona:', personaId);
    if (personaId) {
      checkExistingQuestionnaire();
    }
  }, [personaId]);

  const checkExistingQuestionnaire = async () => {
    try {
      console.log('Buscando cuestionario para personaId:', personaId);
      const cuestionario = await getQuestionarioByPersonaIdjs(personaId);
      console.log('Resultado de getQuestionarioByPersonaIdjs:', cuestionario);
      
      if (cuestionario) {
        setHasQuestionnaire(true);
        // Si ya existe, cargamos los datos existentes
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
    // Validar campos antes de avanzar
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
    
    // Validación final antes de enviar
    if (!formData.act_fisica || !formData.metas) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    // Verificamos que tengamos el ID de la persona
    if (!personaId) {
      Swal.fire('Error', 'No se ha identificado al usuario correctamente', 'error');
      return;
    }

    try {
      await createQuestionariojs(
        personaId, // Usamos la variable unificada aquí
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
      <Modal.Header closeButton className="bg-gradient-primary text-white">
        <Modal.Title className="d-flex align-items-center">
          <GiHealthNormal size={28} className="me-3" />
          <div>
            <h3 className="mb-0">Cuestionario de Salud Integral</h3>
            <small className="opacity-75">Paso {step} de 4</small>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <ProgressBar now={(step / 4) * 100} className="mb-4 progress-custom" />
        
        <Form onSubmit={handleSubmitQuestionnaire} className="questionnaire-form">
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
                <Form.Label className="fw-bold">Nivel de actividad física*</Form.Label>
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
                          onChange={handleCheckboxChange}
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
                          onChange={handleCheckboxChange}
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
                      onChange={handleCheckboxChange}
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
                      onChange={handleCheckboxChange}
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
                        />
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
                      onChange={handleCheckboxChange}
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
                      ¿Cuáles son tus principales objetivos con la nutrición?*
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
                  </Form.Group>
                </Card.Body>
              </Card>
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
                <FaCheckCircle className="me-2" /> {hasQuestionnaire ? 'Actualizar' : 'Enviar'} Cuestionario
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CuestionarioModal;