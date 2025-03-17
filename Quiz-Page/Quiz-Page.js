const options = document.querySelectorAll('.option');
const hearts = document.querySelectorAll('.heart');
const skipButton = document.querySelector('.skip-button');
let heartCount = hearts.length;

const correctAnswer = 'Real Madrid';

const gameOverPopUp = document.getElementById('gameOverPopUp');
const closepopUpbutton = document.getElementById('closepopUp')
const realMadridLogo = document.getElementById('realMadridLogo');

options.forEach(option => {
  option.addEventListener("click", function () {
      if (this.textContent === correctAnswer) {
          correctPopUp.style.display = "flex";
      } else {
          if (heartCount > 0) { 
              heartCount--;
              hearts[heartCount].classList.add("hidden"); 
          }
      }

      if (heartCount === 0) {
          gameOverPopUp.style.display = "flex";
          realMadridLogo.style.display = "none";
      }
  });
});

skipButton.addEventListener('click', function() {
    if (heartCount > 0) {
        hearts[heartCount - 1].classList.add('hidden');
        heartCount--;
    }
    if (heartCount === 0) {
        gameOverPopUp.style.display = 'flex';
        realMadridLogo.style.display = 'none';
    }
});

closepopUpbutton.addEventListener('click', function(){
    closepopUpbutton.style.display ='none';
    window.location.href = 'Quiz-Page.html'
})

document.addEventListener("DOMContentLoaded", function () {
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
       const correctPopUp = document.createElement("div");
correctPopUp.id = "correctPopUp";
correctPopUp.classList.add("popUp");
correctPopUp.innerHTML = `
    <div class="popUpcontent">
        <h2>Goed gedaan!</h2>
        <p>Je hebt het juiste antwoord gekozen!</p>
        <button id="closeCorrectPopUp" class="closebutton">Sluit</button>
    </div>
`;
document.body.appendChild(correctPopUp);

const closeCorrectPopUpButton = document.getElementById("closeCorrectPopUp");

closeCorrectPopUpButton.addEventListener("click", function () {
    correctPopUp.style.display = "none";
});

      });