import  { Router  } from "express";
import { getUsuarios, getUsuario, 
  createUsuario,
  updateUsuario,
  deleteUsuario} from "../controllers/Usuarios.Controller.js";

  const router = Router();
  router.get("/", getUsuarios);
  router.get("/:id", getUsuario);
  router.post("/create", createUsuario);
  router.put("/update/:id", updateUsuario);
  router.delete("/delete/:id", deleteUsuario);

export default router;