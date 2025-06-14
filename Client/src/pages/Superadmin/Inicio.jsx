import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow" style={{ width: "22rem" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">  Correo Electrónico </label>
              <input  type="email"className="form-control" id="email" placeholder="Ingresa tu correo"required/>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label"> Contraseña</label>
              <input type="password" className="form-control"  id="password" placeholder="Ingresa tu contraseña"  required/>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary"> Iniciar Sesión</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
