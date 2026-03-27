let conversation = JSON.parse(localStorage.getItem("memory")) || [];
let mode = "normal";

function saveMemory() {
  localStorage.setItem("memory", JSON.stringify(conversation));
}

function setMode(newMode) {
  mode = newMode;
}

function clearMemory() {
  conversation = [];
  localStorage.removeItem("memory");
  document.getElementById("chat").innerHTML = "";
}

function addMessage(role, text) {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p class="${role}"><b>${role}:</b> ${text}</p>`;
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const inputBox = document.getElementById("userInput");
  const message = inputBox.value;
  inputBox.value = "";

  addMessage("user", message);
  conversation.push({ role: "user", content: message });

  let promptPrefix = "";
  if (mode === "simple") promptPrefix = "Explain this simply for a beginner: ";
  if (mode === "deep") promptPrefix = "Explain this in detail like a teacher: ";

  const response = await fetch("/ask", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      messages: conversation,
      mode: promptPrefix
    })
  });

  const data = await response.json();
  const reply = data.reply;

  addMessage("ai", reply);
  conversation.push({ role: "assistant", content: reply });

  saveMemory();
}

async function generateQuiz() {
  const response = await fetch("/ask", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      messages: conversation,
      mode: "Create a short quiz based on this conversation: "
    })
  });

  const data = await response.json();
  addMessage("ai", data.reply);
}
