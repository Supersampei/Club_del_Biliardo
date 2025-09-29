let giocatori = JSON.parse(localStorage.getItem("giocatori") || "[]");
let partite = JSON.parse(localStorage.getItem("partite") || "[]");

function aggiungiGiocatore() {
  const nome = document.getElementById("nomeGiocatore").value.trim();
  const nickname = document.getElementById("nicknameGiocatore").value.trim();
  const email = document.getElementById("emailGiocatore").value.trim();
  const fotoInput = document.getElementById("fotoGiocatore");

  if (!nome || !nickname) {
    alert("Nome e nickname sono obbligatori!");
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    const foto = fotoInput.files[0] ? e.target.result : null;
    giocatori.push({ nome, nickname, email, foto });
    localStorage.setItem("giocatori", JSON.stringify(giocatori));
    aggiornaListaGiocatori();
    resetForm();
  };

  if (fotoInput.files[0]) reader.readAsDataURL(fotoInput.files[0]);
  else reader.onload();
}

function resetForm() {
  document.getElementById("nomeGiocatore").value = "";
  document.getElementById("nicknameGiocatore").value = "";
  document.getElementById("emailGiocatore").value = "";
  document.getElementById("fotoGiocatore").value = "";
}

function aggiornaListaGiocatori() {
  const div = document.getElementById("listaGiocatori");
  div.innerHTML = "";

  if (giocatori.length === 0) {
    div.innerHTML = "<p>Nessun giocatore registrato</p>";
    return;
  }

  giocatori.forEach((g, i) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="mostraStatisticheGiocatore(${i})">
        <img src="${g.foto || 'https://via.placeholder.com/50'}" 
             alt="Avatar" style="width:50px;height:50px;border-radius:50%;object-fit:cover;">
        <div>
          <strong>${g.nome}</strong> (${g.nickname})<br>
          <small>${g.email || "-"}</small>
        </div>
      </div>
      <div style="margin-top:8px;display:flex;gap:5px;">
        <button onclick="modificaGiocatore(${i})">Modifica</button>
        <button onclick="eliminaGiocatore(${i})" class="delete">Elimina</button>
      </div>
    `;
    div.appendChild(card);
  });
}

function mostraStatisticheGiocatore(idx) {
  const g = giocatori[idx];
  let vittorie = 0, sconfitte = 0, miniVinte = 0, miniTot = 0;
  let partiteGiocatore = [];

  partite.forEach((p, pi) => {
    if (p.giocatori.includes(idx)) {
      const idTeam = p.giocatori.indexOf(idx) % 2;
      vittorie += p.vittorie[idTeam];
      sconfitte += p.vittorie[1 - idTeam];
      miniVinte += p.dettagli.filter(r => r === "V").length;
      miniTot += p.dettagli.length;

      const avversari = p.giocatori
        .filter(id => id !== idx)
        .map(id => giocatori[id]?.nome || "???")
        .join(", ");

      partiteGiocatore.push({
        data: p.data || "-",
        tipo: p.tipo,
        risultato: `${p.vittorie[0]} - ${p.vittorie[1]}`,
        avversari,
        win: p.vittorie[idTeam] > p.vittorie[1 - idTeam]
      });
    }
  });

  const tot = vittorie + sconfitte;
  const winrate = tot > 0 ? (vittorie / tot * 100).toFixed(2) : "0.00";
  const indice = miniTot > 0
    ? Math.min(100, ((miniVinte / miniTot) * 70 + winrate * 0.3)).toFixed(2)
    : 0;

  // Ultime 5 partite
  const ultimePartite = partiteGiocatore
    .slice(-5)
    .reverse()
    .map(p => `
      <div style="padding:6px;margin:4px 0;border-radius:5px;background:${p.win ? "#d4edda" : "#f8d7da"};">
        <strong>${p.data}</strong> - ${p.tipo}<br>
        vs ${p.avversari}<br>
        Risultato: ${p.risultato}
      </div>
    `).join("");

  document.getElementById("dettagliGiocatore").innerHTML = `
    <h3>${g.nome} (${g.nickname})</h3>
    <img src="${g.foto || 'https://via.placeholder.com/100'}" 
         style="width:100px;height:100px;border-radius:50%;margin:10px auto;display:block;">
    <p><strong>Email:</strong> ${g.email || "-"}</p>
    <hr>
    <p><strong>Vittorie:</strong> ${vittorie}</p>
    <p><strong>Sconfitte:</strong> ${sconfitte}</p>
    <p><strong>% Vittorie:</strong> ${winrate}%</p>
    <p><strong>Indice Abilità:</strong> ${indice}</p>
    <hr>
    <h4>Ultime 5 partite</h4>
    ${ultimePartite || "<p>Nessuna partita registrata</p>"}
  `;

  document.getElementById("modalGiocatore").style.display = "flex";
}

function chiudiModal() {
  document.getElementById("modalGiocatore").style.display = "none";
}

function modificaGiocatore(i) {
  const g = giocatori[i];
  const nome = prompt("Nome:", g.nome);
  const nickname = prompt("Nickname:", g.nickname);
  const email = prompt("Email:", g.email);

  if (!nome || !nickname) return;

  giocatori[i] = { ...g, nome, nickname, email };
  localStorage.setItem("giocatori", JSON.stringify(giocatori));
  aggiornaListaGiocatori();
}

function eliminaGiocatore(i) {
  if (confirm("Eliminare questo giocatore?")) {
    giocatori.splice(i, 1);
    localStorage.setItem("giocatori", JSON.stringify(giocatori));
    aggiornaListaGiocatori();
  }
}

document.addEventListener("DOMContentLoaded", aggiornaListaGiocatori);
