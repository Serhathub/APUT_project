// Get all the remove buttons, the container, and all the dropdowns
const removeButtons = document.querySelectorAll(".remove-button");
const container = document.querySelector(".leaguesContainer");
const dropdowns = document.querySelectorAll("select");

// Create the message div (but keep it hidden initially)
const messageDiv = document.createElement("div");
messageDiv.classList.add("message");
messageDiv.textContent = "Je hebt geen favorieten, speel eerst de quiz!";
container.appendChild(messageDiv);

// Function to check if all elements are removed
function checkEmpty() {
  if (container.children.length === 1) {
    // Only the message div remains
    messageDiv.style.display = "block"; // Show the message
  }
}

// Add event listener to each dropdown to update the info div when a selection is made
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("change", function () {
    // Get the selected value
    const selectedValue = dropdown.options[dropdown.selectedIndex].text;

    // Find the corresponding info div (within the same .league div)
    const infoDiv = dropdown.closest(".league").querySelector(".info");

    // Update the info div with the selected value
    infoDiv.textContent = `${selectedValue} (Extra informatie...)`;

    // Add the heart icon toggle
    const heartContainer = document.createElement("span");
    heartContainer.classList.add("heart-container");
    heartContainer.innerHTML = `
      <span class="heart">&#9825;</span> <!-- Heart icon (empty initially) -->
    `;

    // Add the heart container to the info div (if not already there)
    const existingHeart = infoDiv.querySelector(".heart-container");
    if (!existingHeart) {
      infoDiv.appendChild(heartContainer);
    }

    // Add event listener to toggle the heart state
    const heart = heartContainer.querySelector(".heart");
    heart.addEventListener("click", function () {
      heart.classList.toggle("liked"); // Toggle the filled heart class
      if (heart.classList.contains("liked")) {
        heart.innerHTML = "&#10084;"; // Filled heart
      } else {
        heart.innerHTML = "&#9825;"; // Empty heart
      }
    });
  });
});

// Add an event listener to each remove button
removeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Find the parent div (the .child-div) and remove it
    const parentDiv = button.parentElement;
    parentDiv.remove();

    // After each removal, check if the container is empty
    checkEmpty();
  });
});
