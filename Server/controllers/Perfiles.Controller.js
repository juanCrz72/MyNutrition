import { db } from "../db/connection.js";

export const getCat_perfiles = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM cat_perfiles WHERE activo = 1 ORDER BY nombre ASC`);

    if (rows.length > 0) {
      res.json({ message: "Perfiles obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron perfiles activos" });
    }
  } catch (error) {
    console.error("Error al obtener perfiles:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

export const createCat_perfil = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El campo 'nombre' es requerido" });
    }

    const [[{ maxId }]] = await db.query(`SELECT MAX(id_perfil) AS maxId FROM cat_perfiles`);
    const newId = (maxId || 0) + 1;

    const [existing] = await db.query(`SELECT id_perfil FROM cat_perfiles WHERE id_perfil = ?`, [newId]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "El id_perfil generado ya existe. Intenta de nuevo." });
    }

    await db.query(
      `INSERT INTO cat_perfiles (id_perfil, nombre) VALUES (?, ?)`,
      [newId, nombre]
    );

    res.status(201).json({ message: "Perfil creado correctamente", id_perfil: newId });
  } catch (error) {
    console.error("Error al crear el perfil:", error);
    res.status(500).json({ message: "Algo salió mal al crear el perfil", error: error.message });
  }
};

export const updateCat_perfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, activo } = req.body;

    if (!nombre || activo === undefined) {
      return res.status(400).json({ message: "Los campos 'nombre' y 'activo' son requeridos" });
    }

    const [result] = await db.query(
      `UPDATE cat_perfiles SET nombre = ?, activo = ? WHERE id_perfil = ?`,
      [nombre, activo, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Perfil actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

export const deleteCat_perfil = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(`UPDATE cat_perfiles SET activo = 0 WHERE id_perfil = ?`, [id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Perfil desactivado correctamente" });
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (error) {
    console.error("Error al desactivar el perfil:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
