import { Router } from "express";
import { getPersonas,
  createPersona,
  updatePersona,
  deletePersona} 
from "../controllers/Persona.Controller.js";

const router = Router();

router.get("/",getPersonas); 
router.post("/create",createPersona); 
router.put("/update/:idpersona", updatePersona); 
router.delete("/delete/:idpersona", deletePersona);

export default router;