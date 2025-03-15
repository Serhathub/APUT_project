document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("regEmail");
  const passwordInput = document.getElementById("regPassword");
  const passwordConfirmInput = document.getElementById("regPasswordConfirm");

  if (emailInput) emailInput.classList.add("validate-input");
  if (passwordInput) passwordInput.classList.add("validate-input");
  if (passwordConfirmInput) passwordConfirmInput.classList.add("validate-input");

  function validateEmail() {
    const value = emailInput.value;
    const atIndex = value.indexOf("@");
    if (atIndex > -1 && value.indexOf(".", atIndex + 1) !== -1) {
      emailInput.classList.add("valid");
      emailInput.classList.remove("invalid");
    } else {
      emailInput.classList.add("invalid");
      emailInput.classList.remove("valid");
    }
  }

  function validatePasswords() {
    const pass = passwordInput.value;
    const confirm = passwordConfirmInput.value;
    if (pass !== "" && confirm !== "" && pass === confirm) {
      passwordInput.classList.add("valid");
      passwordInput.classList.remove("invalid");
      passwordConfirmInput.classList.add("valid");
      passwordConfirmInput.classList.remove("invalid");
    } else {
      passwordInput.classList.add("invalid");
      passwordInput.classList.remove("valid");
      passwordConfirmInput.classList.add("invalid");
      passwordConfirmInput.classList.remove("valid");
    }
  }

  if (emailInput) {
    emailInput.addEventListener("input", validateEmail);
    emailInput.addEventListener("blur", validateEmail);
    emailInput.addEventListener("focus", () => emailInput.classList.add("active"));
    emailInput.addEventListener("blur", () => emailInput.classList.remove("active"));
  }

  if (passwordInput && passwordConfirmInput) {
    passwordInput.addEventListener("input", validatePasswords);
    passwordInput.addEventListener("blur", validatePasswords);
    passwordInput.addEventListener("focus", () => passwordInput.classList.add("active"));
    passwordInput.addEventListener("blur", () => passwordInput.classList.remove("active"));

    passwordConfirmInput.addEventListener("input", validatePasswords);
    passwordConfirmInput.addEventListener("blur", validatePasswords);
    passwordConfirmInput.addEventListener("focus", () => passwordConfirmInput.classList.add("active"));
    passwordConfirmInput.addEventListener("blur", () => passwordConfirmInput.classList.remove("active"));
  }

  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", (event) => {
      validateEmail();
      validatePasswords();

      if (
        !emailInput.classList.contains("valid") ||
        !passwordInput.classList.contains("valid") ||
        !passwordConfirmInput.classList.contains("valid")
      ) {
        event.preventDefault();
        alert("Email of wachtwoord is ongeldig");
      } else {
        event.preventDefault();
        window.location.href = "../loginPage/login.html?registered=success";
      }
    });
  }

  const pwInput = document.getElementById("regPassword");
  const reqUppercase = [].concat(
    document.getElementById("req-uppercase"),
    document.getElementById("req-uppercase-mobile")
  );
  const reqLength = [].concat(
    document.getElementById("req-length"),
    document.getElementById("req-length-mobile")
  );
  const reqSpecial = [].concat(
    document.getElementById("req-special"),
    document.getElementById("req-special-mobile")
  );
  const reqDigit = [].concat(
    document.getElementById("req-digit"),
    document.getElementById("req-digit-mobile")
  );

  if (pwInput) {
    pwInput.addEventListener("input", () => {
      const value = pwInput.value;
      reqUppercase.forEach(el => {
        if (el) el.checked = /[A-Z]/.test(value);
      });
      reqLength.forEach(el => {
        if (el) el.checked = value.length >= 8;
      });
      reqSpecial.forEach(el => {
        if (el) el.checked = /[^A-Za-z0-9]/.test(value);
      });
      reqDigit.forEach(el => {
        if (el) el.checked = /[0-9]/.test(value);
      });
    });
  }
  document.querySelectorAll('.toggle-password').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input.type === "password") {
        input.type = "text";
        this.innerHTML = '<i class="bi bi-eye-slash"></i>';
      } else {
        input.type = "password";
        this.innerHTML = '<i class="bi bi-eye"></i>';
      }
    });
  });
});
