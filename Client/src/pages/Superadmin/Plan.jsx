import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaInfoCircle
} from "react-icons/fa";
import { 
  getCat_planjs, 
  createCat_Planjs, 
  updateCat_Planjs, 
  deleteCat_Planjs 
} from '../../assets/js/Plan.js'; // Cambiado la ruta de importación
import { Cat_planCRUD } from './PlanCRUD.jsx';

function Cat_plan() {
  const [planList, setPlanList] = useState([]);
  const [catPlanData, setCatPlanData] = useState({
    plan_nombre: '',
    plan_duracion: '',
    plan_estado: 1
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchPlans = async () => {
      await getCat_planjs(setPlanList);
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetForm = () => {
    setCatPlanData({ plan_nombre: '', plan_duracion: '', plan_estado: 1 });
  };

  const showPlanInfo = (plan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleCreatePlan = async () => {
    try {
      await createCat_Planjs(catPlanData, setShowModal, () => getCat_planjs(setPlanList));
      resetForm();
    } catch (error) {
      console.error("Error al crear el plan:", error);
    }
  };

  const handleUpdatePlan = async () => {
    try {
      if (!selectedPlan) return;
      await updateCat_Planjs(
        selectedPlan.idPlan, 
        catPlanData, 
        setShowEditModal, 
        () => getCat_planjs(setPlanList)
      );
      resetForm();
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error al actualizar el plan:", error);
    }
  };

  const handleDeletePlan = async () => {
    try {
      if (!selectedPlan) return;
      await deleteCat_Planjs(
        selectedPlan.idPlan, 
        () => getCat_planjs(setPlanList)
      );
      setShowDeleteModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error al eliminar el plan:", error);
    }
  };

  const filteredPlans = planList.filter((plan) =>
    plan.plan_nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 text-dark fw-bold">
          <FaList className="me-2" /> Planes
        </h2>
        <div>
          <button className="crud-btn crud-btn-success text-white"
            onClick={() => { resetForm(); setSelectedPlan(null); setShowModal(true); }}>
            <FaPlus className="me-1" /> Nuevo Plan
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="crud-search-container">
            <FaSearch className="crud-search-icon" />
            <input
              type="text"
              className="form-control crud-search-input ps-4"
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nombre del plan..."
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>Mostrar {size}</option>
            ))}
          </select>
        </div>
      </div>

      {isMobile ? (
        <div className="row">
          {currentItems.length ? currentItems.map(plan => (
            <div key={plan.idPlan} className="col-12 mb-3">
              <div className="card crud-card">
                <div className="card-body">
                  <h5 className="card-title">{plan.plan_nombre}</h5>
                  <p><strong>Duración:</strong> {plan.plan_duracion} días</p>
                  <p><strong>Estado:</strong> {plan.plan_estado === 1 ? "ACTIVO" : "INACTIVO"}</p>
                  <div className="d-flex gap-2">
                    <button className="crud-btn btn-info btn-sm text-white" onClick={() => showPlanInfo(plan)}><FaInfoCircle /></button>
                    <button className="btn btn-warning btn-sm text-white" onClick={() => { setSelectedPlan(plan); setCatPlanData(plan); setShowEditModal(true); }}><FaEdit /></button>
                    <button className="crud-btn btn-warning text-white btn-sm" onClick={() => { setSelectedPlan(plan); setShowDeleteModal(true); }}><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center py-4 text-muted">No hay planes registrados</div>
          )}
        </div>
      ) : (
        <div className="card crud-card">
          <div className="table-responsive">
            <table className="table table-hover crud-table mb-0">
              <thead>
                <tr><th>Nombre</th><th>Duración</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {currentItems.length ? currentItems.map(plan => (
                  <tr key={plan.idPlan}>
                    <td>{plan.plan_nombre}</td>
                    <td>{plan.plan_duracion} días</td>
                    <td>{plan.plan_estado === 1 ? "ACTIVO" : "INACTIVO"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-info btn-sm text-white" onClick={() => showPlanInfo(plan)}><FaInfoCircle /></button>
                        <button className="btn btn-warning btn-sm text-white" onClick={() => { setSelectedPlan(plan); setCatPlanData(plan); setShowEditModal(true); }}><FaEdit /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => { setSelectedPlan(plan); setShowDeleteModal(true); }}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-4 text-muted">No hay planes registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">Página {currentPage} de {totalPages}</span>
        <div className="btn-group">
          <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Anterior</button>
          <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Siguiente</button>
        </div>
      </div>

      <Cat_planCRUD
        formData={{ Cat_planData: catPlanData, setCat_planData: setCatPlanData }}
        modals={{ 
          showModal, 
          setShowModal, 
          showEditModal, 
          setShowEditModal, 
          showDeleteModal, 
          setShowDeleteModal 
        }}
        handlers={{
          handleAdd: handleCreatePlan,
          handleUpdate: handleUpdatePlan,
          handleDelete: handleDeletePlan
        }}
        selectedCat_plan={selectedPlan}
      />

      {selectedPlan && showPlanModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header text-white" style={{ backgroundColor: 'rgba(52,73,94,255)' }}>
                <h5 className="modal-title">Información del Plan</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPlanModal(false)}></button>
              </div>
              <div className="modal-body">
                <h3>{selectedPlan.plan_nombre}</h3>
                <p><strong>Duración:</strong> {selectedPlan.plan_duracion} días</p>
                <p><strong>Estado:</strong> {selectedPlan.plan_estado === 1 ? "ACTIVO" : "INACTIVO"}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setShowPlanModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cat_plan;