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

  const loginForm = document.querySelector("form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");

      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      const validusername = "TestTest12";
      const validPassword = "Test12345!";

      if (username === validusername && password === validPassword) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "../landingpage/landing.html?registered=success";
      } else {
        let errorMessage = document.querySelector(".error-message");
        if (!errorMessage) {
          errorMessage = document.createElement("div");
          errorMessage.classList.add("error-message");
          errorMessage.style.color = "red";
          errorMessage.style.textAlign = "center";
          errorMessage.style.marginBottom = "10px";
          errorMessage.textContent = "Ongeldige login credentials.";
          const submitButton = loginForm.querySelector("button[type='submit']");
          loginForm.insertBefore(errorMessage, submitButton);
          setTimeout(() => {
            errorMessage.remove();
          }, 3000);
        }
      }
    });

    const params = new URLSearchParams(window.location.search);
  if (params.get("registered") === "success") {
      const successMessage = document.createElement("div");
      successMessage.className = "alert alert-success text-center";
      successMessage.style.backgroundColor = "#07F468";
      successMessage.style.color = "#000";
      successMessage.style.marginBottom = "10px";
      successMessage.textContent = "Registratie succesvol!";
    
      const loginBox = document.querySelector(".login-box");
      loginBox.insertBefore(successMessage, loginBox.firstChild);
    
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    }
  }
});