import { db } from "../db/connection.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuración para manejo de imágenes
const IMAGE_UPLOAD_DIR = path.join(__dirname, '../../Client/public/images');

// Crear directorio si no existe
if (!fs.existsSync(IMAGE_UPLOAD_DIR)) {
  fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });
}

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
    
    // Modificar las rutas de las imágenes para el frontend
    const personas = rows.map(persona => ({
      ...persona,
      img_perfil: persona.img_perfil ? `/images/${path.basename(persona.img_perfil)}` : null
    }));

    res.json({ message: "Personas obtenidas correctamente", data: personas });
  } catch (error) {
    console.error("Error al obtener personas:", error);
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

// Obtener una persona por su ID
export const getPersonaById = async (req, res) => {
  try {
    const { idpersona } = req.params;

    const [rows] = await db.query(`
      SELECT 
        p.*,
        pais.nombre_pais,
        plan.plan_nombre
      FROM persona p
      JOIN cat_paises pais ON p.idPais = pais.idPais
      LEFT JOIN cat_planes plan ON p.idPlan = plan.idPlan
      WHERE p.idpersona = ?
    `, [idpersona]);

    if (rows.length > 0) {
      const persona = rows[0];
      // Modificar la ruta de la imagen para el frontend
      persona.img_perfil = persona.img_perfil ? `/images/${path.basename(persona.img_perfil)}` : null;
      res.json({ message: "Persona encontrada", data: persona });
    } else {
      res.status(404).json({ message: "Persona no encontrada" });
    }
  } catch (error) {
    console.error("Error al obtener la persona por ID:", error);
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
      tipo_persona = 0,
      idPais,
      idPlan = 0,
      activo = 1
    } = req.body;

    if (!nombre || !apellidos || !sexo || !edad || !altura || !peso || !idPais) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Manejo de la imagen
    let imgPath = '';
    if (req.file) {
      imgPath = `/images/${req.file.filename}`;
    }

    const fechaNacimientoFinal = fecha_nacimiento && fecha_nacimiento.trim() !== '' ? fecha_nacimiento : null;

    const [result] = await db.query(
      `INSERT INTO persona (
        nombre, apellidos, fecha_nacimiento, sexo, edad, altura, peso, 
        img_perfil, tipo_persona, idPais, idPlan, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre, apellidos, fechaNacimientoFinal, sexo, edad, altura, peso,
        imgPath, tipo_persona, idPais, idPlan, activo
      ]
    );

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
      tipo_persona = 0,
      idPais,
      idPlan = 0,
      activo = 1,
      currentImage
    } = req.body;

    if (!nombre || !apellidos || !sexo || !edad || !altura || !peso || !idPais) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Obtener la persona actual para manejar la imagen
    const [currentPersona] = await db.query("SELECT img_perfil FROM persona WHERE idpersona = ?", [idpersona]);
    let imgPath = currentPersona[0]?.img_perfil || '';

    // Manejo de la imagen
    if (req.file) {
      // Eliminar la imagen anterior si existe
      if (imgPath) {
        const oldImagePath = path.join(IMAGE_UPLOAD_DIR, path.basename(imgPath));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imgPath = `/images/${req.file.filename}`;
    } else if (currentImage === 'null' || currentImage === '') {
      // Eliminar la imagen si se indica
      if (imgPath) {
        const oldImagePath = path.join(IMAGE_UPLOAD_DIR, path.basename(imgPath));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imgPath = '';
    }

    const fechaNacimientoFinal = fecha_nacimiento && fecha_nacimiento.trim() !== '' ? fecha_nacimiento : null;

    const [result] = await db.query(
      `UPDATE persona SET 
        nombre = ?, apellidos = ?, fecha_nacimiento = ?, sexo = ?, edad = ?, altura = ?, peso = ?,
        img_perfil = ?, tipo_persona = ?, idPais = ?, idPlan = ?, activo = ?
      WHERE idpersona = ?`,
      [
        nombre, apellidos, fechaNacimientoFinal, sexo, edad, altura, peso,
        imgPath, tipo_persona, idPais, idPlan, activo, idpersona
      ]
    );

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

    // Obtener la imagen antes de eliminar para borrarla del sistema de archivos
    const [persona] = await db.query("SELECT img_perfil FROM persona WHERE idpersona = ?", [idpersona]);
    
    if (persona.length > 0 && persona[0].img_perfil) {
      const imagePath = path.join(IMAGE_UPLOAD_DIR, path.basename(persona[0].img_perfil));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

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