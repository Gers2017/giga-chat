const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

// <TODO> add a login section to store the username in local storage
let username = "";
if (messages != null) {
  username = prompt("How would you like to be called?");
}
username = username.trim();
if (username === "") {
  username = `Guest${parseInt(Math.random() * 101)}`;
}

const avatars = {
  amber: "images/amber.jpg",
  gigachad: "images/gigachad.jpg",
  pepedeletethis: "images/pepedeletethis.jpg",
};

const userAvatar = getRandomUserAvatar();
const imagePath = avatars[userAvatar];

function getRandomUserAvatar() {
  const avatarKeys = Object.keys(avatars);
  return avatarKeys[Math.floor(Math.random() * avatarKeys.length)];
}

// socket io
let socket = io();

if (username !== null) {
  socket.emit("new-user", roomName, { username, imagePath });
  addInfoMessage(`${username} is in the room`);
  //add event listener to form
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
      const message = input.value;
      socket.emit("send-chat-message", roomName, message);
      // adds it's own message (client)
      addMessage(username, message, imagePath);
      input.value = "";
    }
  });
}

socket.on("chat-message", (data) => {
  const { user, msg } = data;
  const { username, imagePath } = user;
  addMessage(username, msg, imagePath);
});

socket.on("user-connected", (username) => {
  addInfoMessage(`Welcome ${username}!`);
});

socket.on("user-disconnected", (username) => {
  addInfoMessage(`${username} is gone...`);
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
  scrollDown();
}

function scrollDown() {
  messages.scrollTo(0, document.body.scrollHeight);
}

function addInfoMessage(msg) {
  const item = document.createElement("li");
  item.classList.add("info-message");
  item.textContent = msg;
  messages.appendChild(item);
  scrollDown();
}
