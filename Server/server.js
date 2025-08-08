import app from "./app.js";
import { createServer } from 'http';
import { Server } from 'socket.io';

export const port = 3000; 
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Obtener la dirección IP
const host = '195.35.11.187'; // Tu dirección IP

httpServer.listen(port, host, () => {
  console.log(`Servidor corriendo en:`);
  console.log(`- Local: http://localhost:${port}`);
  console.log(`- Red: http://${host}:${port}`);
  console.log(`\nVariable de entorno VITE_API_BASE_URL=http://${host}:${port}`);
});

export { io, httpServer };