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
  const utterance = new SpeechSynthesisUtterance("chat");
  utterance.lang = "it-IT"; // Use Italian voice
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}

function checkAnswer() {
  if (selected === correctAnswer) {
    alert("Correct!");
  } else {
    alert("Try again.");
  }
}