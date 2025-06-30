import { db } from "../db/connection.js";

// Obtener todos los planes de personas (activos e inactivos con filtro)
export const getPersonasPlanes = async (req, res) => {
  try {
    const { activo } = req.query; // Opcional: filtrar por estado activo (1/0)
    
    let query = `
      SELECT pp.*, p.nombre, p.apellidos, cp.plan_nombre, cp.plan_duracion 
      FROM persona_plan pp
      JOIN persona p ON pp.idPersona = p.idpersona
      JOIN cat_planes cp ON pp.idPlan = cp.idPlan
    `;
    
    const params = [];
    
    query += ` ORDER BY pp.created DESC`;
    
    const [rows] = await db.query(query, params);
    
    // Verificar y actualizar estados de planes que hayan expirado
    await checkExpiredPlans();
    
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

// Función para verificar y desactivar planes expirados
const checkExpiredPlans = async () => {
  try {
    const [expiredPlans] = await db.query(`
      SELECT pp.id 
      FROM persona_plan pp
      JOIN cat_planes cp ON pp.idPlan = cp.idPlan
      WHERE pp.activo_plan = 1 
      AND pp.termino_plan < CURDATE()
    `);
    
    if (expiredPlans.length > 0) {
      await db.query(`
        UPDATE persona_plan 
        SET activo_plan = 0 
        WHERE id IN (?)
      `, [expiredPlans.map(plan => plan.id)]);
      
      console.log(`Desactivados ${expiredPlans.length} planes expirados`);
    }
  } catch (error) {
    console.error("Error al verificar planes expirados:", error);
  }
};

// Crear nuevo plan para persona con cálculo automático de fechas
export const createPersonaPlan = async (req, res) => {
  try {
    const { idPersona, idPlan } = req.body;
    
    // Validar campos requeridos
    if (!idPersona || !idPlan) {
      return res.status(400).json({ 
        message: "Todos los campos son requeridos: idPersona, idPlan" 
      });
    }
    
    // Verificar que la persona existe y está activa
    const [persona] = await db.query(
      "SELECT idpersona FROM persona WHERE idpersona = ? AND activo = 1",
      [idPersona]
    );
    
    if (persona.length === 0) {
      return res.status(404).json({ message: "Persona no encontrada o inactiva" });
    }
    
    // Obtener detalles del plan seleccionado
    const [plan] = await db.query(
      "SELECT plan_duracion FROM cat_planes WHERE idPlan = ?",
      [idPlan]
    );
    
    if (plan.length === 0) {
      return res.status(404).json({ message: "Plan no encontrado" });
    }
    
    const planDuracion = plan[0].plan_duracion; // Duración en días
    
    // Calcular fechas de inicio y término
    const inicioPlan = new Date();
    const terminoPlan = new Date();
    terminoPlan.setDate(inicioPlan.getDate() + planDuracion);
    
    // Formatear fechas para MySQL (YYYY-MM-DD)
    const formatoFecha = (date) => date.toISOString().split('T')[0];
    
    // Insertar nuevo plan con fechas calculadas
    const [result] = await db.query(
      `INSERT INTO persona_plan 
       (idPersona, idPlan, inicio_plan, termino_plan, activo_plan, created) 
       VALUES (?, ?, ?, ?, 1, NOW())`,
      [idPersona, idPlan, formatoFecha(inicioPlan), formatoFecha(terminoPlan)]
    );
    
    // Obtener el plan recién creado con detalles
    const [newPlan] = await db.query(`
      SELECT pp.*, p.nombre, p.apellidos, cp.plan_nombre, cp.plan_duracion
      FROM persona_plan pp
      JOIN persona p ON pp.idPersona = p.idpersona
      JOIN cat_planes cp ON pp.idPlan = cp.idPlan
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

// Actualizar plan con validación de fechas
export const updatePersonaPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { idPlan, activo_plan } = req.body;
    
    // Validar campos requeridos
    if (!idPlan) {
      return res.status(400).json({ 
        message: "El campo idPlan es requerido" 
      });
    }
    
    // Obtener el plan actual para comparar
    const [currentPlan] = await db.query(
      "SELECT idPlan as currentIdPlan FROM persona_plan WHERE id = ?",
      [id]
    );
    
    if (currentPlan.length === 0) {
      return res.status(404).json({ message: "Plan no encontrado" });
    }
    
    // Si cambió el tipo de plan, recalcular fechas
    let updateQuery = `UPDATE persona_plan SET idPlan = ?, activo_plan = ?`;
    const queryParams = [idPlan, activo_plan];
    
    if (currentPlan[0].currentIdPlan !== idPlan) {
      // Obtener nueva duración del plan
      const [newPlan] = await db.query(
        "SELECT plan_duracion FROM cat_planes WHERE idPlan = ?",
        [idPlan]
      );
      
      if (newPlan.length === 0) {
        return res.status(404).json({ message: "Nuevo plan no encontrado" });
      }
      
      const planDuracion = newPlan[0].plan_duracion;
      const newTerminoPlan = new Date();
      newTerminoPlan.setDate(newTerminoPlan.getDate() + planDuracion);
      
      // Formatear fecha para MySQL
      const formatoFecha = (date) => date.toISOString().split('T')[0];
      
      updateQuery += `, inicio_plan = CURDATE(), termino_plan = ?`;
      queryParams.push(formatoFecha(newTerminoPlan));
    }
    
    updateQuery += ` WHERE id = ?`;
    queryParams.push(id);
    
    // Actualizar plan
    const [result] = await db.query(updateQuery, queryParams);
    
    if (result.affectedRows > 0) {
      // Obtener el plan actualizado
      const [updatedPlan] = await db.query(`
        SELECT pp.*, p.nombre, p.apellidos, cp.plan_nombre 
        FROM persona_plan pp
        JOIN persona p ON pp.idPersona = p.idpersona
        JOIN cat_planes cp ON pp.idPlan = cp.idPlan
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

// Middleware para verificar planes expirados en cada solicitud relevante
export const checkPlansMiddleware = async (req, res, next) => {
  try {
    await checkExpiredPlans();
    next();
  } catch (error) {
    console.error("Error en middleware de verificación de planes:", error);
    next(); // Continuar a pesar del error
  }
};