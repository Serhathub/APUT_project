document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const forgotPopup = document.getElementById("forgotPopup");
    const forgotPopupClose = document.getElementById("forgotPopupClose");
  
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
  });