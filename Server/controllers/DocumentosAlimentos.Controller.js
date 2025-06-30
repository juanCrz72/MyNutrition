import { db } from '../db/connection.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../Client/public/imagesAlimentos');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname.replace(/\s/g, '')}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage }).single('imagen');

// 🚀 1. SUBIR IMAGEN DE ALIMENTO
export const subirImagenAlimento = (req, res) => {
  upload(req, res, async function (err) {
    if (err) return res.status(500).json({ error: 'Error al subir imagen.' });

    const { idAlimento } = req.body;
    const nombre_original = req.file.originalname;
    const nombre_documento = req.file.filename;
    const tamanokb = Math.round(req.file.size / 1024);
    const extension = path.extname(req.file.originalname).slice(1);
    const localizacion = `imagesAlimentos/${req.file.filename}`;
    const fecha_carga = new Date();

    try {
      await db.query(
        `INSERT INTO alimentos_documentos 
        (idAlimento, nombre_original, nombre_documento, tamanokb, extension, localizacion, fecha_carga, eliminado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
        [idAlimento, nombre_original, nombre_documento, tamanokb, extension, localizacion, fecha_carga]
      );
      res.status(200).json({ mensaje: 'Imagen subida con éxito.', archivo: nombre_documento });
    } catch (dbError) {
      res.status(500).json({ error: 'Error al guardar en la base de datos.' });
    }
  });
};

// 📄 2. OBTENER IMAGEN DE UN ALIMENTO
export const obtenerImagenPorAlimento = async (req, res) => {
  const { idAlimento } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM alimentos_documentos 
       WHERE idAlimento = ? AND eliminado = 0 
       ORDER BY fecha_carga DESC LIMIT 1`, 
      [idAlimento]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró imagen para este alimento.' });
    }

    res.json({ imagen: rows[0].localizacion });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener imagen.' });
  }
};

// 🧾 3. OBTENER TODAS LAS IMÁGENES DE TODOS LOS ALIMENTOS
export const obtenerTodasLasImagenesAlimentos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM alimentos_documentos 
      WHERE eliminado = 0
      ORDER BY fecha_carga DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las imágenes.' });
  }
};

// ❌ 4. ELIMINAR IMAGEN POR ID
export const eliminarImagenAlimento = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM alimentos_documentos WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró la imagen.' });
    }

    const imagen = rows[0];
    const rutaFisica = `../Client/public/${imagen.localizacion}`;

    // Eliminar archivo físicamente si existe
    if (fs.existsSync(rutaFisica)) {
      fs.unlinkSync(rutaFisica);
    }

    // Marcar como eliminado en la BD
    await db.query(`UPDATE alimentos_documentos SET eliminado = 1 WHERE id = ?`, [id]);

    res.json({ mensaje: 'Imagen eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la imagen.' });
  }
};