import { Router } from "express";
import { getPersonas,
  createPersona,
  updatePersona,
  deletePersona, getPersonaById} 
from "../controllers/Persona.Controller.js";

const router = Router();

router.get("/",getPersonas); 
router.post("/create",createPersona); 
router.put("/update/:idpersona", updatePersona); 
router.delete("/delete/:idpersona", deletePersona);
router.get("/:idpersona", getPersonaById); // Obtener persona por ID
//router.post('/upload-image', uploadImage); // Subir imagen de perfil


export default router;