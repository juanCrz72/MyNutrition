import { useAuth } from '../../context/AuthContext.jsx';

const Home = () => {
    const { user, logout } = useAuth();
    
    return (
        <div className="admin-page">
            <h1>Hola Administrador</h1>
            <p>Bienvenido al panel de administración</p>
            <p>Nombre: {user?.nombre}</p>
            <p>Correo: {user?.correo}</p>
            <p>Perfil: {user?.perfilNombre}</p>
            <button onClick={logout} className="btn btn-danger">
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Home;