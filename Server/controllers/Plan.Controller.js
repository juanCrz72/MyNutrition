import { db } from "../db/connection.js";

// Obtener todos los planes
export const getCat_plan = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM cat_planes ORDER BY plan_nombre ASC`);

    if (rows.length > 0) {
      res.json({ message: "Planes obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron planes" });
    }
  } catch (error) {
    console.error("Error al obtener planes:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Crear un nuevo plan con ID incremental y validación
export const createCat_Plan = async (req, res) => {
  try {
    const { plan_nombre, plan_duracion, plan_estado } = req.body;

    if (!plan_nombre || plan_duracion === undefined || plan_estado === undefined) {
      return res.status(400).json({ 
        message: "Los campos 'plan_nombre', 'plan_duracion' y 'plan_estado' son requeridos" 
      });
    }

    // Obtener el último idPlan
    const [[{ maxId }]] = await db.query(`SELECT MAX(idPlan) AS maxId FROM cat_planes`);
    const newId = (maxId || 0) + 1;

    // Verificar que el idPlan generado no exista (por seguridad adicional)
    const [existing] = await db.query(`SELECT idPlan FROM cat_planes WHERE idPlan = ?`, [newId]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "El idPlan generado ya existe. Intenta de nuevo." });
    }

    // Insertar nuevo plan
    await db.query(
      `INSERT INTO cat_planes (idPlan, plan_nombre, plan_duracion, plan_estado)
       VALUES (?, ?, ?, ?)`,
      [newId, plan_nombre, plan_duracion, plan_estado]
    );

    res.status(201).json({ message: "Plan creado correctamente", idPlan: newId });
  } catch (error) {
    console.error("Error al crear el plan:", error);
    res.status(500).json({ message: "Algo salió mal al crear el plan", error: error.message });
  }
};

// Actualizar un plan existente
export const updateCat_Plan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan_nombre, plan_duracion, plan_estado } = req.body;

    if (!plan_nombre || plan_duracion === undefined || plan_estado === undefined) {
      return res.status(400).json({ 
        message: "Los campos 'plan_nombre', 'plan_duracion' y 'plan_estado' son requeridos" 
      });
    }

    const [result] = await db.query(
      `UPDATE cat_planes SET 
        plan_nombre = ?, 
        plan_duracion = ?, 
        plan_estado = ?
      WHERE idPlan = ?`,
      [plan_nombre, plan_duracion, plan_estado, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Plan actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Plan no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el plan:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Eliminar un plan
export const deleteCat_Plan = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM cat_planes WHERE idPlan = ?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Plan eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Plan no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el plan:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
