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
});
