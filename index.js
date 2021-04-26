const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;
const User = require("./classes/user");

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Lobby
app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});

// Rooms section
const rooms = {
  myRoom: { users: {} },
};

app.get("/:room", (req, res) => {
  const roomName = req.params.room;
  // if room does NOT exists redirects to the lobby
  if (roomExists(roomName) === false) {
    return res.redirect("/");
  }
  // passing the name of the room to the room.ejs file
  res.render("room", { roomName: req.params.room });
});

app.post("/room", (req, res) => {
  const roomName = req.body.room;
  // generates an empty users object for the new room
  rooms[roomName] = {
    users: {},
  };
  res.redirect(`/${roomName}`);
  // new room is created
  io.emit("room-created", { roomName: roomName });
});

function roomExists(room) {
  return rooms[room] != null;
}
// https://socket.io/docs/v3/rooms/index.html
// https://stackoverflow.com/questions/65054953/socket-io-broadcast-in-a-room
io.on("connection", (socket) => {
  // When a new user joins
  socket.on("new-user", (roomName, user) => {
    // adds the user (socket) to the room
    socket.join(roomName);

    // adds the user object to the users list
    const { username, imagePath } = user;
    addUser(roomName, socket.id, new User(username, imagePath, roomName));
    console.log(username + " is connected");

    // emit welcome message for this user
    socket.to(roomName).emit("user-connected", username);
  });

  // When a client sends a message
  socket.on("send-chat-message", (roomName, msg) => {
    socket.to(roomName).emit("chat-message", {
      user: getUser(roomName, socket.id),
      msg,
    });
  });

  // {username, userAvatar}
  function addUser(roomName, socketId, user) {
    rooms[roomName].users[socketId] = user;
  }
  /**
   * @param {string} roomName Name of the room this user is currently chatting
   * @param {string} socketId The socket id to identify the user
   * @returns {User}
   */
  function getUser(roomName, socketId) {
    return rooms[roomName].users[socketId];
  }

  function deleteUser(roomName, socketId) {
    delete rooms[roomName].users[socketId];
  }

  function getUserRooms(socketId) {
    return Object.entries(rooms).reduce((roomNames, [name, room]) => {
      if (room.users[socketId] != null) roomNames.push(name);
      return roomNames;
    }, []);
  }

  // When a user disconnects
  socket.on("disconnect", () => {
    getUserRooms(socket.id).forEach((roomName) => {
      const { username } = getUser(roomName, socket.id);
      socket.to(roomName).emit("user-disconnected", username);
      deleteUser(roomName, socket.id);
    });
  });
});

server.listen(3000, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
