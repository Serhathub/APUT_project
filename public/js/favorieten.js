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
    const res = await fetch(`/api/clubs/search?name=${encodeURIComponent(query)}&excludeBlacklist=true`);
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
        window.location.reload();
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