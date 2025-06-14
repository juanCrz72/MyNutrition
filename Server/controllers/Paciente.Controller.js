import { db } from "../db/ConexionPrueba.js"; // Importa la conexión a la base de datos

// Controlador para obtener todos los datos de los pacientes de la base de datos
export const getPaciente = async(req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Paciente ORDER BY fechaRegistro DESC"); // Ordena por fecha descendente
    if (rows.length > 0) {
      res.json({ message: "Pacientes obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron datos de pacientes" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal" });
  }
};

// Controlador para crear un nuevo paciente en la base de datos e Historial -------------------------------------------
export const createPaciente = async (req, res) => {
  try {
      const { nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, fechaRegistro } = req.body;
      
      // Verificación de campos requeridos
      if (!nombre || !apellido || !edad || !sexo) {
          return res.status(400).json({ message: "Todos los campos son requeridos: nombre, apellido, edad, sexo" });
      }
      
      // Iniciar TRANSACCIÓN
      await db.query("START TRANSACTION");
      
      try {
          // Insertar paciente en la base de datos
          const [pacienteRows] = await db.query(
              "INSERT INTO Paciente (nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
              [nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones]
          );
          
          const idPaciente = pacienteRows.insertId;
          
          // Crear historial clínico vacío para el nuevo paciente
          const [historialRows] = await db.query(
              "INSERT INTO HistorialClinico (idPaciente, fechaRegistro) VALUES (?, NOW())",
              [idPaciente]
          );
          
          // Confirmar transacción
          await db.query("COMMIT");
          
          // Responder con el paciente creado y el historial
          res.status(201).json({
              message: `Paciente '${nombre} ${apellido}' creado con historial clínico`,
              idPaciente: idPaciente,
              idHistorialClinico: historialRows.insertId,
              nombre,
              apellido,
              edad,
              sexo,
              ocupacion,
              direccion,
              localidad,
              estado,
              telefono,
              observaciones,
              fechaRegistro: new Date().toISOString().slice(0, 10),
          });
      } catch (error) {
          // Revertir transacción en caso de error
          await db.query("ROLLBACK");
          throw error;
      }
  } catch (error) {
      console.error("Error al crear paciente:", error);
      res.status(500).json({ 
          message: "Algo salió mal al crear el paciente y su historial clínico", 
          error: error.message 
      });
  }
};
  
    // Controlador para actualizar un paciente en la base de datos -------------------------------------------
    export const updatePaciente = async (req, res) => {
      try {
        const { idPaciente } = req.params; // El id se pasa como parámetro en la URL
        const { nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones} = req.body; // Los datos a actualizar se pasan en el cuerpo de la solicitud
        // Verificación de campos requeridos
        if (!nombre || !apellido || !edad || !sexo) {
          return res.status(400).json({ message: "Todos los campos son requeridos: nombre, apellido, edad, sexo" });
        }
        // Actualizar paciente en la base de datos
        const [rows] = await db.query(
          "UPDATE Paciente SET nombre = ?, apellido = ?, edad = ?, sexo = ?, ocupacion = ?, direccion = ?, localidad = ?, estado = ?, telefono = ?, observaciones = ? WHERE idPaciente = ?",
          [nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, idPaciente]
        );
        // Verificar si el paciente existe
        if (rows.affectedRows > 0) {
          res.json({ message: "Paciente actualizado correctamente" });
        } else {
          res.status(404).json({ message: "Paciente no encontrado" });
        }
      } catch (error) {
        console.error("Error al actualizar paciente:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
      }
    }

// Controlador para eliminar un paciente en la base de datos -------------------------------------------
export const deletePaciente = async (req, res) => {
    try {
      const { idPaciente } = req.params; // El id se pasa como parámetro en la URL
      // Eliminar paciente de la base de datos
      const [rows] = await db.query("DELETE FROM Paciente WHERE idPaciente = ?", [idPaciente]);
      // Verificar si el paciente existe
      if (rows.affectedRows > 0) {
        res.json({ message: "Paciente eliminado correctamente" });
      } else {
        res.status(404).json({ message: "Paciente no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
  };


  // Controlador para crear un nuevo paciente en la base de datos -------------------------------------------
/* export const createPacientes = async (req, res) => {
  try {
    const { nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, fechaRegistro} = req.body;    
    // Verificación de campos requeridos
    if (!nombre || !apellido || !edad || !sexo) {
      return res.status(400).json({ message: "Todos los campos son requeridos:nombre, apellido, edad, sexo" });
    }
    // Insertar pacientes en la base de datos
    const [rows] = await db.query(
      "INSERT INTO Paciente (nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones]
    );
    // Responder con el paciente creado
    res.status(201).json({
      message:`Paciente '${nombre} ${apellido}' creado`,
      idPaciente: rows.insertId,
      nombre,
      apellido,
      edad,
      sexo,
      ocupacion,
      direccion,
      localidad, 
      estado, 
      telefono,
      observaciones,      
      fechaRegistro: new Date().toISOString().slice(0, 10), // Fecha de registro actual formateada
    });
  } catch (error) {
    console.error("Error al crear paciente:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
}; */