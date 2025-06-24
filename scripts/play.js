let movies = [];
let selectedDay = 0;
let game = null;
let attempt = 0;

const guessInput = document.getElementById("guessInput");
const feedback = document.getElementById("feedback");
const hintsDiv = document.getElementById("hints");
const answerBox = document.getElementById("answerContainer");
const finalAnswer = document.getElementById("finalAnswer");
const daySelect = document.getElementById("daySelect");
const hintBtn = document.getElementById("hintBtn");

fetch("movies.json")
  .then((res) => res.json())
  .then((data) => {
    movies = data;
    selectedDay = parseInt(
      localStorage.getItem("selectedDay") ||
        Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % movies.length
    );
    game = movies[selectedDay];
    initGame();
  })
  .catch((err) => {
    console.error("Failed to load movies.json", err);
    feedback.textContent = "Failed to load movie data.";
    feedback.style.color = "crimson";
  });

function initGame() {
  populateDaySelector();
  manualDayChange();
  startCountdown();
}

function showHints() {
  hintsDiv.innerHTML = "";
  for (let i = 0; i <= attempt && i < game.hints.length; i++) {
    const hint = document.createElement("div");
    hint.className = "hint";
    hint.innerHTML = `<strong>Hint ${i + 1}:</strong> ${game.hints[i]}`;
    hintsDiv.appendChild(hint);
  }
  hintBtn.disabled = attempt >= game.hints.length - 1;
  const detailsBtn = document.getElementById("detailsBtn");
  detailsBtn.disabled = attempt < 4;
}

function revealNextHint() {
  if (attempt < game.hints.length - 1) {
    attempt++;
    showHints();
  }
}

function showAnswer() {
  finalAnswer.textContent = game.answer;
  answerBox.style.display = "block";
  hintBtn.disabled = true;
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function submitGuess(event) {
  if (event) event.preventDefault();
  const input = guessInput.value.trim().toLowerCase();
  const distance = levenshtein(input, game.answer.toLowerCase());

  if (distance <= 2) {
    feedback.textContent = "🎉 Correct!";
    feedback.style.color = "green";
    attempt = game.hints.length - 1;
    showHints();
    localStorage.setItem("dayStatus_" + selectedDay, "win");
    showModal("🎉 You got it right!", "", "win");
  } else {
    attempt++;
    if (attempt < game.hints.length) {
      feedback.textContent = "❌ Wrong. Try again.";
      feedback.style.color = "crimson";
      showHints();
    } else {
      if (localStorage.getItem("dayStatus_" + selectedDay) !== "win") {
        localStorage.setItem("dayStatus_" + selectedDay, "lose");
      }
      feedback.textContent = "☠️ Game Over.";
      feedback.style.color = "gray";
      showModal("☠️ Game Over", "You lost!!! Better luck next time!", "lose");
    }
  }
}

function populateDaySelector() {
  daySelect.innerHTML = "";
  for (let i = 0; i < movies.length; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Day ${i + 1}`;
    if (i === selectedDay) opt.selected = true;
    daySelect.appendChild(opt);
  }
}

function changeDay(delta) {
  const newDay = selectedDay + delta;
  if (newDay >= 0 && newDay < movies.length) {
    selectedDay = newDay;
    daySelect.value = newDay;
    manualDayChange();
  }
}

function manualDayChange() {
  selectedDay = parseInt(daySelect.value);
  localStorage.setItem("selectedDay", selectedDay);
  game = movies[selectedDay];
  attempt = 0;
  feedback.textContent = "";
  guessInput.value = "";
  answerBox.style.display = "none";
  showHints();
  document.getElementById("prevBtn").disabled = selectedDay === 0;
  document.getElementById("nextBtn").disabled =
    selectedDay === movies.length - 1;
}

function startCountdown() {
  const el = document.getElementById("countdown");

  function tick() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); 

    const diff = tomorrow - now;

    const h = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
    const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
    const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    el.textContent = `🕒 Next movie in: ${h}h ${m}m ${s}s`;
  }

  tick();
  setInterval(tick, 1000);
}

function showModal(title, message, status) {
  const modal = document.getElementById("resultModal");
  const resultTitle = document.getElementById("resultTitle");
  const resultMessage = document.getElementById("resultMessage");
  const buttonsDiv = document.getElementById("modalButtons");

  resultTitle.textContent = title;
  resultMessage.textContent = message;
  buttonsDiv.innerHTML = "";

  const tryAgainBtn = document.createElement("button");
  tryAgainBtn.textContent = "🔁 Try Again";
  tryAgainBtn.onclick = () => {
    closeModal();
    manualDayChange();
  };
  buttonsDiv.appendChild(tryAgainBtn);

  const otherDatesBtn = document.createElement("button");
  otherDatesBtn.textContent = "📅 View Other Dates";
  otherDatesBtn.onclick = () => {
    window.location.href = "select-day.html";
  };
  buttonsDiv.appendChild(otherDatesBtn);

  if (status === "lose") {
    const revealBtn = document.createElement("button");
    revealBtn.textContent = "👀 Reveal Answer";
    revealBtn.onclick = () => {
      showModal(
        `The answer was: ${game.answer}`,
        "Better luck next time!",
        "revealed"
      );
    };
    buttonsDiv.appendChild(revealBtn);
  }

  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}

function goHome() {
  localStorage.removeItem("selectedDay");
  window.location.replace("index.html");
}

function showDetails() {
  const detailsBox = document.getElementById("movieDetails");
  detailsBox.innerHTML = "";

  for (let key in game.details) {
    const detail = document.createElement("p");
    detail.innerHTML = `<strong>${key}:</strong> ${game.details[key]}`;
    detailsBox.appendChild(detail);
  }

  document.getElementById("detailsModal").style.display = "block";
}

window.addEventListener("click", function (event) {
  const detailsModal = document.getElementById("detailsModal");
  const modalContent = detailsModal.querySelector(".modal-content");
  if (event.target === detailsModal) {
    closeDetailsModal();
  }
});
function closeDetailsModal() {
  document.getElementById("detailsModal").style.display = "none";
}
