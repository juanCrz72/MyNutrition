import { Router } from "express";
import { getPaciente, createPaciente, updatePaciente, deletePaciente} 
from "../controllers/Paciente.Controller.js";

const router = Router();
//Nombre de las rutas para acceder a los datos
router.get("/",getPaciente); //Ver todos los pacientes
router.post("/create",createPaciente); //Crear un paciente
router.put("/update/:idPaciente", updatePaciente); //Actualizar un paciente
router.delete("/delete/:idPaciente", deletePaciente); //Eliminar un paciente

export default router;