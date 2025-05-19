const seenCounts = {};

document.addEventListener("DOMContentLoaded", async function () {

  const clubList = document.getElementById("clubList");
  const clubDetail = document.getElementById("clubDetail");
  const clubContent = document.getElementById("clubContent");

  try {
    const res = await fetch("/api/favorites");
    const clubs = await res.json();

    if (!clubs.length) {
      clubList.innerHTML = "<p>Je hebt nog geen favoriete clubs.</p>";
      return;
    }

    clubList.innerHTML = "";

    clubs.forEach(club => {
      seenCounts[club.id] = club.seen || 0;
      const item = document.createElement("div");
      item.className = "list-group-item";

      item.innerHTML = `
        <img src="/club-logo/${club.id}" alt="${club.name}" class="me-3" />
        <span class="club-name">${club.name}</span>
        <div class="form-group d-inline">
            
            <div>Aantal keer LIVE gezien: <span id="count-${club.id}">${seenCounts[club.id]}</span></div>
            <button onclick="incrementCount('${club.id}')">Gezien</button>
        </div>
        <button class="btn btn-dark float-end open-club" data-club='${JSON.stringify(club)}'>OPEN</button>
      `;
      clubList.appendChild(item);
    });
  } catch (err) {
    console.error("Fout bij ophalen favoriete clubs:", err);
    clubList.innerHTML = "<p>Favorieten konden niet geladen worden.</p>";
  }

  clubList.addEventListener("click", function (e) {
    const button = e.target.closest(".open-club");
    if (button) {
      const clubData = JSON.parse(button.getAttribute("data-club"));
      showClubDetails(clubData);
    }
  });

  function showClubDetails(club) {
    const seenCount = seenCounts[club.id] || 0;
    clubContent.innerHTML = `
      <div class="club-detail-box">
        <div class="club-header">
          <div>
            <p><strong>Aantal keer LIVE gezien:</strong></p>
            <h3 id="detail-seen-count">${seenCount}</h3> 
            <button class="btn btn-dark" onclick="incrementCount('${club.id}')">Gezien</button>
          </div>
          <div><h2 class="fs-1">${club.name}</h2></div>
          <div class="club-logo">
            <img src="/club-logo/${club.id}" alt="${club.name}" class="me-3" />
          </div>
        </div>
        <div class="club-details">
          <table class="table table-bordered table-dark">
            <tbody>
              <tr><td><strong>Rating:</strong></td><td>${club.rating || '-'}</td></tr>
              <tr><td><strong>Coach:</strong></td><td>${club.coach || '-'}</td></tr>
              <tr><td><strong>Stadium:</strong></td><td>${club.stadium || '-'}</td></tr>
              <tr><td><strong>League:</strong></td><td>${club.leagueName || '-'}</td></tr>
              <tr><td><strong>Land:</strong></td><td>${club.country || '-'}</td></tr>
            </tbody>
          </table>
          ${club.stadiumImage ? `<img src="${club.stadiumImage}" class="stadium-image" alt="${club.stadium}">` : ''}
        </div>
      </div>
    `;

    document.querySelector(".mb-3").classList.add("d-none");
    clubList.classList.add("d-none");
    clubDetail.classList.remove("d-none");
  }

  window.goBack = function () {
    clubList.classList.remove("d-none");
    clubDetail.classList.add("d-none");
    document.querySelector(".mb-3").classList.remove("d-none");
  };

  window.incrementCount = async function (clubId) {
    try {
      const res = await fetch("/api/favorites/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId: Number(clubId) })
      });

      if (!res.ok) throw new Error("Fout bij updaten seen");

      seenCounts[clubId] = (seenCounts[clubId] || 0) + 1;

      const countElement = document.getElementById(`count-${clubId}`);
      if (countElement) countElement.innerText = seenCounts[clubId];

      const detailCountElement = document.getElementById("detail-seen-count");
      if (detailCountElement) detailCountElement.innerText = seenCounts[clubId];
    } catch (err) {
      console.error("Fout bij verhogen van seen count:", err);
    }
  };

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
});

const searchInput = document.getElementById("clubNameInput");
const searchResults = document.getElementById("searchResults");

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
      seenCounts[club.id] = club.seen || 0;
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = club.name;

      const addBtn = document.createElement("button");
      addBtn.textContent = "Voeg toe";
      addBtn.className = "btn btn-sm btn-success";
      addBtn.onclick = async () => {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clubId: club.id })
        });
        alert(`'${club.name}' is toegevoegd aan je favorieten`);
        searchResults.innerHTML = "";
        searchInput.value = "";
      };

      li.appendChild(addBtn);
      searchResults.appendChild(li);
    });
  } catch (err) {
    console.error("Fout bij zoeken:", err);
    searchResults.innerHTML = `<li class='list-group-item'>Fout bij zoeken: ${err.message || err.toString()}</li>`;
  }
});
