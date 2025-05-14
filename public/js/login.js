document.addEventListener("DOMContentLoaded", () => {
  const forgotPasswordLink = document.getElementById("forgot-password-link");
  const resetBtn = document.querySelector(".reset-btn");

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      forgotPopup.style.display = "flex";
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

   document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
      const input = document.getElementById(this.dataset.target);
      if (input.type === "password") {
        input.type = "text";
        this.innerHTML = '<i class="bi bi-eye"></i>';
      } else {
        input.type = "password";
        this.innerHTML = '<i class="bi bi-eye-slash"></i>';
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("registered") === "success") {
    const successMessage = document.createElement("div");
    successMessage.className = "alert alert-success text-center mb-3";
    successMessage.textContent = "Registratie succesvol!";
    const loginBox = document.querySelector(".login-box");
    loginBox.insertBefore(successMessage, loginBox.firstChild);
    setTimeout(() => successMessage.remove(), 3000);
  }

  const serverError = document.querySelector('.alert.alert-danger');
  if (serverError) {
    setTimeout(() => serverError.remove(), 3000);
  }
});