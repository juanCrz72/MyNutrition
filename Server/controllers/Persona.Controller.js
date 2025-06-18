import { db } from "../db/connection.js";

// Obtener todas las personas con sus países y planes
export const getPersonas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.idpersona,
        p.nombre,
        p.apellidos,
        p.fecha_nacimiento,
        p.sexo,
        p.edad,
        p.altura,
        p.peso,
        p.img_perfil,
        p.tipo_persona,
        p.idPais,
        pais.nombre_pais,
        p.idPlan,
        plan.plan_nombre,
        p.activo
      FROM persona p
      JOIN cat_paises pais ON p.idPais = pais.idPais
      LEFT JOIN cat_planes plan ON p.idPlan = plan.idPlan
      ORDER BY p.idpersona DESC
    `);
    
    if (rows.length > 0) {
      res.json({ message: "Personas obtenidas correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron personas" });
    }
  } catch (error) {
    console.error("Error al obtener personas:", error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

// Crear una nueva persona
export const createPersona = async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      fecha_nacimiento,
      sexo,
      edad,
      altura,
      peso,
      img_perfil = "",
      tipo_persona = 0,
      idPais,
      idPlan,
      activo = 1
    } = req.body;

    if (!nombre || !apellidos || !sexo || !edad || !altura || !peso || !idPais) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const fechaNacimientoFinal = fecha_nacimiento && fecha_nacimiento.trim() !== '' ? fecha_nacimiento : null;
    const idPlanFinal = idPlan && idPlan !== '' ? parseInt(idPlan) : null;

    const campos = [
      "nombre", "apellidos", "fecha_nacimiento", "sexo", "edad",
      "altura", "peso", "img_perfil", "tipo_persona", "idPais", "activo"
    ];
    const valores = [
      nombre, apellidos, fechaNacimientoFinal, sexo, edad,
      altura, peso, img_perfil, tipo_persona, idPais, activo
    ];

    if (idPlanFinal !== null) {
      campos.push("idPlan");
      valores.push(idPlanFinal);
    }

    const query = `INSERT INTO persona (${campos.join(", ")}) VALUES (${campos.map(() => "?").join(", ")})`;
    const [result] = await db.query(query, valores);

    res.status(201).json({
      message: "Persona creada correctamente",
      idPersona: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear persona:", error);
    res.status(500).json({ message: "Error al crear la persona", error: error.message });
  }
};



// Actualizar persona
export const updatePersona = async (req, res) => {
  try {
    const { idpersona } = req.params;
    const {
      nombre,
      apellidos,
      fecha_nacimiento,
      sexo,
      edad,
      altura,
      peso,
      img_perfil = "",
      tipo_persona = 0,
      idPais,
      idPlan,
      activo = 1
    } = req.body;

    if (!nombre || !apellidos || !sexo || !edad || !altura || !peso || !idPais) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const fechaNacimientoFinal = fecha_nacimiento && fecha_nacimiento.trim() !== '' ? fecha_nacimiento : null;
    const idPlanFinal = idPlan && idPlan !== '' ? parseInt(idPlan) : null;

    const campos = [
      "nombre = ?", "apellidos = ?", "fecha_nacimiento = ?", "sexo = ?", "edad = ?",
      "altura = ?", "peso = ?", "img_perfil = ?", "tipo_persona = ?", "idPais = ?", "activo = ?"
    ];
    const valores = [
      nombre, apellidos, fechaNacimientoFinal, sexo, edad,
      altura, peso, img_perfil, tipo_persona, idPais, activo
    ];

    if (idPlanFinal !== null) {
      campos.push("idPlan = ?");
      valores.push(idPlanFinal);
    }

    valores.push(idpersona);

    const query = `UPDATE persona SET ${campos.join(", ")} WHERE idpersona = ?`;
    const [result] = await db.query(query, valores);

    if (result.affectedRows > 0) {
      res.json({ message: "Persona actualizada correctamente" });
    } else {
      res.status(404).json({ message: "Persona no encontrada" });
    }
  } catch (error) {
    console.error("Error al actualizar persona:", error);
    res.status(500).json({ message: "Error al actualizar", error: error.message });
  }
};



// Eliminar persona
export const deletePersona = async (req, res) => {
  try {
    const { idpersona } = req.params;

    const [result] = await db.query("DELETE FROM persona WHERE idpersona = ?", [idpersona]);

    if (result.affectedRows > 0) {
      res.json({ message: "Persona eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Persona no encontrada" });
    }
  } catch (error) {
    console.error("Error al eliminar persona:", error);
    res.status(500).json({ message: "Error al eliminar", error: error.message });
  }
};
