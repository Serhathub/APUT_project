const options = document.querySelectorAll('.option');
const hearts = document.querySelectorAll('.heart');
const skipButton = document.querySelector('.skip-button');
let heartCount = hearts.length;

const correctAnswer = 'Real Madrid';

const gameOverPopUp = document.getElementById('gameOverPopUp');
const closepopUpbutton = document.getElementById('closepopUp')
const realMadridLogo = document.getElementById('realMadridLogo');

options.forEach(option => {
    option.addEventListener('click', function() {
        if (this.textContent !== correctAnswer) {
            hearts[heartCount - 1].classList.add('hidden');
            heartCount--;
        }
        if (heartCount ===0) {
            gameOverPopUp.style.display = 'flex';
            realMadridLogo.style.display = 'none';
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
