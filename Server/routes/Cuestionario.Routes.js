import { Router } from "express";
import {
  getPersonasQuestionarios,
  getQuestionarioByPersonaId, 
  createPersonaQuestionario,
  updatePersonaQuestionario,
  deletePersonaQuestionario
} from "../controllers/Cuestionario.controller.js";

const router = Router();

router.get("/", getPersonasQuestionarios); 
router.get("/:id_persona", getQuestionarioByPersonaId);  
router.post("/", createPersonaQuestionario);  
router.put("/:id", updatePersonaQuestionario);
router.delete("/:id", deletePersonaQuestionario);  

export default router;