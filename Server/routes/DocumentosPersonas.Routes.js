import express from 'express';
import {  subirImagen,
  obtenerImagenPorPersona,
  obtenerTodasLasImagenes,
  eliminarImagen
} from '../controllers/DocumentosPersonas.Controller.js';

const router = express.Router();

router.post('/upload-image', subirImagen);
router.get('/imagen/:idPersona', obtenerImagenPorPersona);
router.get('/imagenes', obtenerTodasLasImagenes);
router.delete('/imagen/:id', eliminarImagen);


export default router;