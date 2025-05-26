document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("favoriteForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const clubId = formData.get("clubId");

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Fout");

      alert(result.message || "Club toegevoegd aan favorieten.");
      window.location.href = "/favorieteleagues";
    } catch (err) {
      alert(err.message || "Er is iets misgegaan.");
      window.location.href = "/favorieteleagues";
    }
  });
});
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
