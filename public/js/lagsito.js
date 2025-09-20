const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

let chatHistory = []; // historial para mantener contexto

function typeText(container, text, delay = 25) {
  container.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    container.textContent += text[i];
    container.style.filter = 'blur(1px)';
    setTimeout(() => container.style.filter = 'blur(0)', delay);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, delay);
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoices = [
    "Microsoft Jorge", 
    "Google español de México", 
    "Google español (México)", 
    "Google español", 
    "Jorge"
  ];

  let selectedVoice = voices.find(v => preferredVoices.some(name => v.name.includes(name)));
  if (!selectedVoice) selectedVoice = voices.find(v => v.lang.includes("es"));

  utterance.voice = selectedVoice;
  window.speechSynthesis.speak(utterance);
}

async function sendMessage() {
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  const userDiv = document.createElement("div");
  userDiv.className = "chat-msg user";
  userDiv.textContent = `Tú: ${userMsg}`;
  chatBox.appendChild(userDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatInput.value = "";

  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-msg typing";
  typingDiv.textContent = "Lagsito está respondiendo...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: userMsg,
        history: chatHistory
      })
    });

    const data = await res.json();
    chatBox.removeChild(typingDiv);

    const lagsitoDiv = document.createElement("div");
    lagsitoDiv.className = "chat-msg lagsito";
    chatBox.appendChild(lagsitoDiv);
    typeText(lagsitoDiv, `Lagsito: ${data.reply}`, 25);
    chatBox.scrollTop = chatBox.scrollHeight;

    speak(data.reply);

    // Guardamos en historial y limitamos a 6 mensajes
    chatHistory.push({ role: "user", content: userMsg });
    chatHistory.push({ role: "assistant", content: data.reply });
    if (chatHistory.length > 6) chatHistory = chatHistory.slice(-6);

  } catch (err) {
    console.error(err);
    chatBox.removeChild(typingDiv);
    const errorDiv = document.createElement("div");
    errorDiv.className = "chat-msg lagsito";
    errorDiv.textContent = "Lagsito: No me puedo conectar 😭";
    chatBox.appendChild(errorDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
