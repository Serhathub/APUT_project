document.addEventListener("DOMContentLoaded", () => {
  const form       = document.getElementById("registrationForm");
  const username   = document.getElementById("regUsername");
  const email      = document.getElementById("regEmail");
  const pass       = document.getElementById("regPassword");
  const pass2      = document.getElementById("regPasswordConfirm");
  const alertBox   = document.getElementById("errorAlert");

  function showError(msg) {
    alertBox.textContent = msg;
    alertBox.classList.remove("d-none");
    setTimeout(() => alertBox.classList.add("d-none"), 5000);
  }

  form.addEventListener("submit", ev => {
    if (!username.value.trim() ||
        !email.value.trim()    ||
        !pass.value.trim()     ||
        !pass2.value.trim()) {
      ev.preventDefault();
      showError("Vul alle verplichte velden in.");
      return;
    }

    const emailValid = /.+@.+\..+/.test(email.value);
    if (!emailValid) {
      ev.preventDefault();
      showError("Voer een geldig e-mail adres in.");
      return;
    }

    if (pass.value !== pass2.value) {
      ev.preventDefault();
      showError("De wachtwoorden komen niet overeen.");
      return;
    }

    const complexityOk =
      /[A-Z]/.test(pass.value)      &&
      pass.value.length >= 8        &&
      /[^A-Za-z0-9]/.test(pass.value) &&
      /\d/.test(pass.value);

    if (!complexityOk) {
      ev.preventDefault();
      showError("Wachtwoord voldoet niet aan de eisen.");
      return;
    }
  });

  pass.addEventListener("input", () => {
    document.querySelectorAll(".password-requirements input").forEach(cb => {
      switch (cb.id.replace(/-mobile$/, "")) {
        case "req-uppercase": cb.checked = /[A-Z]/.test(pass.value); break;
        case "req-length":    cb.checked = pass.value.length >= 8;    break;
        case "req-special":   cb.checked = /[^A-Za-z0-9]/.test(pass.value); break;
        case "req-digit":     cb.checked = /\d/.test(pass.value);     break;
      }
    });
  });

  document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = document.getElementById(toggle.dataset.target);
      input.type = input.type === "password" ? "text" : "password";
      toggle.innerHTML = input.type === "password"
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
    });
  });
});