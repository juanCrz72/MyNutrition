import express from "express";
import cors from "cors";

import indexRoutes from "./routes/index.Routes.js";

//------------------------------------- EJEMPLOS------------------------------------------------------
import pacienteRoutes from "./routes/Paciente.Routes.js";

//---------------------------------- IMPORTACIÓN DE RUTAS --------------------------------------------
import personasRoutes from "./routes/Persona.Routes.js";
import paisesRoutes from "./routes/Paises.Routes.js";
import dietas from "./routes/Dietas.Routes.js";
import bitacoraRoutes from "./routes/Bitacora.Routes.js";

//----------------------------------- ALIMENTOS -----------------------------------
import alimentosRoutes from "./routes/Alimentos.Routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/",indexRoutes);

//--------------------------------------------- RUTAS -----------------------------------------
app.use("/Paciente", pacienteRoutes); // Rutas para Paciente para la api (front)
app.use("/Paises", paisesRoutes); // Rutas para Países para la api (front)
app.use("/Alimentos", alimentosRoutes); // Rutas para Alimentos para la api (front)
app.use("/Personas", personasRoutes); // Rutas para Personas para la api (front)
app.use("/Dietas", dietas); // Rutas para Dietas para la api (front)
app.use("/Bitacora", bitacoraRoutes); // Rutas para Bitácora para la api (front)

export default app;
