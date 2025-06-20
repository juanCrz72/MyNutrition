import { Router } from "express";
import { getCat_plan, createCat_Plan, updateCat_Plan, deleteCat_Plan } 
from "../controllers/Plan.Controller.js";

const router = Router();
router.get("/", getCat_plan);
router.post("/create", createCat_Plan);
router.put("/update/:id", updateCat_Plan);
router.delete("/delete/:id", deleteCat_Plan);

export default router;