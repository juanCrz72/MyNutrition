import { db } from "../db/connection.js";
import { httpServer, io } from './../server.js';

export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                u.id_usuario,
                u.nombre,
                u.usuario,
                u.correo,
                u.idPersona,
                u.id_perfil,
                u.activo,
                u.date_add,
                u.add_upt, 
                 p.nombre AS nombre_persona,
                 p.apellidos
            FROM usuarios u
          LEFT JOIN persona p ON u.idPersona = p.idpersona
            LEFT JOIN cat_perfiles cp ON u.id_perfil = cp.id_perfil
            WHERE u.activo = 1
            ORDER BY u.id_usuario DESC

        `);

        if (rows.length > 0) {
            res.json({ message: "Usuarios obtenidos correctamente", data: rows });
        } else {
            res.status(404).json({ message: "No se encontraron usuarios" });
        }
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

export const getUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1", [id]);

        if (rows.length > 0) {
            res.json({ data: rows[0] });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

/* export const createUsuario = async (req, res) => {
    const { nombre, usuario, correo, contrasenia, idPersona, id_perfil } = req.body;

    try {
        const [result] = await db.query(`
            INSERT INTO usuarios (nombre, usuario, correo, contrasenia, idPersona, id_perfil)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [nombre, usuario, correo, contrasenia, idPersona, id_perfil]);

        res.status(201).json({ message: "Usuario creado correctamente", id: result.insertId });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error al crear el usuario" });
    }
}; */

import bcrypt from 'bcrypt';

export const createUsuario = async (req, res) => {
    const { nombre, usuario, correo, contrasenia, idPersona, id_perfil } = req.body;

    try {
        // 1. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        
        // 2. Insertar el usuario con la contraseña hasheada
        const [result] = await db.query(`
            INSERT INTO usuarios (nombre, usuario, correo, contrasenia, idPersona, id_perfil)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [nombre, usuario, correo, hashedPassword, idPersona, id_perfil]);

        // Emitir evento de nuevo usuario
        io.emit('new-user', { 
            nombre, 
            usuario, 
            correo,
            id: result.insertId
        });

        res.status(201).json({ 
            message: "Usuario creado correctamente", 
            id: result.insertId 
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        
        // Manejo específico de errores de duplicados
        if(error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "El correo o usuario ya existe" });
        }
        
        res.status(500).json({ message: "Error al crear el usuario" });
    }
};

export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, correo, contrasenia, idPersona, id_perfil } = req.body;

    try {
        // Preparar los campos a actualizar
        const updateFields = [];
        const updateValues = [];
        
        if (nombre !== undefined) {
            updateFields.push('nombre = ?');
            updateValues.push(nombre);
        }
        
        if (usuario !== undefined) {
            updateFields.push('usuario = ?');
            updateValues.push(usuario);
        }
        
        if (correo !== undefined) {
            updateFields.push('correo = ?');
            updateValues.push(correo);
        }
        
        if (contrasenia !== undefined) {
            updateFields.push('contrasenia = ?');
            updateValues.push(contrasenia);
        }
        
        if (idPersona !== undefined) {
            updateFields.push('idPersona = ?');
            updateValues.push(idPersona);
        }
        
        if (id_perfil !== undefined) {
            updateFields.push('id_perfil = ?');
            updateValues.push(id_perfil);
        }
        
        // Si no hay campos para actualizar
        if (updateFields.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron datos para actualizar" });
        }
        
        updateValues.push(id); // Añadir el ID al final para el WHERE
        
        const [result] = await db.query(`
            UPDATE usuarios
            SET ${updateFields.join(', ')}
            WHERE id_usuario = ? AND activo = 1
        `, updateValues);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado o ya inactivo" });
        }

           // Emitir evento de usuario actualizado
        io.emit('update-user', { 
            id,
            nombre: nombre || req.user?.nombre, // Usa el nuevo nombre o el existente
            usuario: usuario || req.user?.usuario,
            correo: correo || req.user?.correo
        });

        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ 
            message: "Error del servidor",
            error: error.message // Opcional: enviar detalles del error en desarrollo
        });
    }
};

export const deleteUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(`
            UPDATE usuarios SET activo = 0 WHERE id_usuario = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};
