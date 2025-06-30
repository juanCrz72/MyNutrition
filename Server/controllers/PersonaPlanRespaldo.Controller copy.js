import { db } from "../db/connection.js";

// Obtener todos los planes de personas
export const getPersonasPlanes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pp.*, p.nombre, p.apellidos, cp.plan_nombre, cp.plan_duracion 
      FROM persona_plan pp
      JOIN persona p ON pp.idPersona = p.idpersona
      JOIN cat_planes cp ON pp.idPlan = cp.idPlan
      WHERE pp.activo_plan = 1
      ORDER BY pp.created DESC
    `);
    
    if (rows.length > 0) {
      res.json({ message: "Planes obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron planes registrados" });
    }
  } catch (error) {
    console.error("Error al obtener planes:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Crear nuevo plan para persona
export const createPersonaPlan = async (req, res) => {
  try {
    const { 
      idPersona, 
      idPlan, 
      inicio_plan, 
      termino_plan 
    } = req.body;
    
    // Validar campos requeridos
    if (!idPersona || !idPlan || !inicio_plan || !termino_plan) {
      return res.status(400).json({ 
        message: "Todos los campos son requeridos: idPersona, idPlan, inicio_plan, termino_plan" 
      });
    }
    
    // Verificar que la persona existe
    const [persona] = await db.query(
      "SELECT idpersona FROM persona WHERE idpersona = ? AND activo = 1",
      [idPersona]
    );
    
    if (persona.length === 0) {
      return res.status(404).json({ message: "Persona no encontrada o inactiva" });
    }
    
    // Insertar nuevo plan
    const [result] = await db.query(
      `INSERT INTO persona_plan 
       (idPersona, idPlan, inicio_plan, termino_plan, activo_plan, created) 
       VALUES (?, ?, ?, ?, 1, NOW())`,
      [idPersona, idPlan, inicio_plan, termino_plan]
    );
    
    // Obtener el plan recién creado
    const [newPlan] = await db.query(`
      SELECT pp.*, p.nombre, p.apellidos 
      FROM persona_plan pp
      JOIN persona p ON pp.idPersona = p.idpersona
      WHERE pp.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      message: "Plan creado correctamente",
      data: newPlan[0]
    });
    
  } catch (error) {
    console.error("Error al crear plan:", error);
    res.status(500).json({ 
      message: "Algo salió mal al crear el plan", 
      error: error.message 
    });
  }
};

// Actualizar plan
export const updatePersonaPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      idPlan, 
      inicio_plan, 
      termino_plan,
      activo_plan 
    } = req.body;
    
    // Validar campos requeridos
    if (!idPlan || !inicio_plan || !termino_plan) {
      return res.status(400).json({ 
        message: "Todos los campos son requeridos: idPlan, inicio_plan, termino_plan" 
      });
    }
    
    // Actualizar plan
    const [result] = await db.query(
      `UPDATE persona_plan 
       SET idPlan = ?, inicio_plan = ?, termino_plan = ?, activo_plan = ?
       WHERE id = ?`,
      [idPlan, inicio_plan, termino_plan, activo_plan, id]
    );
    
    if (result.affectedRows > 0) {
      // Obtener el plan actualizado
      const [updatedPlan] = await db.query(`
        SELECT pp.*, p.nombre, p.apellidos 
        FROM persona_plan pp
        JOIN persona p ON pp.idPersona = p.idpersona
        WHERE pp.id = ?
      `, [id]);
      
      res.json({
        message: "Plan actualizado correctamente",
        data: updatedPlan[0]
      });
    } else {
      res.status(404).json({ message: "Plan no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar plan:", error);
    res.status(500).json({ 
      message: "Algo salió mal al actualizar el plan", 
      error: error.message 
    });
  }
};

// Desactivar plan (borrado lógico)
export const deactivatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      "UPDATE persona_plan SET activo_plan = 0 WHERE id = ?",
      [id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: "Plan desactivado correctamente" });
    } else {
      res.status(404).json({ message: "Plan no encontrado" });
    }
  } catch (error) {
    console.error("Error al desactivar plan:", error);
    res.status(500).json({ 
      message: "Algo salió mal al desactivar el plan", 
      error: error.message 
    });
  }
};

// Eliminar plan físicamente
export const deletePersonaPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      "DELETE FROM persona_plan WHERE id = ?",
      [id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: "Plan eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Plan no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar plan:", error);
    res.status(500).json({ 
      message: "Algo salió mal al eliminar el plan", 
      error: error.message 
    });
  }
};