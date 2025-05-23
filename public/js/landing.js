document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = window.isLoggedIn;

  const gameOptions = document.querySelectorAll(".game-option");
  gameOptions.forEach(option => {
    option.addEventListener("click", function (event) {
      const gameName = this.dataset.game;

      if (gameName !== "Fifa Game") {
        event.preventDefault();
        document.getElementById("popup").style.display = "flex";
        return;
      }

      if (!isLoggedIn) {
        event.preventDefault();
        new bootstrap.Modal(document.getElementById('loginPromptModal')).show();
      }
    });
  });

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
});
