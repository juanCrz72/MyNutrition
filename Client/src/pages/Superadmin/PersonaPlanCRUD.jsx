import { Modal, Button, Form } from 'react-bootstrap';

export function PersonaPlanCRUD({ formData, modals, handlers, selectedPlan }) {
  // Proporcionar valores por defecto para evitar undefined
  const {
    idPersona = "", setIdPersona = () => {},
    idPlan = "", setIdPlan = () => {},
    activo_plan = 1, setActivoPlan = () => {},
    personasList = [],  // Valor por defecto array vacío
    planesCatalog = []  // Valor por defecto array vacío
  } = formData || {};

  const {
    showModal = false, setShowModal = () => {},
    showEditModal = false, setShowEditModal = () => {},
    showDeactivateModal = false, setShowDeactivateModal = () => {},
    showDeleteModal = false, setShowDeleteModal = () => {}
  } = modals || {};

  const {
    handleAdd = () => {},
    handleUpdate = () => {},
    handleDeactivate = () => {},
    handleDelete = () => {}
  } = handlers || {};

  return (
    <>
      {/* Modal para agregar nuevo plan */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Nuevo Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Persona</Form.Label>
              <Form.Select
                value={idPersona}
                onChange={(e) => setIdPersona(e.target.value)}
                required
              >
                <option value="">Seleccione una persona</option>
                {personasList.map(persona => (
                  <option key={persona.idpersona} value={persona.idpersona}>
                    {persona.nombre} {persona.apellidos}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Plan</Form.Label>
              <Form.Select
                value={idPlan}
                onChange={(e) => setIdPlan(e.target.value)}
                required
              >
                <option value="">Seleccione un plan</option>
                {planesCatalog.map(plan => (
                  <option key={plan.idPlan} value={plan.idPlan}>
                    {plan.plan_nombre} ({plan.plan_duracion} días)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Asignar Plan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar plan */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Plan de {selectedPlan?.nombre} {selectedPlan?.apellidos}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Plan</Form.Label>
              <Form.Select
                value={idPlan}
                onChange={(e) => setIdPlan(e.target.value)}
                required
              >
                <option value="">Seleccione un plan</option>
                {planesCatalog.map(plan => (
                  <option key={plan.idPlan} value={plan.idPlan}>
                    {plan.plan_nombre} ({plan.plan_duracion} días)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={activo_plan}
                onChange={(e) => setActivoPlan(parseInt(e.target.value))}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Actualizar Plan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para desactivar plan */}
      <Modal show={showDeactivateModal} onHide={() => setShowDeactivateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Desactivar Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas desactivar el plan de {selectedPlan?.nombre} {selectedPlan?.apellidos}?
          <br /><br />
          <strong>Plan:</strong> {selectedPlan?.plan_nombre}<br />
          <strong>Fecha término:</strong> {selectedPlan?.termino_plan ? new Date(selectedPlan.termino_plan).toLocaleDateString() : 'N/A'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeactivateModal(false)}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={handleDeactivate}>
            Desactivar Plan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para eliminar plan */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar permanentemente el plan de {selectedPlan?.nombre} {selectedPlan?.apellidos}?
          <br /><br />
          <strong>Plan:</strong> {selectedPlan?.plan_nombre}<br />
          <strong>Fecha término:</strong> {selectedPlan?.termino_plan ? new Date(selectedPlan.termino_plan).toLocaleDateString() : 'N/A'}
          <br /><br />
          <span className="text-danger">Esta acción no se puede deshacer.</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar Permanentemente
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}