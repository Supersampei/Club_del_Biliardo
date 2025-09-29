// Funzione per caricare i dati dal file JSON
async function caricaDatiDaJSON() {
  try {
    const response = await fetch("data/data.json");
    const dati = await response.json();

    // Salviamo in variabili globali
    window.giocatori = dati.giocatori || [];
    window.luoghi = dati.luoghi || [];
    window.partite = dati.partite || [];

    console.log("Dati caricati da data.json:", dati);
  } catch (error) {
    console.error("Errore nel caricamento del file data.json:", error);
    window.giocatori = [];
    window.luoghi = [];
    window.partite = [];
  }
}

// Funzione che aggiorna la lista giocatori
function aggiornaListaGiocatori() {
  const div = document.getElementById("listaGiocatori");
  if (!div) return;

  div.innerHTML = "";

  if (giocatori.length === 0) {
    div.innerHTML = "<p>Nessun giocatore registrato</p>";
    return;
  }

  giocatori.forEach((g) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <img src="${g.foto || "img/default.jpg"}" alt="Foto ${g.nome}" style="width:60px;height:60px;border-radius:50%;margin-right:10px;">
      <div>
        <strong>${g.nome}</strong> (${g.nickname})<br>
        <small>${g.specialita || "-"}</small>
      </div>
    `;
    div.appendChild(card);
  });
}

// Funzione che aggiorna la lista luoghi
function aggiornaListaLuoghi() {
  const div = document.getElementById("listaLuoghi");
  if (!div) return;

  div.innerHTML = "";

  if (luoghi.length === 0) {
    div.innerHTML = "<p>Nessun luogo registrato</p>";
    return;
  }

  luoghi.forEach((l) => {
    const card = document.createElement("div");
    card.className = "luogo-card";
    card.innerHTML = `
      <strong>${l.nome}</strong><br>
      <small>${l.indirizzo}</small><br>
      ${l.maps ? `<a href="${l.maps}" target="_blank">Apri su Google Maps</a>` : ""}
      <p>${l.note || ""}</p>
    `;
    div.appendChild(card);
  });
}

// Funzione che aggiorna la lista partite
function aggiornaListaPartite() {
  const div = document.getElementById("listaPartite");
  if (!div) return;

  div.innerHTML = "";

  if (partite.length === 0) {
    div.innerHTML = "<p>Nessuna partita registrata</p>";
    return;
  }

  partite
    .slice()
    .reverse() // ultima in alto
    .forEach((p) => {
      const g1 = giocatori[p.giocatori[0]]?.nome || "Giocatore 1";
      const g2 = giocatori[p.giocatori[1]]?.nome || "Giocatore 2";
      const luogo = luoghi[p.luogo]?.nome || "-";

      const card = document.createElement("div");
      card.className = "partita-card";
      card.innerHTML = `
        <div><strong>${p.tipo}</strong> (${p.modalita})</div>
        <div>${g1} vs ${g2}</div>
        <div>Risultato: ${p.vittorie[0]} - ${p.vittorie[1]}</div>
        <div>Data: ${p.dataPartita || "-"}</div>
        <div>Luogo: ${luogo}</div>
      `;
      div.appendChild(card);
    });
}

// Funzione che aggiorna la scheda statistiche
function aggiornaStatistiche() {
  const div = document.getElementById("statisticheGiocatori");
  if (!div) return;

  div.innerHTML = "";

  if (giocatori.length === 0) {
    div.innerHTML = "<p>Nessun giocatore registrato</p>";
    return;
  }

  const stats = giocatori.map((g, idx) => {
    let vittorie = 0, sconfitte = 0;
    partite.forEach((p) => {
      if (p.giocatori.includes(idx)) {
        const pos = p.giocatori.indexOf(idx);
        const miei = p.vittorie[pos];
        const avv = p.vittorie[1 - pos];
        if (miei > avv) vittorie++;
        else sconfitte++;
      }
    });
    const partiteGiocate = vittorie + sconfitte;
    const winrate = partiteGiocate ? ((vittorie / partiteGiocate) * 100).toFixed(1) : "0.0";
    return { nome: g.nome, nickname: g.nickname, vittorie, sconfitte, partiteGiocate, winrate };
  });

  let html = `
    <table class="stats-table">
      <thead>
        <tr><th>Giocatore</th><th>Partite</th><th>Vittorie</th><th>Sconfitte</th><th>% Vittorie</th></tr>
      </thead><tbody>
  `;

  stats.forEach((s) => {
    html += `<tr>
      <td>${s.nome} (${s.nickname})</td>
      <td>${s.partiteGiocate}</td>
      <td>${s.vittorie}</td>
      <td>${s.sconfitte}</td>
      <td>${s.winrate}%</td>
    </tr>`;
  });

  html += "</tbody></table>";
  div.innerHTML = html;
}

// Quando la pagina è pronta → carica JSON e aggiorna tutto
document.addEventListener("DOMContentLoaded", async () => {
  await caricaDatiDaJSON();
  aggiornaListaGiocatori();
  aggiornaListaLuoghi();
  aggiornaListaPartite();
  aggiornaStatistiche();
});



