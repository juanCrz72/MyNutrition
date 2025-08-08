import app from "./app.js";
import { createServer } from 'http';
import { Server } from 'socket.io';
import os from 'os'; // ✅ Reemplaza require('os') por import

// Configuración
export const port = 3000;
const host = '0.0.0.0'; // Escucha en todas las interfaces

// Crear servidor HTTP y Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Función para obtener IP local de red
const getNetworkIp = () => {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '0.0.0.0';
};

const ipAddress = getNetworkIp();

// Manejo de conexiones Socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar servidor
httpServer.listen(port, host, () => {
  console.log(`Servidor corriendo en:`);
  console.log(`- Localhost:     http://localhost:${port}`);
  console.log(`- Red local:     http://${ipAddress}:${port}`);
  console.log(`- IP pública (si aplica): http://195.35.11.187:${port}`);
});

export { io, httpServer };
