import { db } from "../db/connection.js";

export const index = (req, res) =>
  res.json({
    message: "Bienvenido, estás en el backend de la aplicación",
  });

export const ping = async (req, res) => {
  const [result] = await db.query('SELECT "pong" as result');
  res.json(result[0]);
};
