function esportaDati() {
  const dati = {
    giocatori: JSON.parse(localStorage.getItem("giocatori") || "[]"),
    partite: JSON.parse(localStorage.getItem("partite") || "[]"),
    luoghi: JSON.parse(localStorage.getItem("luoghi") || "[]")
  };
  const blob = new Blob([JSON.stringify(dati, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "biliardando_backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importaDati(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const dati = JSON.parse(e.target.result);
      localStorage.setItem("giocatori", JSON.stringify(dati.giocatori || []));
      localStorage.setItem("partite", JSON.stringify(dati.partite || []));
      localStorage.setItem("luoghi", JSON.stringify(dati.luoghi || []));
      alert("Dati importati con successo!");
      window.location.reload();
    } catch (err) {
      alert("Errore nell'importazione del file");
    }
  };
  reader.readAsText(file);
}
