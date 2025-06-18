import { Router } from "express";
import { getPersonasDietas, createPersonaDieta, updatePersonaDieta, deletePersonaDieta, deactivateDieta} 
from "../controllers/Dieta.Controller.js";

const router = Router();
//Nombre de las rutas para acceder a los datos
router.get("/", getPersonasDietas);
router.post("/create", createPersonaDieta);
router.put("/update/:id", updatePersonaDieta);
router.patch("/deactivate/:id", deactivateDieta);
router.delete("/delete/:id", deletePersonaDieta);

export default router;