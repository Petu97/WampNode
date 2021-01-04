const socket = io("/");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const userContainer = document.getElementById("user-table-container");

//THIS SCRIPT HANDLES SOCKET CONNECTION EVENTS BETWEEN SERVER AND CLIENT

socket.emit("new-user");

//display message
socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("pass-displayname", (username) => {
  document.getElementById("username").innerHTML = username.toString();
});

//display message
socket.on("user-connected", (name) => {
  appendMessage(`${name} connected`);
});

//display message
socket.on("user-disconnected", (name) => {
  appendMessage(`${name} disconnected`);
});

//display online users
socket.on("online-users-list", (userList) => {
  document.getElementById("user-table-container").innerHTML = "";
  userList.forEach(PrintUsers);
  function PrintUsers(name, index) {
    const userElement = document.createElement("div");
    userElement.innerText = name;
    userContainer.append(userElement);
  }
});

//display db chat messages
socket.on("dbdata", (result) => {
  for (i = 0; i < result.length; i++)
    appendMessage(`${result[i].Name}: ${result[i].Message}`);
});

//send messages
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

//display message function
function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
  messageContainer.scrollTop =
    messageContainer.scrollHeight - messageContainer.clientHeight;
}
