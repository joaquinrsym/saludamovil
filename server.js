const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const usuarios = new Map();
const mensajes = new Map();

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('nuevo_usuario', (nombre) => {
    usuarios.set(socket.id, nombre);
    io.emit('usuarios_conectados', Array.from(usuarios.values()));
    console.log(`Usuario ${nombre} conectado con ID ${socket.id}`);
  });

  socket.on('enviar_saludo', ({ destinatario, mensaje }) => {
    const destinatarioId = Array.from(usuarios.entries())
      .find(([_, nombre]) => nombre === destinatario)?.[0];
    console.log(destinatarioId)
    if (destinatarioId) {
      if (!mensajes.has(destinatarioId)) {
        mensajes.set(destinatarioId, []);
      }
      mensajes.get(destinatarioId).push(mensaje);
      io.to(destinatarioId).emit('recibir_saludo');
      console.log(`Saludo enviado a ${destinatario}: ${mensaje}`);
    } else {
      console.log(`Destinatario ${destinatario} no encontrado`);
    }
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      usuarios.delete(socket.username);
      io.emit('usuarios_conectados', Array.from(usuarios));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));