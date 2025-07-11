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

httpServer.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export { io, httpServer };
