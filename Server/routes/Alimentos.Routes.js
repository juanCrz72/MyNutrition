import { Router } from "express";
import { getAlimentos, createAlimento, updateAlimento, deleteAlimento} 
from "../controllers/Alimentos.Controller.js";

const router = Router();

router.get("/",getAlimentos); 
router.post("/create",createAlimento);
router.put("/update/:id", updateAlimento); 
router.delete("/delete/:id", deleteAlimento); 

export default router;