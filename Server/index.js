const express = require('express');
const app = express();
const PORT = 4000;
const http = require('http').Server(app);
const cors = require('cors');
const { ExpressPeerServer } = require('peer');

app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:5173"
  }
});

const peerServer = ExpressPeerServer(http, {
  debug: true,
  path: '/myapp'
});

app.use('/peerjs', peerServer);

const rooms = new Map();

socketIO.on('connection', (socket) => {
  console.log(`⚡️: ${socket.id} user just connected!`);

  socket.on("join_room", ({ url, peerId }) => {
    socket.join(url);
    console.log(`${socket.id} joined room ${url} with peer ID ${peerId}`);

    if (!rooms.has(url)) {
      rooms.set(url, new Set());
    }
    rooms.get(url).add({ socketId: socket.id, peerId });

    const usersInRoom = Array.from(rooms.get(url)).map(user => ({ socketId: user.socketId, peerId: user.peerId }));

    socket.emit("room_joined", {
      room: url,
      message: `You have successfully joined the room ${url}`,
      users: usersInRoom.filter(user => user.socketId !== socket.id)
    });

    socket.to(url).emit("user_joined", { socketId: socket.id, peerId });
  });

  socket.on("call-user", (data) => {
    const { userId, offer } = data;
    console.log(`Calling user ${userId}`);
    socket.to(userId).emit("incoming-call", { from: socket.id, offer });
  });

  socket.on("call-accepted", (data) => {
    const { userId, answer } = data;
    console.log(`Call accepted from ${userId}`);
    socket.to(userId).emit("call-accepted", { from: socket.id, answer });
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    rooms.forEach((users, roomUrl) => {
      const user = Array.from(users).find(u => u.socketId === socket.id);
      if (user) {
        users.delete(user);
        socket.to(roomUrl).emit("user_left", user.peerId);
        if (users.size === 0) {
          rooms.delete(roomUrl);
        }
      }
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});