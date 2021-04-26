const roomContainer = document.querySelector(".rooms-container");
// const submitBtn = document.querySelector("#submit-room");

let socket = io();
// submitBtn.addEventListener("click", (e) => {
//   e.preventDefault();
// });
socket.on("room-created", ({ roomName }) => {
  const roomDiv = document.createElement("div");
  roomDiv.textContent = roomName;
  const roomLink = document.createElement("a");
  roomLink.href = `/${roomName}`;
  roomLink.textContent = "Join room";
  roomContainer.appendChild(roomDiv);
  roomContainer.appendChild(roomLink);
});
