import { Router } from "express";
import { getPersonasPlanes, createPersonaPlan, updatePersonaPlan, deletePersonaPlan, deactivatePlan, checkPlansMiddleware } 
from "../controllers/PersonaPlan.Controller.js";

const router = Router();
// Middleware que verifica planes expirados en rutas relevantes
router.use(checkPlansMiddleware);

router.get("/",getPersonasPlanes); 
router.post("/create",createPersonaPlan);
router.put("/update/:id", updatePersonaPlan); 
router.delete("/delete/:id", deletePersonaPlan); 
router.delete("/desactivate/:id", deactivatePlan); 

export default router; 