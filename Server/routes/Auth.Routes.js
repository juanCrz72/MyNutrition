import { Router } from 'express';
import { register, login, verifyToken } from '../controllers/Auth.Controller.js';

const router = Router();

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyToken);


export default router;