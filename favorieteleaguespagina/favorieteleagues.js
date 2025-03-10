const removeButtons = document.querySelectorAll(".remove-button");
const container = document.querySelector(".leaguesContainer");
const dropdowns = document.querySelectorAll("select");

const messageDiv = document.createElement("div");
messageDiv.classList.add("message");
messageDiv.textContent = "Je hebt geen favorieten, speel eerst de quiz!";
container.appendChild(messageDiv);

function checkEmpty() {
  if (container.children.length === 1) {
    
    messageDiv.style.display = "block";
  }
}

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("change", function () {
    const selectedValue = dropdown.options[dropdown.selectedIndex].text;

    const infoDiv = dropdown.closest(".league").querySelector(".info");

    infoDiv.textContent = `${selectedValue} (Extra informatie...)`;

    const heartContainer = document.createElement("span");
    heartContainer.classList.add("heart-container");
    heartContainer.innerHTML = `
      <span class="heart">&#9825;</span> <!-- Heart icon (empty initially) -->
    `;

    const existingHeart = infoDiv.querySelector(".heart-container");
    if (!existingHeart) {
      infoDiv.appendChild(heartContainer);
    }

    const heart = heartContainer.querySelector(".heart");
    heart.addEventListener("click", function () {
      heart.classList.toggle("liked");
      if (heart.classList.contains("liked")) {
        heart.innerHTML = "&#10084;"; 
      } else {
        heart.innerHTML = "&#9825;"; 
      }
    });
  });
});

removeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const parentDiv = button.parentElement;
    parentDiv.remove();

    checkEmpty();
  });
});
