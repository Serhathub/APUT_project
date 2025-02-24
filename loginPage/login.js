document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const forgotPopup = document.getElementById("forgotPopup");
    const forgotPopupClose = document.getElementById("forgotPopupClose");
    const resetBtn = document.querySelector(".reset-btn");

    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        forgotPopup.style.display = "flex";
      });
    }
  
    if (forgotPopupClose) {
      forgotPopupClose.addEventListener("click", () => {
        forgotPopup.style.display = "none";
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        alert("Wachtwoord reset functionaliteit komt binnenkort!");
        const resetModal = bootstrap.Modal.getInstance(document.getElementById("resetPasswordModal"));
        if (resetModal) {
          resetModal.hide();
        }
      });
    }
  });