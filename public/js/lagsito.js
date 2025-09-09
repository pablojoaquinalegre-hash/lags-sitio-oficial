const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

// Mostrar texto letra por letra con efecto blur
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

// 🔊 Función para hablar con voz masculina (buscando en SpeechSynthesis)
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  // Buscar voces masculinas conocidas
  const preferredVoices = [
    "Microsoft Jorge", 
    "Google español de México", 
    "Google español (México)", 
    "Google español", 
    "Jorge"
  ];

  let selectedVoice = voices.find(v => preferredVoices.some(name => v.name.includes(name)));

  if (!selectedVoice) {
    // fallback a cualquier voz en español
    selectedVoice = voices.find(v => v.lang.includes("es"));
  }

  utterance.voice = selectedVoice;
  window.speechSynthesis.speak(utterance);
}

async function sendMessage() {
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  // Mensaje usuario
  const userDiv = document.createElement("div");
  userDiv.className = "chat-msg user";
  userDiv.textContent = `Tú: ${userMsg}`;
  chatBox.appendChild(userDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatInput.value = "";

  // Mensaje "typing"
  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-msg typing";
  typingDiv.textContent = "Lagsito está respondiendo...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: userMsg })
});

    const data = await res.json();
    chatBox.removeChild(typingDiv);

    // Mostrar respuesta letra por letra
    const lagsitoDiv = document.createElement("div");
    lagsitoDiv.className = "chat-msg lagsito";
    chatBox.appendChild(lagsitoDiv);
    typeText(lagsitoDiv, `Lagsito: ${data.reply}`, 25);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 🔊 Reproducir respuesta con voz
    speak(data.reply);

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

// Eventos
chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// 🔄 Cargar voces al inicio
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};
