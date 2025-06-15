import { db } from "../db/connection.js";

// GET alimentos
export const getAlimentos = async (req, res) => {
  try {
    // Consulta alternativa si falla la primera
    let [rows] = await db.query(`
      SELECT 
        a.*, 
        GROUP_CONCAT(p.nombre_pais) AS paises_nombres,
        GROUP_CONCAT(p.idPais) AS paises_ids
      FROM smae_alimentos a
      LEFT JOIN (
        SELECT 
          a.id, 
          TRIM(BOTH '"' FROM SUBSTRING_INDEX(SUBSTRING_INDEX(a.idPais, ',', n.n), ',', -1)) AS clean_pais_id
        FROM smae_alimentos a
        JOIN (
          SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
          SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL
          SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
        ) n
        ON n.n <= LENGTH(a.idPais) - LENGTH(REPLACE(a.idPais, ',', '')) + 1
        WHERE a.idPais IS NOT NULL AND a.idPais != ''
      ) AS parsed ON a.id = parsed.id
      LEFT JOIN cat_paises p ON p.idPais = parsed.clean_pais_id
      GROUP BY a.id
      ORDER BY a.Alimento ASC
    `);
    
    if (rows.length > 0) {
      const alimentos = rows.map(alimento => ({
        ...alimento,
        paises: alimento.paises_nombres ? alimento.paises_nombres.split(',') : [],
        paises_ids: alimento.paises_ids ? alimento.paises_ids.split(',').map(Number) : []
      }));
      res.json({ message: "Alimentos obtenidos correctamente", data: alimentos });
    } else {
      res.status(404).json({ message: "No se encontraron alimentos" });
    }
  } catch (error) {
    console.error("Error al obtener alimentos:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
// Crear un nuevo alimento
export const createAlimento = async (req, res) => {
  try {
    const {
      Categoria,
      Alimento,
      Cantidad_Sugerida,
      Unidad,
      Peso_Bruto_g,
      Peso_Neto_g,
      Energia_kcal,
      Proteina_g,
      Grasa_g,
      Carbohidratos_g,
      Azucar_g,
      Fibra_g,
      idPais,
      activo
    } = req.body;

    // Validación básica
    if (!Alimento || !Categoria || activo === undefined) {
      return res.status(400).json({ 
        message: "Los campos 'Alimento', 'Categoria' y 'activo' son requeridos" 
      });
    }

    // Convertir array de países a string separado por comas
    const paisesStr = Array.isArray(idPais) ? idPais.join(',') : idPais || '';

    // Obtener el siguiente ID autoincremental
    const [maxResult] = await db.query("SELECT MAX(id) AS maxId FROM smae_alimentos");
    const nextId = (maxResult[0].maxId || 0) + 1;

    const [rows] = await db.query(
      `INSERT INTO smae_alimentos (
        id, Categoria, Alimento, Cantidad_Sugerida, Unidad, Peso_Bruto_g, 
        Peso_Neto_g, Energia_kcal, Proteina_g, Grasa_g, Carbohidratos_g, 
        Azucar_g, Fibra_g, idPais, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextId,
        Categoria,
        Alimento,
        Cantidad_Sugerida || null,
        Unidad || null,
        Peso_Bruto_g || null,
        Peso_Neto_g || null,
        Energia_kcal || null,
        Proteina_g || null,
        Grasa_g || null,
        Carbohidratos_g || null,
        Azucar_g || null,
        Fibra_g || null,
        paisesStr,
        activo
      ]
    );
    
    res.status(201).json({
      message: `Alimento '${Alimento}' creado correctamente`,
      id: nextId,
      Alimento,
      idPais: paisesStr.split(',').filter(Boolean) // Devolver como array
    });
  } catch (error) {
    console.error("Error al crear alimento:", error);
    res.status(500).json({ 
      message: "Algo salió mal al crear el alimento", 
      error: error.message 
    });
  }
};

// Actualizar alimento
export const updateAlimento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Categoria,
      Alimento,
      Cantidad_Sugerida,
      Unidad,
      Peso_Bruto_g,
      Peso_Neto_g,
      Energia_kcal,
      Proteina_g,
      Grasa_g,
      Carbohidratos_g,
      Azucar_g,
      Fibra_g,
      idPais,
      activo
    } = req.body;

    if (!Alimento || !Categoria || activo === undefined) {
      return res.status(400).json({ 
        message: "Los campos 'Alimento', 'Categoria' y 'activo' son requeridos" 
      });
    }

    // Convertir array de países a string separado por comas
    const paisesStr = Array.isArray(idPais) ? idPais.join(',') : idPais || '';

    const [rows] = await db.query(
      `UPDATE smae_alimentos SET 
        Categoria = ?,
        Alimento = ?,
        Cantidad_Sugerida = ?,
        Unidad = ?,
        Peso_Bruto_g = ?,
        Peso_Neto_g = ?,
        Energia_kcal = ?,
        Proteina_g = ?,
        Grasa_g = ?,
        Carbohidratos_g = ?,
        Azucar_g = ?,
        Fibra_g = ?,
        idPais = ?,
        activo = ?
      WHERE id = ?`,
      [
        Categoria,
        Alimento,
        Cantidad_Sugerida || null,
        Unidad || null,
        Peso_Bruto_g || null,
        Peso_Neto_g || null,
        Energia_kcal || null,
        Proteina_g || null,
        Grasa_g || null,
        Carbohidratos_g || null,
        Azucar_g || null,
        Fibra_g || null,
        paisesStr,
        activo,
        id
      ]
    );

    if (rows.affectedRows > 0) {
      res.json({ message: "Alimento actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Alimento no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar alimento:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Eliminar un alimento
export const deleteAlimento = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("DELETE FROM smae_alimentos WHERE id = ?", [id]);

    if (rows.affectedRows > 0) {
      res.json({ message: "Alimento eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Alimento no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar alimento:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

