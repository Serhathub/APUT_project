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
    const seenCounts = {};
    function showClubDetails(club) {
        const clubData = {
            barcelona: {
                name: "FC Barcelona",
                clubRating: "ATK: 90 MID: 85 DEF: 91",
                logo: "assets/FC_BARCELONA_LOGO.png",
                oprichting: 1899,
                coach: "Xavi Hernández",
                league: "La Liga",
                squad: [
                    "Marc-André ter Stegen", "Jules Koundé", "Alejandro Balde", "Ronald Araujo", "Andreas Christensen",
                    "Frenkie de Jong", "Gavi", "Pedri", "Robert Lewandowski", "Ansu Fati", "Lamine Yamal"
                ],
                stadium: "Camp Nou",
                stadiumImage: "./assets/Barcelona_Stadium.jpg",
                country: "Spanje"
            },
            psg: {
                name: "Paris Saint-Germain",
                clubRating: "ATK: 88 MID: 81 DEF: 80",
                logo: "assets/PSG_LOGO.png",
                oprichting: 1970,
                coach: "Christophe Galtier",
                league: "Ligue 1",
                squad: ["Donnarumma", "Hakimi", "Marquinhos", "Ramos", "Nuno Mendes", "Verratti", "Vitinha", "Ruiz", "Mbappé", "Neymar", "Messi"],
                stadium: "Parc des Princes",
                stadiumImage: "./assets/PSG_Stadium.jpg",
                country: "Frankrijk"
            },
            realmadrid: {
                name: "Real Madrid",
                clubRating: "ATK: 93 MID: 90 DEF: 91",
                logo: "assets/REALMADRID_LOGO.png",
                oprichting: 1902,
                coach: "Carlo Ancelotti",
                league: "La Liga",
                squad: ["Courtois", "Carvajal", "Militão", "Alaba", "Mendy", "Modric", "Tchouaméni", "Kroos", "Vinicius Jr", "Benzema", "Rodrygo"],
                stadium: "Santiago Bernabéu",
                stadiumImage: "./assets/RealMadrid_Stadium.jpg",
                country: "Spanje"
            },
            arsenal: {
                name: "Arsenal",
                clubRating: "ATK: 82 MID: 84 DEF: 85",
                logo: "assets/ARSENAL_LOGO.png",
                oprichting: 1886,
                coach: "Mikel Arteta",
                league: "Premier League",
                squad: ["Ramsdale", "White", "Saliba", "Gabriel", "Zinchenko", "Partey", "Odegaard", "Xhaka", "Saka", "Jesus", "Martinelli"],
                stadium: "Emirates Stadium",
                stadiumImage: "./assets/Arsenal_Stadium.jpg",
                country: "Engeland"
            }
        };

        const selectedClub = clubData[club];

        if (selectedClub) {
            let seenCount = seenCounts[club] || 0;
            clubContent.innerHTML = `
                <div class="club-detail-box">
                    <div class="club-header">
                        <div>
                            <p><strong>Aantal keer LIVE gezien:</p>
                            <h3 id="detail-seen-count">${seenCount}</h3> 
                            <button class="btn btn-dark" onclick="incrementCount('${club}')">Gezien</button>
                            <h2 class="mt-3">${selectedClub.name}</h2>
                        </div>
                        <img src="${selectedClub.logo}" alt="${selectedClub.name}">
                    </div>
                    <div class="club-details" style="">
                        <div style="flex: 1; padding-right: 20px;">
                            <p><strong><u>Club ratings:</u></strong> ${selectedClub.clubRating}</p>
                            <p><strong><u>Oprichting:</u></strong> ${selectedClub.oprichting}</p>
                            <p><strong><u>Coach:</u></strong> ${selectedClub.coach}</p>
                            <p><strong><u>League:</u></strong> ${selectedClub.league}</p>
                            <h4><strong><u>Elftal:</u></strong></h4>
                            <ol>
                                ${selectedClub.squad.map(player => `<li>${player}</li>`).join("")}
                            </ol>
                            <p><strong><u>Stadium:</u></strong> ${selectedClub.stadium}</p>
                            <p><strong><u>Land:</u></strong> ${selectedClub.country}</p>
                        </div>
                        <div>
                            <img src="${selectedClub.stadiumImage}" alt="${selectedClub.stadium}" class="stadium-image">
                        </div>
                        
                    </div>
                </div>
            `;
            document.querySelector(".mb-3").classList.add("d-none");
            clubList.classList.add("d-none");
            clubDetail.classList.remove("d-none");
        }
    }


    window.goBack = function () {
        clubList.classList.remove("d-none");
        clubDetail.classList.add("d-none");
        document.querySelector(".mb-3").classList.remove("d-none");
    };

    window.incrementCount = function (club) {
        seenCounts[club] = (seenCounts[club] || 0) + 1;
        const countElement = document.getElementById(`count-${club}`);
        if (countElement) {
            countElement.innerText = seenCounts[club];
        }
        const detailCountElement = document.getElementById("detail-seen-count");
        if (detailCountElement) {
            detailCountElement.innerText = seenCounts[club];
        }
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

