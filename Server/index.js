const express = require('express');
const app = express();
const PORT = 4000;
const http = require('http').Server(app);
const cors = require('cors');
app.use(cors());
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:5173"
  }
});

socketIO.on('connection', (socket) => {
  console.log(`⚡️: ${socket.id} user just connected!`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(socket.id + " joined room " + room);
    socket.emit("room_joined", {
      room: room,
      message: `You have successfully joined the room ${room}`
    });
    socket.to(room).emit("user_joined", socket.id);
  });

  socket.on("call-user", (data) => {
    const { userId, offer } = data;
    socket.to(userId).emit("incoming-call", { from: socket.id, offer });
  });

  socket.on("call-accepted", (data) => {
    const { userId, answer } = data;
    socket.to(userId).emit("call-accepted", { from: socket.id, answer });
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit("user_left", socket.id);
      }
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});