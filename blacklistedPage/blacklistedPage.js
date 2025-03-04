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
});
