import express from 'express';
import {  subirImagenAlimento,
  obtenerImagenPorAlimento,
  obtenerTodasLasImagenesAlimentos,
  eliminarImagenAlimento
} from '../controllers/DocumentosAlimentos.Controller.js';

const router = express.Router();

router.post('/upload-image', subirImagenAlimento);
router.get('/imagen/:idAlimento', obtenerImagenPorAlimento);
router.get('/imagenes', obtenerTodasLasImagenesAlimentos);
router.delete('/imagen/:id', eliminarImagenAlimento);


export default router;
