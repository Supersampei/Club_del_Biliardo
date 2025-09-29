let giocatori = JSON.parse(localStorage.getItem("giocatori") || "[]");
let partite = JSON.parse(localStorage.getItem("partite") || "[]");

function aggiornaStatistiche() {
  const div = document.getElementById("statisticheGiocatori");
  div.innerHTML = "";

  if (giocatori.length === 0) {
    div.innerHTML = "<p>Nessun giocatore registrato</p>";
    return;
  }

  const stats = giocatori.map((g, i) => {
    let vittorieFinali = 0, sconfitteFinali = 0;
    let miniVinte = 0, miniTot = 0;

    partite.forEach(p => {
      if (p.giocatori.includes(i)) {
        const idTeam = p.giocatori.indexOf(i) % 2;

        // Risultato finale (match vinto o perso)
        if (p.vittorie[idTeam] > p.vittorie[1 - idTeam]) {
          vittorieFinali++;
        } else if (p.vittorie[idTeam] < p.vittorie[1 - idTeam]) {
          sconfitteFinali++;
        }

        // Mini-partite vinte/perse
        if (p.dettagli && Array.isArray(p.dettagli)) {
          miniVinte += p.dettagli.filter(r => r === "V").length;
          miniTot += p.dettagli.length;
        }
      }
    });

    const totMatch = vittorieFinali + sconfitteFinali;
    const winrate = totMatch > 0 ? (vittorieFinali / totMatch * 100) : 0;

    // Indice di abilità: ponderazione tra winrate e mini-partite vinte
    const indice = miniTot > 0
      ? (winrate * 0.7) + ((miniVinte / miniTot) * 100 * 0.3)
      : winrate; // se non ci sono mini-partite, vale solo il winrate

    return {
      nome: g.nome,
      nickname: g.nickname,
      foto: g.foto,
      vittorie: vittorieFinali,
      sconfitte: sconfitteFinali,
      winrate: winrate.toFixed(2),
      indice: indice.toFixed(2)
    };
  });

  // Ordina per indice abilità
  stats.sort((a, b) => b.indice - a.indice);

  let html = `
    <table class="stats-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Avatar</th>
          <th>Nome (Nickname)</th>
          <th>Vittorie</th>
          <th>Sconfitte</th>
          <th>% Vittorie</th>
          <th>Indice Abilità</th>
        </tr>
      </thead>
      <tbody>
  `;

  stats.forEach((s, idx) => {
    html += `
      <tr>
        <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
        <td style="text-align:center;">
          ${s.foto 
            ? `<img src="${s.foto}" alt="avatar" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">`
            : `<div style="width:40px;height:40px;border-radius:50%;background:#b3c9e6;display:flex;align-items:center;justify-content:center;color:#1967b3;font-weight:bold;">${s.nome.charAt(0)}</div>`
          }
        </td>
        <td>${s.nome} (${s.nickname})</td>
        <td style="color:#28a745;font-weight:bold;">${s.vittorie}</td>
        <td style="color:#dc3545;font-weight:bold;">${s.sconfitte}</td>
        <td style="font-weight:bold;">${s.winrate}%</td>
        <td style="font-weight:bold;background:#e0f0ff;color:#245ab4;">${s.indice}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  div.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", aggiornaStatistiche);
