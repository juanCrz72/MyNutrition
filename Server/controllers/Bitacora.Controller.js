import { db } from "../db/connection.js";

// Modificar la función getBitacoraComidas para filtrar por id_usuario
export const getBitacoraComidas = async (req, res) => {
  try {
    const { id_usuario } = req.query; // Cambiado de idpersona a id_usuario

    let query = `
      SELECT 
        bc.*, 
        CONCAT(p.nombre, ' ', p.apellidos) AS nombreUsuario,
        p.edad,
        p.sexo,
        u.id_usuario,
        sa.Alimento,
        sa.Categoria AS categoriaAlimento,
        sa.Energia_kcal,
        sa.Proteina_g,
        sa.Grasa_g,
        sa.Unidad,
        sa.Carbohidratos_g,
        sa.Peso_Neto_g AS peso,
        pd.calorias,
        pd.carbohidratos AS dieta_carbohidratos,
        pd.grasas AS dieta_grasas,
        pd.proteinas AS dieta_proteinas,
        pd.peso_actual AS dieta_peso_actual
      FROM bitacora_comidas bc
      JOIN usuarios u ON bc.id_usuario = u.id_usuario
      JOIN persona p ON u.idPersona = p.idpersona
      JOIN smae_alimentos sa ON bc.id_alimento = sa.id
      LEFT JOIN persona_dieta pd ON p.idpersona = pd.idPersona AND pd.activo = 1
      WHERE p.activo = 1 AND u.activo = 1 AND sa.activo = 1
    `;

    if (id_usuario) {
      query += ` AND u.id_usuario = ${db.escape(id_usuario)}`;
    }

    const [rows] = await db.query(query);

    if (rows.length > 0) {
      res.json({
        message: "Bitácora de comidas obtenida correctamente",
        data: rows,
      });
    } else {
      res.status(404).json({ message: "No se encontraron registros en la bitácora de comidas" });
    }
  } catch (error) {
    console.error("Error al obtener bitácora de comidas:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};


// Obtener todas las entradas de la bitácora de comidas
/* export const getBitacoraComidas = async (req, res) => {
  try {
    const query = `
      SELECT 
        bc.*, 
        CONCAT(p.nombre, ' ', p.apellidos) AS nombreUsuario,
        p.edad,
        p.sexo,
        p.idpersona,
        sa.Alimento,
        sa.Categoria AS categoriaAlimento,
        sa.Energia_kcal,
        sa.Proteina_g,
        sa.Grasa_g,
        sa.Carbohidratos_g
      FROM bitacora_comidas bc
      JOIN usuarios u ON bc.id_usuario = u.id_usuario
      JOIN persona p ON u.idPersona = p.idpersona
      JOIN smae_alimentos sa ON bc.id_alimento = sa.id
      WHERE p.activo = 1 AND u.activo = 1 AND sa.activo = 1
    `;
    
    const [rows] = await db.query(query);

    if (rows.length > 0) {
      res.json({ message: "Bitácora de comidas obtenida correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron registros en la bitácora de comidas" });
    }
  } catch (error) {
    console.error("Error al obtener bitácora de comidas:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
 */
// Modifica la función getBitacoraComidas para aceptar un parámetro de filtrado

/* export const getBitacoraComidas = async (req, res) => {
  try {
    const { idpersona } = req.query;

    let query = `
      SELECT 
        bc.*, 
        CONCAT(p.nombre, ' ', p.apellidos) AS nombreUsuario,
        p.edad,
        p.sexo,
        p.idpersona,

        sa.Alimento,
        sa.Categoria AS categoriaAlimento,
        sa.Energia_kcal,
        sa.Proteina_g,
        sa.Grasa_g,
        sa.Unidad,
        sa.Carbohidratos_g,
        sa.Peso_Neto_g AS peso,

        -- Datos de la dieta personalizada
        pd.calorias,
        pd.carbohidratos AS dieta_carbohidratos,
        pd.grasas AS dieta_grasas,
        pd.proteinas AS dieta_proteinas,
        pd.peso_actual AS dieta_peso_actual

      FROM bitacora_comidas bc
      JOIN usuarios u ON bc.id_usuario = u.id_usuario
      JOIN persona p ON u.idPersona = p.idpersona
      JOIN smae_alimentos sa ON bc.id_alimento = sa.id
      LEFT JOIN persona_dieta pd ON p.idpersona = pd.idPersona AND pd.activo = 1

      WHERE p.activo = 1 AND u.activo = 1 AND sa.activo = 1
    `;

    if (idpersona) {
      query += ` AND p.idpersona = ${db.escape(idpersona)}`;
    }

    const [rows] = await db.query(query);

    if (rows.length > 0) {
      res.json({
        message: "Bitácora de comidas obtenida correctamente",
        data: rows,
      });
    } else {
      res.status(404).json({ message: "No se encontraron registros en la bitácora de comidas" });
    }
  } catch (error) {
    console.error("Error al obtener bitácora de comidas:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
 */


// Crear una nueva entrada en la bitácora de comidas
export const createBitacoraComida = async (req, res) => {
  try {
    const {
      id_usuario,
      tipo_comida,
      contador,
      id_alimento,
      fecha_registro
    } = req.body;

    if (!id_usuario || !tipo_comida || !id_alimento || !fecha_registro) {
      return res.status(400).json({ 
        message: "Los campos obligatorios son: id_usuario, tipo_comida, id_alimento, fecha_registro" 
      });
    }

    const [result] = await db.query(
      `INSERT INTO bitacora_comidas (
        id_usuario, tipo_comida, contador, id_alimento, fecha_registro
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        id_usuario, tipo_comida, contador || 1, id_alimento, fecha_registro
      ]
    );

    res.status(201).json({
      message: "Entrada en bitácora de comidas creada correctamente",
      idBitacoraComida: result.insertId
    });
  } catch (error) {
    console.error("Error al crear entrada en bitácora de comidas:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Actualizar una entrada existente en la bitácora de comidas
export const updateBitacoraComida = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_usuario,
      tipo_comida,
      contador,
      id_alimento,
      fecha_registro
    } = req.body;

    const [exists] = await db.query("SELECT 1 FROM bitacora_comidas WHERE id = ?", [id]);

    if (!exists.length) {
      return res.status(404).json({ message: "La entrada en la bitácora no existe" });
    }

    const [result] = await db.query(
      `UPDATE bitacora_comidas SET
        id_usuario = ?, tipo_comida = ?, contador = ?, id_alimento = ?, fecha_registro = ?
      WHERE id = ?`,
      [
        id_usuario, tipo_comida, contador, id_alimento, fecha_registro,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No se pudo actualizar la entrada en la bitácora" });
    }

    res.status(200).json({
      message: "Entrada en bitácora actualizada correctamente",
      idBitacoraComida: id
    });
  } catch (error) {
    console.error("Error al actualizar entrada en bitácora:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Eliminar una entrada de la bitácora de comidas
export const deleteBitacoraComida = async (req, res) => {
  try {
    const { id } = req.params;

    const [bitacora] = await db.query("SELECT 1 FROM bitacora_comidas WHERE id = ?", [id]);

    if (!bitacora.length) {
      return res.status(404).json({ message: "Entrada en bitácora no encontrada" });
    }

    const [result] = await db.query("DELETE FROM bitacora_comidas WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Entrada en bitácora eliminada correctamente" });
    } else {
      res.status(400).json({ message: "No se pudo eliminar la entrada en bitácora" });
    }
  } catch (error) {
    console.error("Error al eliminar entrada en bitácora:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
