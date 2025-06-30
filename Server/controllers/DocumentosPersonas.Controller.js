import { db } from '../db/connection.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../Client/public/images');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname.replace(/\s/g, '')}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage }).single('imagen');

// 🚀 1. SUBIR IMAGEN
export const subirImagen = (req, res) => {
  upload(req, res, async function (err) {
    if (err) return res.status(500).json({ error: 'Error al subir imagen.' });

    const { idPersona } = req.body;
    const nombre_original = req.file.originalname;
    const nombre_documento = req.file.filename;
    const tamanokb = Math.round(req.file.size / 1024);
    const extension = path.extname(req.file.originalname).slice(1);
    const localizacion = `images/${req.file.filename}`;
    const fecha_carga = new Date();

    try {
      await db.query(
        `INSERT INTO persona_documentos 
        (idPersona, nombre_original, nombre_documento, tamanokb, extension, localizacion, fecha_carga, eliminado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        [idPersona, nombre_original, nombre_documento, tamanokb, extension, localizacion, fecha_carga]
      );
      res.status(200).json({ mensaje: 'Imagen subida con éxito.', archivo: nombre_documento });
    } catch (dbError) {
      res.status(500).json({ error: 'Error al guardar en la base de datos.' });
    }
  });
};

// 📄 2. OBTENER IMAGEN DE UNA PERSONA
/* export const obtenerImagenPorPersona = async (req, res) => {
  const { idPersona } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM persona_documentos 
       WHERE idPersona = ? AND eliminado = 0 
       ORDER BY fecha_carga DESC LIMIT 1`, 
      [idPersona]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró imagen para esta persona.' });
    }

    res.json({ imagen: rows[0].localizacion });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener imagen.' });
  }
};
 */

export const obtenerImagenPorPersona = async (req, res) => {
  const { idPersona } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT id, idPersona, localizacion, nombre_original, fecha_carga
       FROM persona_documentos 
       WHERE idPersona = ? AND eliminado = 0 
       ORDER BY fecha_carga DESC`,
      [idPersona]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron imágenes para esta persona.' });
    }

    // Devolver la lista completa de objetos
    res.json({ imagenes: rows });
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({ error: 'Error al obtener imágenes.' });
  }
};

 

// 🧾 3. OBTENER TODAS LAS IMÁGENES DE TODOS LOS PACIENTES
export const obtenerTodasLasImagenes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM persona_documentos 
      WHERE eliminado = 0
      ORDER BY fecha_carga DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las imágenes.' });
  }
};

// ❌ 4. ELIMINAR IMAGEN POR ID
export const eliminarImagen = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM persona_documentos WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró la imagen.' });
    }

    const imagen = rows[0];
    const rutaFisica = `client/public/${imagen.localizacion}`;

    // Eliminar archivo físicamente si existe
    if (fs.existsSync(rutaFisica)) {
      fs.unlinkSync(rutaFisica);
    }

    // Marcar como eliminado en la BD
    await db.query(`UPDATE persona_documentos SET eliminado = 1 WHERE id = ?`, [id]);

    res.json({ mensaje: 'Imagen eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la imagen.' });
  }
};
