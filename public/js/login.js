document.addEventListener("DOMContentLoaded", () => {
  
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