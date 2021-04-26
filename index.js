const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

//List of users
const users = {};

//io.emit() --> emits to everyone
io.on("connection", (socket) => {
  // When a new user joins
  socket.on("new-user", (userObj) => {
    addUser(userObj, socket.id);
    const { username } = userObj;
    console.log(username + " is connected");
    socket.broadcast.emit("user-connected", username);
  });

  // When a client sends a message
  socket.on("send-chat-message", (msg) => {
    socket.broadcast.emit("chat-message", {
      user: getUser(socket.id),
      msg,
    });
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    const user = getUser(socket.id)?.username;
    if (user) {
      socket.broadcast.emit("user-disconnected", user);
    }
    deleteUser(socket.id);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

//{username, userAvatar}
function addUser(userObj, socketId) {
  users[socketId] = userObj;
}

function getUser(socketId) {
  return users[socketId];
}

function deleteUser(socketId) {
  delete users[socketId];
}
