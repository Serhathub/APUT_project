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
});