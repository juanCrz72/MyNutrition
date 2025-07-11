import { Router } from "express";
import {
  getCat_perfiles,
  createCat_perfil,
  updateCat_perfil,
  deleteCat_perfil
} from "../controllers/Perfiles.Controller.js";

const router = Router();

router.get("/", getCat_perfiles);
router.post("/create", createCat_perfil);
router.put("/update/:id", updateCat_perfil);
router.delete("/delete/:id", deleteCat_perfil);

export default router;
