import { Router } from "express";
import {getBitacoraComidas, createBitacoraComida, updateBitacoraComida, deleteBitacoraComida} 
from "../controllers/Bitacora.Controller.js";

const router = Router();

router.get("/",getBitacoraComidas); 
router.post("/create",createBitacoraComida);
router.put("/update/:id", updateBitacoraComida); 
router.delete("/delete/:id", deleteBitacoraComida); 

export default router;
