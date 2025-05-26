document.addEventListener("DOMContentLoaded", () => {

  const quizBox          = document.getElementById("quiz-box");
  const startScreen      = document.getElementById("start-screen");
  const questionScreen   = document.getElementById("question-screen");
  const badgeImg         = document.getElementById("badge-img");
  const optionsContainer = document.getElementById("options-container");
  const thumbsUpBtn      = document.getElementById("thumbs-up");
  const thumbsDownBtn    = document.getElementById("thumbs-down");
  const blacklistModal   = new bootstrap.Modal(document.getElementById("blacklistModal"));
  const reasonInput      = document.getElementById("blacklist-reason");
  const confirmBlacklist = document.getElementById("confirm-blacklist");
  const endScreen        = document.getElementById("end-screen");
  const scoreEl          = document.getElementById("score");
  const highscoreEl      = document.getElementById("highscore");
  const saveNameCont     = document.getElementById("save-name-container");
  const playerNameInput  = document.getElementById("player-name");
  const saveScoreBtn     = document.getElementById("save-score");
  const playAgainBtn     = document.getElementById("play-again");

  let clubs = [], leagues = [];
  let currentType = "club";
  let correctId = null;
  let score = 0;
  let highscore = 0;
  fetch("/api/highscore")
    .then(r => r.json())
    .then(data => {
      highscore = data.highscore;
      highscoreEl.textContent = highscore;
    });

  Promise.all([
    fetch("/api/quiz/clubs").then(r => r.json()),
    fetch("/api/quiz/leagues").then(r => r.json())
  ]).then(([c, l]) => { clubs = c; leagues = l; });

  thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";

  function showPopup(message, type = 'success') {
    const popup = document.createElement('div');
    popup.className = `alert alert-${type} position-absolute start-50 translate-middle-x`;
    popup.classList.add('quiz-popup');
    popup.textContent = message;
    quizBox.appendChild(popup);
    setTimeout(() => popup.remove(), 5000);
  }

  document.getElementById("start-btn").addEventListener("click", () => {
    score = 0;
    currentType = "club";
    startScreen.classList.add("d-none");
    endScreen.classList.add("d-none");
    nextQuestion();
  });

  function nextQuestion() {
    questionScreen.classList.remove("d-none");
    thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";
    reasonInput.value = "";

    const pool = shuffle(currentType === "club" ? clubs : leagues).slice(0,4);
    const choice = pool[Math.floor(Math.random() * pool.length)];
    correctId = choice.id;

    badgeImg.src = choice.crest || choice.emblem;
    badgeImg.alt = choice.name;

    optionsContainer.innerHTML = "";
    pool.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "w-100 option-btn";
      btn.textContent = opt.name;
      btn.dataset.id = opt.id;
      btn.disabled = false;
      const col = document.createElement("div");
      col.className = "col-6 mb-2";
      col.appendChild(btn);
      optionsContainer.appendChild(col);
    });
  }

  optionsContainer.addEventListener("click", e => {
    if (!e.target.matches(".option-btn")) return;
    const picked = Number(e.target.dataset.id);
    document.querySelectorAll(".option-btn").forEach(b => b.disabled = true);

    if (picked === correctId) {
      score++;
      currentType = (currentType === "club" ? "league" : "club");
      nextQuestion();
    } else {
      endQuiz();
    }
  });

  badgeImg.addEventListener("click", () => {
    if (thumbsUpBtn.style.display === "none") {
      thumbsUpBtn.style.display = "inline-block";
      thumbsDownBtn.style.display = currentType === "club" ? "inline-block" : "none";
    } else {
      thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";
    }
  });

  thumbsUpBtn.addEventListener("click", () => {
    if (currentType === "club") {
      fetch("/api/favorites", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ clubId: correctId })
      }).then(res => {
        if (res.ok) showPopup("Club toegevoegd aan favorieten", "success");
      }).finally(() => {
        thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";
      });
    } else {
      fetch("/api/favoriteLeague", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leagueId: correctId })
      })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error);
          showPopup(data.message, "success");
      })
      .catch(err => showPopup(err.message, "warning"))
      .finally(() => {
        thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";
      });
    }
  });

  thumbsDownBtn.addEventListener("click", () => {
    if (currentType === "club") {
      blacklistModal.show();
    }
  });

  confirmBlacklist.addEventListener("click", () => {
    fetch("/api/blacklist", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        clubId: correctId,
        reason: reasonInput.value.trim()
      })
    }).then(res => {
      if (res.ok) showPopup("Club is geblacklist", "danger");
    }).finally(() => {
      blacklistModal.hide();
      thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";
    });
  });

  function endQuiz() {
    questionScreen.classList.add("d-none");
    thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";
    scoreEl.textContent = score;
    endScreen.classList.remove("d-none");
    if (score > highscore) {
      saveNameCont.classList.remove("d-none");
    }
  }

  saveScoreBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) return;

  fetch("/api/highscore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score })
  })
    .then(res => {
      if (res.ok) {
        showPopup("Highscore opgeslagen!", "success");
        highscore = score;
        highscoreEl.textContent = highscore;
        saveNameCont.classList.add("d-none");
      } else {
        showPopup("Kon highscore niet opslaan", "danger");
      }
    });
});

  playAgainBtn.addEventListener("click", () => {
    score = 0;
    endScreen.classList.add("d-none");
    currentType = "club";
    nextQuestion();
  });

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
});
