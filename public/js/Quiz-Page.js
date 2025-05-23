document.addEventListener("DOMContentLoaded", () => {

  const popupClose = document.querySelector(".popup-close");
  if (popupClose) {
    popupClose.addEventListener("click", () => {
      document.getElementById("popup").style.display = "none";
    });
  }

  const editProfileBtn   = document.getElementById("editProfileBtn");
  const saveProfileBtn   = document.getElementById("saveProfileBtn");
  const cancelProfileBtn = document.getElementById("cancelProfileBtn");
  const usernameInput    = document.getElementById("profileUsername");
  const emailInput       = document.getElementById("profileEmail");
  const profileModalEl   = document.getElementById('profileModal');

  if (usernameInput && emailInput) {
    const originalUsername = usernameInput.value;
    const originalEmail    = emailInput.value;

    editProfileBtn?.addEventListener("click", () => {
      usernameInput.readOnly = false;
      emailInput.readOnly    = false;
      usernameInput.style.backgroundColor = "#fff";
      emailInput.style.backgroundColor    = "#fff";
      editProfileBtn.style.display   = "none";
      cancelProfileBtn.style.display = "inline-block";
      saveProfileBtn.style.display   = "inline-block";
    });

    saveProfileBtn?.addEventListener("click", () => {
      document.getElementById("profileForm").submit();
      usernameInput.readOnly = true;
      emailInput.readOnly    = true;
      usernameInput.style.backgroundColor = "#e9e9e9";
      emailInput.style.backgroundColor    = "#e9e9e9";
      saveProfileBtn.style.display   = "none";
      cancelProfileBtn.style.display = "none";
      editProfileBtn.style.display   = "inline-block";
    });

    cancelProfileBtn?.addEventListener("click", () => {
      usernameInput.value   = originalUsername;
      emailInput.value      = originalEmail;
      usernameInput.readOnly = true;
      emailInput.readOnly    = true;
      usernameInput.style.backgroundColor = "#e9e9e9";
      emailInput.style.backgroundColor    = "#e9e9e9";
      saveProfileBtn.style.display   = "none";
      cancelProfileBtn.style.display = "none";
      editProfileBtn.style.display   = "inline-block";
    });

    profileModalEl?.addEventListener("hidden.bs.modal", () => {
      usernameInput.value   = originalUsername;
      emailInput.value      = originalEmail;
      usernameInput.readOnly = true;
      emailInput.readOnly    = true;
      usernameInput.style.backgroundColor = "#e9e9e9";
      emailInput.style.backgroundColor    = "#e9e9e9";
      saveProfileBtn.style.display   = "none";
      cancelProfileBtn.style.display = "none";
      editProfileBtn.style.display   = "inline-block";
    });
  }

  const logoutForm = document.querySelector('form[action="/logout"]');
  if (logoutForm) {
    logoutForm.addEventListener('submit', () => {
    });
  }

 console.log("⚡ Quiz-Page.js geladen");

  // 1) Data
  const clubs = [
    { name: "Real Madrid", img: "/Assets/Realmadridlogo.png" },
    { name: "PSG",          img: "/Assets/psglogo.png" },
    { name: "FC Barcelona", img: "/Assets/barcalogo.png" },
    { name: "Arsenal",      img: "/Assets/arsenallogo.png" }
  ];
  const leagues = [
    { name: "Premier League", img: "/Assets/premierleague.png" },
    { name: "La Liga",        img: "/Assets/laliga.png" },
    { name: "Serie A",        img: "/Assets/seriea.png" },
    { name: "Bundesliga",     img: "/Assets/bundesliga.png" }
  ];

  // 2) State
  let score         = 0;
  let highscore     = +localStorage.getItem("highscore") || 0;
  let favLeague     = null;
  const blacklisted = new Set();

  // 3) Elementen
  const roundClub      = el("round-club");
  const clubEmblem     = el("club-emblem");
  const clubOpts       = el("club-options");
  const clubFavBtn     = el("club-fav");
  const clubBlBtn      = el("club-bl");
  const reasonBox      = el("blacklist-reason");
  const reasonInput    = el("reason-input");
  const reasonOkBtn    = el("reason-ok");

  const roundLeague    = el("round-league");
  const leagueEmblem   = el("league-emblem");
  const leagueOpts     = el("league-options");
  const leagueFavBtn   = el("league-fav");

  const endScreen      = el("end-screen");
  const scoreDisp      = el("score-display");
  const highscoreDisp  = el("highscore-display");
  const newHsBox       = el("new-highscore");
  const nameInput      = el("name-input");
  const saveScoreBtn   = el("save-score");
  const playAgainBtn   = el("play-again");

  // Helpers
  function el(id) { return document.getElementById(id); }
  function shuffle(arr) { return arr.sort(() => .5 - Math.random()); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // 4) Flow
  function startQuiz() {
    score = 0;
    blacklisted.clear();
    favLeague = null;
    showClubRound();
  }

  function showClubRound() {
    // Toon alleen club
    roundClub.classList.remove("hidden");
    roundLeague.classList.add("hidden");
    endScreen.classList.add("hidden");
    reasonBox.classList.add("hidden");
    reasonInput.value = "";

    // Kies club
    const club = pick(clubs.filter(c => !blacklisted.has(c.name)));
    clubEmblem.src = club.img;
    clubEmblem.alt = club.name;

    // Favoriet (kun je opslaan) en blacklist
    clubFavBtn.onclick = () => console.log("Favoriete club:", club.name);
    clubBlBtn.onclick  = () => reasonBox.classList.remove("hidden");
    reasonOkBtn.onclick = () => {
      blacklisted.add(club.name);
      showClubRound();
    };

    // Opties
    const opts = shuffle([club]
      .concat(shuffle(clubs.filter(c => c.name !== club.name)).slice(0,3))
    );
    clubOpts.innerHTML = "";
    opts.forEach(o => {
      const col = document.createElement("div");
      col.className = "col-6";
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = o.name;
      btn.onclick = () =>
        o.name === club.name
          ? (score++, showLeagueRound())
          : endQuiz();
      col.appendChild(btn);
      clubOpts.appendChild(col);
    });
  }

  function showLeagueRound() {
    roundClub.classList.add("hidden");
    roundLeague.classList.remove("hidden");
    endScreen.classList.add("hidden");

    const league = pick(leagues);
    leagueEmblem.src = league.img;
    leagueEmblem.alt = league.name;

    leagueFavBtn.disabled = !!favLeague;
    leagueFavBtn.onclick = () => {
      if (!favLeague) {
        favLeague = league.name;
        leagueFavBtn.disabled = true;
      }
    };

    const opts = shuffle([league]
      .concat(shuffle(leagues.filter(l => l.name !== league.name)).slice(0,3))
    );
    leagueOpts.innerHTML = "";
    opts.forEach(o => {
      const col = document.createElement("div");
      col.className = "col-6";
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = o.name;
      btn.onclick = () =>
        o.name === league.name ? showClubRound() : endQuiz();
      col.appendChild(btn);
      leagueOpts.appendChild(col);
    });
  }

  function endQuiz() {
    roundClub.classList.add("hidden");
    roundLeague.classList.add("hidden");
    endScreen.classList.remove("hidden");

    scoreDisp.textContent     = score;
    highscoreDisp.textContent = highscore;
    if (score > highscore) newHsBox.classList.remove("hidden");
  }

  saveScoreBtn.onclick = () => {
    highscore = score;
    localStorage.setItem("highscore", score);
    localStorage.setItem("highscoreName", nameInput.value);
    newHsBox.classList.add("hidden");
    highscoreDisp.textContent = highscore;
  };

  playAgainBtn.onclick = startQuiz;

  // Kick off
  startQuiz();
});
