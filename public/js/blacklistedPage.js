document.addEventListener("DOMContentLoaded", function () {
  const blacklistClubList = document.getElementById("blacklistClubList");
  renderBlacklistedClubs();

  async function renderBlacklistedClubs() {
    try {
      const res = await fetch("/api/blacklist");
      const clubs = await res.json();

      blacklistClubList.innerHTML = "";

      if (clubs.length === 0) {
        document.getElementById("emptyMessage").style.display = "block";
        return;
      }

      document.getElementById("emptyMessage").style.display = "none";

      clubs.forEach((club) => {
        const clubItem = document.createElement("div");
        clubItem.classList.add("list-group-item");

        clubItem.innerHTML = `
        <img src="${club.crest}" alt="${club.name}" class="me-3">
        <span class="club-name">${club.name}</span>
        <textarea class="form-control club-notes" placeholder="Reden voor blacklist...">${club.reason || ""}</textarea>
        <button class="btn btn-danger remove-btn fs-4" data-id="${club.id}">Verwijderen</button>
      `;

        blacklistClubList.appendChild(clubItem);
      });

      document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", async function () {
          const clubId = this.getAttribute("data-id");
          await fetch(`/api/blacklist/${clubId}`, { method: "DELETE" });
          renderBlacklistedClubs();
        });
      });

      document.querySelectorAll(".club-notes").forEach((textarea, i) => {
        const clubId = clubs[i].id;
        textarea.addEventListener("blur", async () => {
          const reason = textarea.value.trim();
          await fetch("/api/blacklist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clubId, reason })
          });
        });
      });

    } catch (err) {
      console.error("Fout bij laden blacklist:", err);
      blacklistClubList.innerHTML = "<p class='text-danger'>Kan blacklist niet laden.</p>";
    }
  }
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
    })
  };

});
