import './css/crud-styles.css'
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

function NotFound() {
  return (
    <div className="container-fluid py-4">
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaExclamationTriangle className="text-warning me-2" />
          Página no encontrada
        </h2>
      </div>

      {/* Contenido */}
      <div className="card crud-card">
        <div className="card-body text-center py-5">
          <h1 className="display-4 text-danger mb-4">404 - Página no encontrada</h1>
          <p className="lead mb-4">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
          
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="crud-btn crud-btn-primary text-white">
              Volver al inicio
            </Link>
            <Link to="/inventario" className="crud-btn crud-btn-success text-white">
              Ir al inventario
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;