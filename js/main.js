// Variabili globali
let giocatori = [];
let luoghi = [];
let partite = [];

// Carica i dati da JSON e da localStorage (ibrido)
async function caricaDati() {
  try {
    // Se localStorage ha già dati, usali
    if (localStorage.getItem("giocatori")) {
      giocatori = JSON.parse(localStorage.getItem("giocatori"));
      luoghi = JSON.parse(localStorage.getItem("luoghi"));
      partite = JSON.parse(localStorage.getItem("partite"));
      console.log("Dati caricati da localStorage");
    } else {
      // Altrimenti carica da data.json
      const response = await fetch("data/data.json");
      const dati = await response.json();
      giocatori = dati.giocatori || [];
      luoghi = dati.luoghi || [];
      partite = dati.partite || [];
      console.log("Dati caricati da data.json");
      salvaLocalStorage();
    }
  } catch (error) {
    console.error("Errore nel caricamento dei dati:", error);
  }
}

// Salva i dati su localStorage
function salvaLocalStorage() {
  localStorage.setItem("giocatori", JSON.stringify(giocatori));
  localStorage.setItem("luoghi", JSON.stringify(luoghi));
  localStorage.setItem("partite", JSON.stringify(partite));
}

// Funzione per esportare i dati in JSON
function esportaDatiJSON() {
  const dati = { giocatori, luoghi, partite };

  const blob = new Blob([JSON.stringify(dati, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "data.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Quando la pagina è pronta
document.addEventListener("DOMContentLoaded", async () => {
  await caricaDati();
  // qui puoi richiamare aggiornaListaGiocatori(), aggiornaListaLuoghi(), ecc.
});
