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
