document.addEventListener("DOMContentLoaded", () => {
  // --- Games ---
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  const gameOptions = document.querySelectorAll(".game-option");

  gameOptions.forEach(option => {
    option.addEventListener("click", function (event) {
      const gameName = this.querySelector(".game-text").textContent.trim();
      if (gameName !== "Fifa Game") {
        event.preventDefault();
        document.getElementById("popup").style.display = "flex";
      } else {
        if (!isLoggedIn) {
          event.preventDefault();
          let loginPromptModal = new bootstrap.Modal(document.getElementById('loginPromptModal'));
          loginPromptModal.show();
        }
      }
    });
  });

  const popupClose = document.querySelector(".popup-close");
  if (popupClose) {
    popupClose.addEventListener("click", () => {
      document.getElementById("popup").style.display = "none";
    });
  }

  // --- Profiel ---
  const editProfileBtn = document.getElementById("editProfileBtn");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const cancelProfileBtn = document.getElementById("cancelProfileBtn");
  const usernameInput = document.getElementById("profileUsername");
  const emailInput = document.getElementById("profileEmail");
  const closeProfileBtn = document.getElementById("profileModal")

  const originalUsername = usernameInput.value;
  const originalEmail = emailInput.value;

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      usernameInput.readOnly = false;
      emailInput.readOnly = false;
      usernameInput.style.backgroundColor = "#fff";
      emailInput.style.backgroundColor = "#fff";
      editProfileBtn.style.display = "none";
      cancelProfileBtn.style.display = "inline-block";
      saveProfileBtn.style.display = "inline-block";
    });
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", () => {
      console.log("Dummy opslaan:", usernameInput.value, emailInput.value);
      usernameInput.readOnly = true;
      emailInput.readOnly = true;
      usernameInput.style.backgroundColor = "#e9e9e9";
      emailInput.style.backgroundColor = "#e9e9e9";
      saveProfileBtn.style.display = "none";
      cancelProfileBtn.style.display = "none";
      editProfileBtn.style.display = "inline-block";
    });

    if (cancelProfileBtn) {
      cancelProfileBtn.addEventListener("click", () => {
        usernameInput.value = originalUsername;
        emailInput.value = originalEmail;
        usernameInput.readOnly = true;
        emailInput.readOnly = true;
        usernameInput.style.backgroundColor = "#e9e9e9";
        emailInput.style.backgroundColor = "#e9e9e9";
        saveProfileBtn.style.display = "none";
        cancelProfileBtn.style.display = "none";
        editProfileBtn.style.display = "inline-block";
      });
    }

    closeProfileBtn.addEventListener("hidden.bs.modal", function() {
      usernameInput.value = originalUsername;
      emailInput.value = originalEmail;
      usernameInput.readOnly = true;
      emailInput.readOnly = true;
      usernameInput.style.backgroundColor = "#e9e9e9";
      emailInput.style.backgroundColor = "#e9e9e9";
      saveProfileBtn.style.display = "none";
      cancelProfileBtn.style.display = "none";
      editProfileBtn.style.display = "inline-block";
    });
  }
});
