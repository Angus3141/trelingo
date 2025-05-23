const options = ["chat", "gat", "pat", "nat"];
const correctAnswer = "chat";
let selected = null;

const optionsContainer = document.getElementById("optionsContainer");

options.forEach(option => {
  const div = document.createElement("div");
  div.className = "option";
  div.textContent = option;
  div.onclick = () => {
    document.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
    div.classList.add("selected");
    selected = option;
  };
  optionsContainer.appendChild(div);
});

function playAudio() {
  const synth = window.speechSynthesis;

  // Wait until voices are loaded
  const waitForVoices = setInterval(() => {
    const voices = synth.getVoices();
    if (voices.length !== 0) {
      clearInterval(waitForVoices);

      // Try to find the Italian voice "Luca"
      const italianVoice = voices.find(voice => voice.name === "Luca" || (voice.lang === "it-IT" && voice.name.toLowerCase().includes("luca")));

      const utterance = new SpeechSynthesisUtterance("chat");
      utterance.voice = italianVoice || voices.find(v => v.lang === "it-IT");
      utterance.lang = "it-IT";
      utterance.rate = 0.9;

      synth.speak(utterance);
    }
  }, 100);
}

function checkAnswer() {
  if (selected === correctAnswer) {
    alert("Correct!");
  } else {
    alert("Try again.");
  }
}