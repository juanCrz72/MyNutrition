import { Router } from "express";
import { getPaises, createPais, updatePais, deletePais} 
from "../controllers/Paises.Controller.js";

const router = Router();

router.get("/",getPaises); 
router.post("/create",createPais);
router.put("/update/:idPais", updatePais); 
router.delete("/delete/:idPais", deletePais); 

export default router;