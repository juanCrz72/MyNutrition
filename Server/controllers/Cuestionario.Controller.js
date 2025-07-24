import { db } from "../db/connection.js";
import { httpServer, io } from './../server.js';

// Obtener todos los cuestionarios
export const getPersonasQuestionarios = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pq.*, p.nombre, p.apellidos 
      FROM persona_questionario pq
      JOIN persona p ON pq.id_persona = p.idpersona
      ORDER BY pq.date_add DESC
    `);
    
    if (rows.length > 0) {
      res.json({ message: "Cuestionarios obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron cuestionarios registrados" });
    }
  } catch (error) {
    console.error("Error al obtener cuestionarios:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Obtener cuestionario por ID de persona
export const getQuestionarioByPersonaId = async (req, res) => {
  try {
    const { id_persona } = req.params;
    
    const [rows] = await db.query(`
      SELECT pq.*, p.nombre, p.apellidos 
      FROM persona_questionario pq
      JOIN persona p ON pq.id_persona = p.idpersona
      WHERE pq.id_persona = ?
      ORDER BY pq.date_add DESC
      LIMIT 1
    `, [id_persona]);
    
    if (rows.length > 0) {
      res.json({ message: "Cuestionario obtenido correctamente", data: rows[0] });
    } else {
      res.status(404).json({ message: "No se encontró cuestionario para esta persona" });
    }
  } catch (error) {
    console.error("Error al obtener cuestionario:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Crear nuevo cuestionario
export const createPersonaQuestionario = async (req, res) => {
  try {
    const { 
      id_persona,
      act_fisica,
      diabetes,
      hipertension,
      otra_enfermedad,
      toma_medicamento,
      medicamento_descrip,
      consumo_calorias,
      calorias_descrip,
      alergias,
      metas
    } = req.body;
    
    // Validar campos requeridos
    if (!id_persona || !act_fisica || !diabetes || !hipertension || !otra_enfermedad || 
        !toma_medicamento || !consumo_calorias) {
      return res.status(400).json({ 
        message: "Todos los campos son requeridos excepto descripciones opcionales" 
      });
    }
    
    // Verificar que la persona existe
    const [persona] = await db.query(
      "SELECT idpersona FROM persona WHERE idpersona = ?",
      [id_persona]
    );
    
    if (persona.length === 0) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    
    // Insertar nuevo cuestionario
    const [result] = await db.query(
      `INSERT INTO persona_questionario 
       (id_persona, act_fisica, diabetes, hipertension, otra_enfermedad, toma_medicamento,
        medicamento_descrip, consumo_calorias, calorias_descrip, alergias, metas, date_add) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id_persona,
        act_fisica,
        diabetes,
        hipertension,
        otra_enfermedad,
        toma_medicamento,
        medicamento_descrip || '',
        consumo_calorias,
        calorias_descrip || '',
        alergias || '',
        metas || ''
      ]
    );
    
    // Obtener el cuestionario recién creado
    const [newQuestionario] = await db.query(`
      SELECT pq.*, p.nombre, p.apellidos 
      FROM persona_questionario pq
      JOIN persona p ON pq.id_persona = p.idpersona
      WHERE pq.id = ?
    `, [result.insertId]);

    io.emit('new-cuestionario', newQuestionario [0]);    // Notificación cuando se crea
    
    res.status(201).json({
      message: "Cuestionario creado correctamente",
      data: newQuestionario[0]
    });
    
  } catch (error) {
    console.error("Error al crear cuestionario:", error);
    res.status(500).json({ 
      message: "Algo salió mal al crear el cuestionario", 
      error: error.message 
    });
  }
};

// Actualizar cuestionario
export const updatePersonaQuestionario = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      act_fisica,
      diabetes,
      hipertension,
      otra_enfermedad,
      toma_medicamento,
      medicamento_descrip,
      consumo_calorias,
      calorias_descrip,
      alergias,
      metas
    } = req.body;
    
    // Validar campos requeridos
    if (!act_fisica || !diabetes || !hipertension || !otra_enfermedad || 
        !toma_medicamento || !consumo_calorias) {
      return res.status(400).json({ 
        message: "Todos los campos son requeridos excepto descripciones opcionales" 
      });
    }
    
    // Actualizar cuestionario
    const [result] = await db.query(
      `UPDATE persona_questionario 
       SET act_fisica = ?, diabetes = ?, hipertension = ?, otra_enfermedad = ?,
           toma_medicamento = ?, medicamento_descrip = ?, consumo_calorias = ?,
           calorias_descrip = ?, alergias = ?, metas = ?
       WHERE id = ?`,
      [
        act_fisica,
        diabetes,
        hipertension,
        otra_enfermedad,
        toma_medicamento,
        medicamento_descrip || '',
        consumo_calorias,
        calorias_descrip || '',
        alergias || '',
        metas || '',
        id
      ]
    );
    
    if (result.affectedRows > 0) {
      // Obtener el cuestionario actualizado
      const [updatedQuestionario] = await db.query(`
        SELECT pq.*, p.nombre, p.apellidos 
        FROM persona_questionario pq
        JOIN persona p ON pq.id_persona = p.idpersona
        WHERE pq.id = ?
      `, [id]);

      io.emit('update-cuestionario', updatedQuestionario [0]);   // Notificación cuando se actualiza
      
      res.json({
        message: "Cuestionario actualizado correctamente",
        data: updatedQuestionario[0]
      });
    } else {
      res.status(404).json({ message: "Cuestionario no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar cuestionario:", error);
    res.status(500).json({ 
      message: "Algo salió mal al actualizar el cuestionario", 
      error: error.message 
    });
  }
};

// Eliminar cuestionario
export const deletePersonaQuestionario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      "DELETE FROM persona_questionario WHERE id = ?",
      [id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: "Cuestionario eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Cuestionario no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar cuestionario:", error);
    res.status(500).json({ 
      message: "Algo salió mal al eliminar el cuestionario", 
      error: error.message 
    });
  }
};