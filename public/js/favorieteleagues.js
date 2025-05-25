const removeButtons = document.querySelectorAll(".remove-button");
const container = document.querySelector(".leaguesContainer");
const dropdowns = document.querySelectorAll("select");

const messageDiv = document.createElement("div");
messageDiv.classList.add("message");
messageDiv.textContent = "Je hebt geen favoriete league, speel eerst de quiz!";
container.appendChild(messageDiv);

function checkEmpty() {
  if (container.children.length === 1) {
    messageDiv.style.display = "block";
  }
}

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("change", function () {
    const selectedValue = dropdown.options[dropdown.selectedIndex].text;

    const infoDiv = dropdown.closest(".league").querySelector(".info");

    console.log(selectedValue);

    if (selectedValue == "Clubs...") {
      infoDiv.textContent = ``;
    } else {
      infoDiv.textContent = `${selectedValue} (Extra informatie...)`;

      const heartContainer = document.createElement("span");
      heartContainer.classList.add("heart-container");
      heartContainer.innerHTML = `
      <span class="heart">&#9825;</span> <!-- Heart icon (empty initially) -->
    `;

      const existingHeart = infoDiv.querySelector(".heart-container");
      if (!existingHeart) {
        infoDiv.appendChild(heartContainer);
      }

      const heart = heartContainer.querySelector(".heart");
      heart.addEventListener("click", function () {
        heart.classList.toggle("liked");
        if (heart.classList.contains("liked")) {
          heart.innerHTML = "&#10084;";
        } else {
          heart.innerHTML = "&#9825;";
        }
      });
    }
  });
});

removeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const parentDiv = button.parentElement;
    parentDiv.remove();

    checkEmpty();
  });
});
    document.querySelector('.clubsDropdown').addEventListener('change', function () {
      const selectedOption = this.options[this.selectedIndex];
      const infoDiv = document.getElementById('clubInfo');
      infoDiv.innerHTML = "<strong>Geselecteerde club:</strong> " + selectedOption.text;
    });
const editProfileBtn = document.getElementById("editProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const cancelProfileBtn = document.getElementById("cancelProfileBtn");
const usernameInput = document.getElementById("profileUsername");
const emailInput = document.getElementById("profileEmail");
const closeProfileBtn = document.getElementById("profileModal");

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

  closeProfileBtn.addEventListener("hidden.bs.modal", function () {
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
