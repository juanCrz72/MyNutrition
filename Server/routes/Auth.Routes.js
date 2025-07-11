import { Router } from 'express';
import { register, login, verifyToken, completeRegister } from '../controllers/Auth.Controller.js';

const router = Router();

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyToken);

// En tus rutas (auth.routes.js)
router.post('/complete-register', completeRegister);


export default router;