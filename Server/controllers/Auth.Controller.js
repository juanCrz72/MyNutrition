import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from "../db/connection.js";

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';

export const register = async (req, res) => {
    try {
        const { nombre, usuario, correo, contrasenia, id_perfil } = req.body;
        
        // Validar campos requeridos
        if (!nombre || !usuario || !correo || !contrasenia || !id_perfil) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        
        // Verificar si el usuario ya existe
        const [existingUser] = await db.query('SELECT * FROM usuarios WHERE usuario = ? OR correo = ?', [usuario, correo]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El usuario o correo ya está registrado' });
        }
        
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        
        // Insertar nuevo usuario (idPersona se establece como NULL)
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, usuario, correo, contrasenia, idPersona, id_perfil, activo) VALUES (?, ?, ?, ?, NULL, ?, 1)',
            [nombre, usuario, correo, hashedPassword, id_perfil]
        );
        
        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// auth.Controller.js
export const login = async (req, res) => {
    try {
        const { usuario, contrasenia } = req.body;
        
        if (!usuario || !contrasenia) {
            return res.status(400).json({ 
                success: false,
                message: 'Usuario y contraseña son requeridos' 
            });
        }
        
        // Consulta mejorada
        const [users] = await db.query(
            `SELECT u.id_usuario, u.nombre, u.usuario, u.correo, u.contrasenia, 
                    u.id_perfil, p.nombre as perfil, u.activo
             FROM usuarios u 
             JOIN cat_perfiles p ON u.id_perfil = p.id_perfil 
             WHERE u.usuario = ? LIMIT 1`,
            [usuario]
        );
        
        if (users.length === 0 || !users[0].activo) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciales inválidas o usuario inactivo' 
            });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.compare(contrasenia, user.contrasenia);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciales inválidas' 
            });
        }
        
        // Datos para el token
        const tokenData = {
            userId: user.id_usuario,
            perfil: user.id_perfil,
            perfilNombre: user.perfil
        };
        
        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '8h' });
        
        // Preparar respuesta
        const { contrasenia: _, activo: __, ...userData } = user;
        
        res.json({ 
            success: true,
            message: 'Autenticación exitosa',
            token,
            user: userData
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};
export const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                valid: false,
                message: 'Token no proporcionado' 
            });
        }
        
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Verificar si el usuario existe
        const [users] = await db.query(
            `SELECT id_usuario, nombre, usuario, correo, id_perfil 
             FROM usuarios 
             WHERE id_usuario = ? AND activo = 1 LIMIT 1`,
            [decoded.userId]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                valid: false,
                message: 'Usuario no encontrado' 
            });
        }
        
        res.json({ 
            valid: true,
            user: {
                ...users[0],
                perfil: decoded.perfil,
                perfilNombre: decoded.perfilNombre
            }
        });
        
    } catch (error) {
        console.error('Error verificando token:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                valid: false,
                message: 'Token expirado' 
            });
        }
        
        return res.status(401).json({ 
            valid: false,
            message: 'Token inválido',
            error: error.message
        });
    }
};



// ------------------------------------ PERSONA Y USUARIO ------------------------------------
export const completeRegister = async (req, res) => {
    try {
        const { persona, usuario } = req.body;

        // Validar datos de persona
        if (!persona.nombre || !persona.apellidos || !persona.sexo || 
            !persona.edad || !persona.altura || !persona.peso || !persona.idPais) {
            return res.status(400).json({ message: 'Faltan campos requeridos en datos personales' });
        }

        // Validar datos de usuario
        if (!usuario.usuario || !usuario.correo || !usuario.contrasenia || !usuario.id_perfil) {
            return res.status(400).json({ message: 'Faltan campos requeridos en credenciales' });
        }

        // Verificar si el usuario ya existe
        const [existingUser] = await db.query('SELECT * FROM usuarios WHERE usuario = ? OR correo = ?', 
            [usuario.usuario, usuario.correo]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El usuario o correo ya está registrado' });
        }

        // Iniciar transacción
        await db.query('START TRANSACTION');

        try {
            // Insertar persona
            const [personaResult] = await db.query(
                `INSERT INTO persona (
                    nombre, apellidos, fecha_nacimiento, sexo, edad, altura, peso, 
                    img_perfil, tipo_persona, idPais, idPlan, activo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    persona.nombre, persona.apellidos, persona.fecha_nacimiento || null, 
                    persona.sexo, persona.edad, persona.altura, persona.peso,
                    persona.img_perfil || '', persona.tipo_persona || 0, 
                    persona.idPais, persona.idPlan || 0, persona.activo || 1
                ]
            );

            const idPersona = personaResult.insertId;

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(usuario.contrasenia, 10);

            // Insertar usuario
            await db.query(
                'INSERT INTO usuarios (nombre, usuario, correo, contrasenia, idPersona, id_perfil, activo) VALUES (?, ?, ?, ?, ?, ?, 1)',
                [usuario.nombre || `${persona.nombre} ${persona.apellidos}`, usuario.usuario, 
                 usuario.correo, hashedPassword, idPersona, usuario.id_perfil]
            );

            // Confirmar transacción
            await db.query('COMMIT');

            res.status(201).json({ 
                success: true,
                message: 'Registro completado exitosamente'
            });
        } catch (error) {
            // Revertir transacción en caso de error
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error en registro completo:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error en el servidor al completar el registro',
            error: error.message
        });
    }
};