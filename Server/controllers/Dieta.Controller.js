import { db } from "../db/connection.js";

// Obtener todas las dietas de personas
export const getPersonasDietas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pd.*, p.nombre, p.apellidos 
      FROM persona_dieta pd
      JOIN persona p ON pd.idPersona = p.idpersona
      WHERE pd.activo = 1
      ORDER BY pd.created DESC
    `);
    
    if (rows.length > 0) {
      res.json({ message: "Dietas obtenidas correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron dietas registradas" });
    }
  } catch (error) {
    console.error("Error al obtener dietas:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Crear nueva dieta para persona
export const createPersonaDieta = async (req, res) => {
  try {
    const { 
      idPersona, 
      calorias, 
      grasas, 
      carbohidratos, 
      proteinas, 
      peso_actual 
    } = req.body;
    
    // Validar campos requeridos
    if (!idPersona || !calorias || !grasas || !carbohidratos || !proteinas) {
      return res.status(400).json({ 
        message: "Todos los campos son requeridos: idPersona, calorias, grasas, carbohidratos, proteinas" 
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
    
    // Insertar nueva dieta
    const [result] = await db.query(
      `INSERT INTO persona_dieta 
       (idPersona, calorias, grasas, carbohidratos, proteinas, peso_actual, activo, created) 
       VALUES (?, ?, ?, ?, ?, ?, 1, NOW())`,
      [idPersona, calorias, grasas, carbohidratos, proteinas, peso_actual]
    );
    
    // Obtener la dieta recién creada
    const [newDiet] = await db.query(`
      SELECT pd.*, p.nombre, p.apellidos 
      FROM persona_dieta pd
      JOIN persona p ON pd.idPersona = p.idpersona
      WHERE pd.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      message: "Dieta creada correctamente",
      data: newDiet[0]
    });
    
  } catch (error) {
    console.error("Error al crear dieta:", error);
    res.status(500).json({ 
      message: "Algo salió mal al crear la dieta", 
      error: error.message 
    });
  }
};

// Actualizar dieta
export const updatePersonaDieta = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      calorias, 
      grasas, 
      carbohidratos, 
      proteinas, 
      peso_actual,
      activo 
    } = req.body;
    
    // Validar campos requeridos
    if (!calorias || !grasas || !carbohidratos || !proteinas) {
      return res.status(400).json({ 
        message: "Todos los campos son requeridos: calorias, grasas, carbohidratos, proteinas" 
      });
    }
    
    // Actualizar dieta
    const [result] = await db.query(
      `UPDATE persona_dieta 
       SET calorias = ?, grasas = ?, carbohidratos = ?, proteinas = ?, 
           peso_actual = ?, activo = ?
       WHERE id = ?`,
      [calorias, grasas, carbohidratos, proteinas, peso_actual, activo, id]
    );
    
    if (result.affectedRows > 0) {
      // Obtener la dieta actualizada
      const [updatedDiet] = await db.query(`
        SELECT pd.*, p.nombre, p.apellidos 
        FROM persona_dieta pd
        JOIN persona p ON pd.idPersona = p.idpersona
        WHERE pd.id = ?
      `, [id]);
      
      res.json({
        message: "Dieta actualizada correctamente",
        data: updatedDiet[0]
      });
    } else {
      res.status(404).json({ message: "Dieta no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar dieta:", error);
    res.status(500).json({ 
      message: "Algo salió mal al actualizar la dieta", 
      error: error.message 
    });
  }
};

// Desactivar dieta (borrado lógico)
export const deactivateDieta = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      "UPDATE persona_dieta SET activo = 0 WHERE id = ?",
      [id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: "Dieta desactivada correctamente" });
    } else {
      res.status(404).json({ message: "Dieta no encontrada" });
    }
  } catch (error) {
    console.error("Error al desactivar dieta:", error);
    res.status(500).json({ 
      message: "Algo salió mal al desactivar la dieta", 
      error: error.message 
    });
  }
};

// Eliminar dieta físicamente
export const deletePersonaDieta = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      "DELETE FROM persona_dieta WHERE id = ?",
      [id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: "Dieta eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Dieta no encontrada" });
    }
  } catch (error) {
    console.error("Error al eliminar dieta:", error);
    res.status(500).json({ 
      message: "Algo salió mal al eliminar la dieta", 
      error: error.message 
    });
  }
};