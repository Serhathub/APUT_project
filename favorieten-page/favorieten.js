document.addEventListener("DOMContentLoaded", function () {
    const clubList = document.getElementById("clubList");
    const clubDetail = document.getElementById("clubDetail");
    const clubContent = document.getElementById("clubContent");

    document.querySelectorAll(".open-club").forEach(button => {
        button.addEventListener("click", function () {
            const club = this.getAttribute("data-club");
            showClubDetails(club);
        });
    });

    function showClubDetails(club) {
        const clubData = {
            barcelona: {
                name: "FC Barcelona",
                logo: "assets/FC_BARCELONA_LOGO.png",
                yearFounded: 1899,
                coach: "Xavi Hernández",
                league: "La Liga",
                squad: [
                    "Marc-André ter Stegen", "Jules Koundé", "Alejandro Balde", "Ronald Araujo", "Andreas Christensen",
                    "Frenkie de Jong", "Gavi", "Pedri", "Robert Lewandowski", "Ansu Fati", "Lamine Yamal"
                ],
                stadium: "Camp Nou",
                country: "Spanje"
            },
            psg: {
                name: "Paris Saint-Germain",
                logo: "assets/PSG_LOGO.png",
                yearFounded: 1970,
                coach: "Christophe Galtier",
                league: "Ligue 1",
                squad: ["Donnarumma", "Hakimi", "Marquinhos", "Ramos", "Nuno Mendes", "Verratti", "Vitinha", "Ruiz", "Mbappé", "Neymar", "Messi"],
                stadium: "Parc des Princes",
                country: "Frankrijk"
            },
            realmadrid: {
                name: "Real Madrid",
                logo: "assets/REALMADRID_LOGO.png",
                yearFounded: 1902,
                coach: "Carlo Ancelotti",
                league: "La Liga",
                squad: ["Courtois", "Carvajal", "Militão", "Alaba", "Mendy", "Modric", "Tchouaméni", "Kroos", "Vinicius Jr", "Benzema", "Rodrygo"],
                stadium: "Santiago Bernabéu",
                country: "Spanje"
            },
            arsenal: {
                name: "Arsenal",
                logo: "assets/ARSENAL_LOGO.png",
                yearFounded: 1886,
                coach: "Mikel Arteta",
                league: "Premier League",
                squad: ["Ramsdale", "White", "Saliba", "Gabriel", "Zinchenko", "Partey", "Odegaard", "Xhaka", "Saka", "Jesus", "Martinelli"],
                stadium: "Emirates Stadium",
                country: "Engeland"
            }
        };

        const selectedClub = clubData[club];

        if (selectedClub) {
            const seenCount = document.getElementById(`count-${club}`).innerText;

            clubContent.innerHTML = `
                <div class="club-detail-box p-3" style="background-color: #07F468; border-radius: 10px;">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p>Aantal keer LIVE gezien:</p>
                            <h3 id="detail-seen-count">${seenCount}</h3> 
                            <button class="btn btn-dark" onclick="incrementCount('${club}')">Gezien</button>
                        </div>
                        <img src="${selectedClub.logo}" alt="${selectedClub.name}" style="width: 80px;">
                    </div>
                    <h2 class="mt-3">${selectedClub.name}</h2>
                    <p><strong>Year Founded:</strong> ${selectedClub.yearFounded}</p>
                    <p><strong>Coach:</strong> ${selectedClub.coach}</p>
                    <p><strong>League:</strong> ${selectedClub.league}</p>
                    <h4>Elftal:</h4>
                    <ol>
                        ${selectedClub.squad.map(player => `<li>${player}</li>`).join("")}
                    </ol>
                    <p><strong>Stadium:</strong> ${selectedClub.stadium}</p>
                    <p><strong>Land:</strong> ${selectedClub.country}</p>
                </div>
            `;

            clubList.classList.add("d-none");
            clubDetail.classList.remove("d-none");
        }
    }


    window.goBack = function () {
        clubList.classList.remove("d-none");
        clubDetail.classList.add("d-none");
    };

    window.incrementCount = function (club) {
        const countElement = document.getElementById(`count-${club}`);
        if (countElement) {
            let count = parseInt(countElement.innerText);
            countElement.innerText = count + 1;
        }
        const detailCountElement = document.getElementById("detail-seen-count");
        if (detailCountElement) {
            let detailCount = parseInt(detailCountElement.innerText);
            detailCountElement.innerText = detailCount + 1;
        }
    };
});


function addNewClub() { 
    const clubNameInput = document.getElementById("clubNameInput");
    const clubName = clubNameInput.value.trim();

    if (clubName === "") {
        alert("Voer een clubnaam in!");
        return;
    }

    const clubList = document.querySelector(".list-group");
    const newClub = document.createElement("div");
    newClub.classList.add("list-group-item");

    newClub.innerHTML = `
        <img src="assets/placeholder_logo.png" alt="${clubName}" class="me-3" ">
        <span class="club-name">${clubName}</span>
        <div class="form-group d-inline">
            <div>Aantal keer LIVE gezien: <span id="count-${clubName.toLowerCase()}">0</span></div>
            <button onclick="incrementCount('${clubName.toLowerCase()}')">Gezien</button>
        </div>
        <button class="btn btn-dark float-end">OPEN</button>
    `;

    clubList.appendChild(newClub);
    clubNameInput.value = "";
}

