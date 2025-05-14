document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM volledig geladen");
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

  function requirementMet(checkboxArray) {
    return checkboxArray.some(el => el && el.checked);
  }

  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", (event) => {
      console.log("Formulier submit event gestart");
      validateEmail();
      validatePasswords();

      if (
        !emailInput.classList.contains("valid") ||
        !passwordInput.classList.contains("valid") ||
        !passwordConfirmInput.classList.contains("valid")
      ) {
        event.preventDefault();
        console.log("Validatie mislukt: Email of wachtwoord ongeldig");
        showErrorMessage("Email of wachtwoord ongeldig");
        return;
      }

      const passwordValue = passwordInput.value;
      const passwordComplexityOK =
        /[A-Z]/.test(passwordValue) &&
        passwordValue.length >= 8 && 
        /[^A-Za-z0-9]/.test(passwordValue) &&
        /[0-9]/.test(passwordValue);

      if (
        !passwordComplexityOK ||
        !requirementMet(reqUppercase) ||
        !requirementMet(reqLength) ||
        !requirementMet(reqSpecial) ||
        !requirementMet(reqDigit)
      ) {
        event.preventDefault();
        console.log("Validatie mislukt: Wachtwoord voldoet niet aan de vereisten");
        showErrorMessage("Wachtwoord voldoet niet aan de vereisten");
        return;
      }

      console.log("Formulier succesvol gevalideerd, redirecten...");
    });
  }

  function showErrorMessage(message) {
    console.log("showErrorMessage aangeroepen met message:", message);
    let errorMessage = document.querySelector(".error-message");
    if (!errorMessage) {
      errorMessage = document.createElement("div");
      errorMessage.classList.add("error-message");
      errorMessage.style.color = "red";
      errorMessage.style.textAlign = "center";
      errorMessage.style.marginBottom = "10px";
      errorMessage.textContent = message;
      console.log("Foutmelding element aangemaakt:", errorMessage);
      const submitButton = registrationForm.querySelector("button[type='submit']");
      registrationForm.insertBefore(errorMessage, submitButton);
      console.log("Foutmelding toegevoegd voor de submit button");
      setTimeout(() => {
        console.log("Foutmelding verwijderd na 3 seconden");
        errorMessage.remove();
      }, 3000);
    } else {
      console.log("Er is al een foutmelding aanwezig.");
    }
  }
  

  const pwInput = document.getElementById("regPassword");
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
        this.innerHTML = '<i class="bi bi-eye"></i>';
      } else {
        input.type = "password";
        this.innerHTML = '<i class="bi bi-eye-slash"></i>';
      }
    });
  });
  
  const serverErrorAlert = document.querySelector('.alert.alert-danger');
  if (serverErrorAlert) {
    setTimeout(() => {
      serverErrorAlert.remove();
    }, 3000);
  }
});
