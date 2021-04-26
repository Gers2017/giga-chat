const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
const test = false;
let username = "";
if (test) {
  username = "GIGACHAddd";
} else {
  username = prompt("How would you like to be called?");
}
username = username.trim();
if (username === "") {
  username = `Guest${parseInt(Math.random() * 101)}`;
}
//Dejar solo imagePath
const avatars = ["amber", "gigachad", "pepedeletethis"];
const userImagePath = getRandomImagePath();
function getRandomImagePath() {
  const name = avatars[Math.floor(Math.random() * avatars.length)];
  return { name, imagePath: `images/${name}.jpg` };
}

//socket io
let socket = io();

if (username !== null) {
  socket.emit("new-user", { username, userAvatar: userImagePath });
  addInfoMessage(`${username} is in the room`);
}

socket.on("chat-message", (data) => {
  const { user, msg } = data;
  const { username, userAvatar } = user;
  addMessage(username, msg, userAvatar.imagePath);
});

socket.on("user-connected", (username) => {
  addInfoMessage(`Welcome ${username}!`);
});

socket.on("user-disconnected", (username) => {
  addInfoMessage(`${username} is gone...`);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    const message = input.value;
    socket.emit("send-chat-message", message);
    // adds it's own message (client)
    addMessage(username, message, userImagePath.imagePath);
    input.value = "";
  }
});

function addMessage(username, msg, imagePath) {
  const item = document.createElement("li");
  const rightDiv = document.createElement("div");
  rightDiv.classList.add("right");

  if (username !== "") {
    const user = document.createElement("span");
    user.textContent = username;
    rightDiv.appendChild(user);
  }
  // Create image tag
  const image = document.createElement("img");
  image.setAttribute("src", imagePath);
  image.setAttribute("alt", "User profile picture");
  item.appendChild(image);

  //Create paragraph
  const msgParagraph = document.createElement("p");
  msgParagraph.textContent = msg;
  rightDiv.appendChild(msgParagraph);

  // add item to messages
  item.appendChild(rightDiv);
  messages.appendChild(item);
  messages.scrollTo(0, document.body.scrollHeight);
}

function addInfoMessage(msg) {
  const item = document.createElement("li");
  item.classList.add("info-message");
  item.textContent = msg;
  messages.appendChild(item);
}
