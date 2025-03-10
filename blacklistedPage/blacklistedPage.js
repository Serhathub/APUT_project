document.addEventListener("DOMContentLoaded", function () {
    const blacklistClubList = document.getElementById("blacklistClubList");

    const blacklistedClubs = [
        { name: "Real Madrid", logo: "assets/REALMADRID_LOGO.png" },
        { name: "Arsenal", logo: "assets/ARSENAL_LOGO.png" },
        { name: "PSG", logo: "assets/PSG_LOGO.png" },
        { name: "Barcelona", logo: "assets/FC_BARCELONA_LOGO.png" }
    ];

    function renderBlacklistedClubs() {
        blacklistClubList.innerHTML = "";

        blacklistedClubs.forEach((club, index) => {
            const clubItem = document.createElement("div");
            clubItem.classList.add("list-group-item");

            clubItem.innerHTML = `
                <img src="${club.logo}" alt="${club.name}" class="me-3">
                <span class="club-name">${club.name}</span>
                <textarea class="form-control club-notes" placeholder="Voeg een reden toe..."></textarea>
                <button class="btn btn-danger remove-btn" data-index="${index}">Verwijderen</button>
            `;

            blacklistClubList.appendChild(clubItem);
            
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                blacklistedClubs.splice(index, 1);
                renderBlacklistedClubs();
            });
        });
    }

    renderBlacklistedClubs();

    const editProfileBtn = document.getElementById("editProfileBtn");
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const cancelProfileBtn = document.getElementById("cancelProfileBtn");
    const usernameInput = document.getElementById("profileUsername");
    const emailInput = document.getElementById("profileEmail");
    const closeProfileBtn = document.getElementById("profileModal")
  
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
  
      closeProfileBtn.addEventListener("hidden.bs.modal", function() {
        usernameInput.value = originalUsername;
        emailInput.value = originalEmail;
        usernameInput.readOnly = true;
        emailInput.readOnly = true;
        usernameInput.style.backgroundColor = "#e9e9e9";
        emailInput.style.backgroundColor = "#e9e9e9";
        saveProfileBtn.style.display = "none";
        cancelProfileBtn.style.display = "none";
        editProfileBtn.style.display = "inline-block";
      })};
    
});
