import { db } from "../db/connection.js";

// GET países
export const getPaises = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cat_paises ORDER BY nombre_pais ASC");
    if (rows.length > 0) {
      res.json({ message: "Países obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron países" });
    }
  } catch (error) {
    console.error("Error al obtener países:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Crear un nuevo país
export const createPais = async (req, res) => {
  try {
    const { nombre_pais, activo } = req.body;

    if (!nombre_pais || activo === undefined) {
      return res.status(400).json({ message: "Los campos 'nombre_pais' y 'activo' son requeridos" });
    }

    const [maxResult] = await db.query("SELECT MAX(idPais) AS maxId FROM cat_paises");
    const nextId = (maxResult[0].maxId || 0) + 1;

    const [rows] = await db.query(
      "INSERT INTO cat_paises (idPais, nombre_pais, activo) VALUES (?, ?, ?)",
      [nextId, nombre_pais, activo]
    );
    
    res.status(201).json({
      message: `País '${nombre_pais}' creado correctamente`,
      idPais: nextId,
      nombre_pais,
      activo,
    });
  } catch (error) {
    console.error("Error al crear país:", error);
    res.status(500).json({ message: "Algo salió mal al crear el país", error: error.message });
  }
};


//Update Países 
export const updatePais = async (req, res) => {
  try {
    const { idPais } = req.params;
    const { nombre_pais, activo } = req.body;

    if (!nombre_pais || activo === undefined) {
      return res.status(400).json({ message: "Todos los campos son requeridos: nombre_pais, activo" });
    }

    const [rows] = await db.query(
      "UPDATE cat_paises SET nombre_pais = ?, activo = ? WHERE idPais = ?",
      [nombre_pais, activo, idPais]
    );

    if (rows.affectedRows > 0) {
      res.json({ message: "País actualizado correctamente" });
    } else {
      res.status(404).json({ message: "País no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar país:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Eliminar un país
export const deletePais = async (req, res) => {
  try {
    const { idPais } = req.params;

    const [rows] = await db.query("DELETE FROM cat_paises WHERE idPais = ?", [idPais]);

    if (rows.affectedRows > 0) {
      res.json({ message: "País eliminado correctamente" });
    } else {
      res.status(404).json({ message: "País no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar país:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
