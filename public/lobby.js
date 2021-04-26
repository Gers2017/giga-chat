const roomContainer = document.querySelector(".rooms-container");
const input = document.querySelector("input");

let socket = io();
socket.on("room-created", ({ roomName }) => {
  const roomDiv = document.createElement("div");
  roomDiv.textContent = roomName;
  const roomLink = document.createElement("a");
  roomLink.href = `/${roomName}`;
  roomLink.textContent = "Join room";
  roomContainer.appendChild(roomDiv);
  roomContainer.appendChild(roomLink);
  input.value = "";
});
