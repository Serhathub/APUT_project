
  window.incrementCount = async function (clubId) {
    try {
      const res = await fetch("/api/favorites/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId })
      });

      if (!res.ok) throw new Error("Fout bij updaten seen");

      const span = document.getElementById(`count-${clubId}`);
      if (span) {
        span.textContent = parseInt(span.textContent) + 1;
      }
    } catch (err) {
      console.error("Fout bij verhogen van seen count:", err);
    }
  };