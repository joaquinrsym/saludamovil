const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const usuarios = new Set();

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('nuevo_usuario', (nombre) => {
    usuarios.add(nombre);
    socket.username = nombre;
    io.emit('usuarios_conectados', Array.from(usuarios));
  });

  socket.on('enviar_saludo', ({ destinatario, mensaje }) => {
    const destinatarioSocket = Object.values(io.sockets.sockets).find(
      (s) => s.username === destinatario
    );
    if (destinatarioSocket) {
      destinatarioSocket.emit('recibir_saludo', mensaje);
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