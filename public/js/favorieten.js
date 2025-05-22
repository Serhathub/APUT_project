document.addEventListener("DOMContentLoaded", function () {
const seenCounts = {};
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
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clubId: club.id })
        });

        if (!response.ok) {
          const error = await response.json();
          alert(error.error || "Kon club niet toevoegen.");
          return;
        }

        seenCounts[club.id] = 0;

        const item = document.createElement("div");
        item.className = "list-group-item";

        item.innerHTML = `
    <img src="${club.crest}" alt="${club.name}" class="me-3" />
    <span class="club-name">${club.name}</span>
    <div class="form-group d-inline ms-3">
      <div>Aantal keer LIVE gezien: <span id="count-${club.id}">${seenCounts[club.id]}</span></div>
      <button class="btn btn-secondary" onclick="incrementCount('${club.id}')">Gezien</button>
      <button class="btn btn-danger" onclick="removeFavorite(${club.id})">Verwijder</button>
    </div>
    <a href="/favorieten/club/${club.id}" class="btn btn-dark float-end open-club">OPEN</a>
  `;

        document.getElementById("clubList").appendChild(item);
        searchResults.innerHTML = "";
        searchInput.value = "";
        const noFavMsg = document.querySelector(".no-favorite-msg");
        if (noFavMsg) noFavMsg.remove();
      };

      li.appendChild(addBtn);
      searchResults.appendChild(li);
    });
  } catch (err) {
    console.error("Fout bij zoeken:", err);
    searchResults.innerHTML = `<li class='list-group-item'>Fout bij zoeken: ${err.message || err.toString()}</li>`;
  }
});


});