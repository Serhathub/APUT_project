document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("clubNameInput");
  const searchResults = document.getElementById("searchResults");
  const blacklistContainer = document.getElementById("blacklistClubList");
  const emptyMessage = document.getElementById("emptyMessage");

  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length < 2) {
      searchResults.innerHTML = "";
      return;
    }

    try {
      const res = await fetch(`/api/clubs/search?name=${encodeURIComponent(query)}`);
      const clubs = await res.json();
      searchResults.innerHTML = "";

      clubs.forEach(club => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = club.name;

        const addBtn = document.createElement("button");
        addBtn.textContent = "Voeg toe";
        addBtn.className = "btn btn-sm btn-danger";
        addBtn.onclick = async () => {
          const alreadyExists = document.querySelector(`[data-id="${club.id}"]`);
          if (alreadyExists) {
            alert("Deze club staat al op je blacklist.");
            return;
          }
          const reason = prompt("Geef een reden voor de blacklist:");
          if (!reason) return;
          await fetch("/api/blacklist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clubId: club.id, reason })
          }).then(async res => {
            const data = await res.json();
            if (res.status === 409) {
              alert(data.error || "Deze club staat al op de blacklist.");
              return;
            }
            if (!res.ok) {
              alert(data.error || "Kon club niet blacklisten.");
              return;
            }
            window.location.reload();
            document.getElementById("emptyMessage")?.remove();
            searchResults.innerHTML = "";
            searchInput.value = "";
            if (emptyMessage) emptyMessage.style.display = "none";
          });
        };

        li.appendChild(addBtn);
        searchResults.appendChild(li);
      });
    } catch (err) {
      console.error("Fout bij zoeken:", err);
      searchResults.innerHTML = `<li class='list-group-item'>Fout bij zoeken: ${err.message || err.toString()}</li>`;
    }
  });

  window.removeBlacklisted = function (clubId) {
    fetch(`/api/blacklist/${clubId}`, {
      method: "DELETE"
    }).then(res => {
      if (res.ok) {
        const item = document.querySelector(`[data-id="${clubId}"]`);
        if (item) item.remove();

        const list = document.getElementById("blacklistClubList");
        if (list.children.length === 0) {
          const msg = document.createElement("div");
          msg.id = "emptyMessage";
          msg.className = "alert alert-danger text-center";
          msg.textContent = "Je hebt geen blacklisted clubs.";
          list.parentElement.insertBefore(msg, list);
        }
      }
    }).catch(err => {
      console.error("Fout bij verwijderen uit blacklist:", err);
    });
  };

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
