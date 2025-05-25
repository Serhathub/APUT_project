document.addEventListener("DOMContentLoaded", () => {

  const editProfileBtn   = document.getElementById("editProfileBtn");
  const saveProfileBtn   = document.getElementById("saveProfileBtn");
  const cancelProfileBtn = document.getElementById("cancelProfileBtn");
  const usernameInput    = document.getElementById("profileUsername");
  const emailInput       = document.getElementById("profileEmail");
  const profileModalEl   = document.getElementById("profileModal");
  const profileHighscore = document.getElementById("profileHighscore");

  profileModalEl.addEventListener('show.bs.modal', () => {
  fetch("/api/highscore")
    .then(r => r.json())
    .then(data => {
      highscore = data.highscore;
      highscoreEl.textContent = highscore;
      profileHighscore.value = highscore;
    });
});

  if (usernameInput && emailInput) {
    const origUser  = usernameInput.value;
    const origEmail = emailInput.value;

    editProfileBtn.addEventListener("click", () => {
      usernameInput.readOnly = emailInput.readOnly = false;
      usernameInput.style.backgroundColor = emailInput.style.backgroundColor = "#fff";
      editProfileBtn.style.display = "none";
      cancelProfileBtn.style.display = saveProfileBtn.style.display = "inline-block";
    });

    saveProfileBtn.addEventListener("click", () =>
      document.getElementById("profileForm").submit()
    );

    cancelProfileBtn.addEventListener("click", () => {
      usernameInput.value = origUser;
      emailInput.value    = origEmail;
      usernameInput.readOnly = emailInput.readOnly = true;
      usernameInput.style.backgroundColor = emailInput.style.backgroundColor = "#e9e9e9";
      saveProfileBtn.style.display = cancelProfileBtn.style.display = "none";
      editProfileBtn.style.display = "inline-block";
    });

    profileModalEl.addEventListener("hidden.bs.modal", () => {
      usernameInput.value = origUser;
      emailInput.value    = origEmail;
      usernameInput.readOnly = emailInput.readOnly = true;
      usernameInput.style.backgroundColor = emailInput.style.backgroundColor = "#e9e9e9";
      saveProfileBtn.style.display = cancelProfileBtn.style.display = "none";
      editProfileBtn.style.display = "inline-block";
    });
  }

  // ——————————————————————
  // Quiz logic
  // ——————————————————————
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

  // fetch data
  Promise.all([
    fetch("/api/quiz/clubs").then(r => r.json()),
    fetch("/api/quiz/leagues").then(r => r.json())
  ]).then(([c, l]) => { clubs = c; leagues = l; });

  // hide thumbs initially
  thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";

  // helper: show popup message
  function showPopup(message, type = 'success') {
    const popup = document.createElement('div');
    popup.className = `alert alert-${type} position-absolute start-50 translate-middle-x`;
    popup.style.bottom = '100%';
    popup.style.marginBottom = '-170px';
    popup.textContent = message;
    quizBox.appendChild(popup);
    setTimeout(() => popup.remove(), 5000);
  }

  // START QUIZ
  document.getElementById("start-btn").addEventListener("click", () => {
    score = 0;
    currentType = "club";
    startScreen.classList.add("d-none");
    endScreen.classList.add("d-none");
    nextQuestion();
  });

  function nextQuestion() {
    // reset UI
    questionScreen.classList.remove("d-none");
    thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";
    reasonInput.value = "";

    // choose 4 random
    const pool = shuffle(currentType === "club" ? clubs : leagues).slice(0,4);
    const choice = pool[Math.floor(Math.random() * pool.length)];
    correctId = choice.id;

    // show badge
    badgeImg.src = choice.crest || choice.emblem;
    badgeImg.alt = choice.name;
    badgeImg.style.cursor = "pointer";

    // render options
    optionsContainer.innerHTML = "";
    pool.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary w-100 option-btn";
      btn.textContent = opt.name;
      btn.dataset.id = opt.id;
      btn.disabled = false;
      const col = document.createElement("div");
      col.className = "col-6 mb-2";
      col.appendChild(btn);
      optionsContainer.appendChild(col);
    });
  }

  // option clicked
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

  // badge click: toggle thumbs
  badgeImg.addEventListener("click", () => {
    if (thumbsUpBtn.style.display === "none") {
      thumbsUpBtn.style.display = "inline-block";
      thumbsDownBtn.style.display = currentType === "club" ? "inline-block" : "none";
    } else {
      thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";
    }
  });

  // thumbs up
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
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ leagueId: correctId })
      }).then(res => {
        if (res.status === 409) showPopup("Je hebt al een League in je favorieten staan", "warning");
        else if (res.ok) showPopup("League toegevoegd aan favorieten", "success");
      }).finally(() => {
        thumbsUpBtn.style.display = thumbsDownBtn.style.display = "none";
      });
    }
  });

  // thumbs down (club only)
  thumbsDownBtn.addEventListener("click", () => {
    if (currentType === "club") {
      blacklistModal.show();
    }
  });

  // confirm blacklist
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

  // save score
  saveScoreBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) return;

  // stuur naar server
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

  // play again
  playAgainBtn.addEventListener("click", () => {
    score = 0;
    endScreen.classList.add("d-none");
    currentType = "club";
    nextQuestion();
  });

  // shuffle helper
  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
});
