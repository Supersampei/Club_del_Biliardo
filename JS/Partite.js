let partite = JSON.parse(localStorage.getItem("partite") || "[]");
let giocatori = JSON.parse(localStorage.getItem("giocatori") || "[]");
let luoghi = JSON.parse(localStorage.getItem("luoghi") || "[]");

let currentLog = [];

function aggiornaTendine() {
  const luogoSelect = document.getElementById("luogoPartita");
  luogoSelect.innerHTML = '<option value="">Seleziona luogo</option>';
  luoghi.forEach((l, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = l.nome;
    luogoSelect.appendChild(opt);
  });
}

function mostraSelezioneGiocatori() {
  const modalita = document.getElementById("modalitaGioco").value;
  const container = document.getElementById("selezioneGiocatori");
  container.innerHTML = "";

  const creaSelect = id => {
    const sel = document.createElement("select");
    sel.id = id;
    sel.innerHTML = '<option value="">Seleziona giocatore</option>';
    giocatori.forEach((g, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = g.nome + (g.nickname ? ` (${g.nickname})` : "");
      sel.appendChild(opt);
    });
    return sel;
  };

  if (modalita === "singolo") {
    container.append("Giocatore 1:", creaSelect("p1"), "Giocatore 2:", creaSelect("p2"));
  } else if (modalita === "coppia") {
    container.append("Squadra 1 - G1:", creaSelect("p1"), "G2:", creaSelect("p2"),
                     "Squadra 2 - G1:", creaSelect("p3"), "G2:", creaSelect("p4"));
  } else {
    container.append("Giocatore 1:", creaSelect("p1"),
                     "Giocatore 2:", creaSelect("p2"),
                     "Giocatore 3:", creaSelect("p3"));
  }
}

function aggiungiRisultato() {
  const div = document.createElement("div");
  div.className = "match-result-row";
  div.innerHTML = `
    <input type="text" maxlength="1" placeholder="V/P">
  `;
  document.getElementById("partitaLog").appendChild(div);
  currentLog.push(null);
}

function registraRisultato() {
  const inputs = document.querySelectorAll("#partitaLog input");
  let valid = true;
  currentLog = [];
  inputs.forEach(inp => {
    let val = inp.value.toUpperCase();
    if (val !== "V" && val !== "P") {
      valid = false;
      inp.style.background = "#f8d7da";
    } else {
      inp.style.background = "#d4edda";
      currentLog.push(val);
    }
  });
  if (!valid) alert("Inserisci solo V o P");
}

function terminaMatch() {
  if (currentLog.length === 0) {
    alert("Devi registrare almeno un risultato!");
    return;
  }
  const tipo = document.getElementById("tipoGioco").value;
  const modalita = document.getElementById("modalitaGioco").value;
  const luogo = document.getElementById("luogoPartita").value;
  const data = document.getElementById("dataPartita").value;

  let giocSel = [];
  ["p1", "p2", "p3", "p4"].forEach(id => {
    const el = document.getElementById(id);
    if (el) giocSel.push(parseInt(el.value));
  });

  const vittorie1 = currentLog.filter(v => v === "V").length;
  const vittorie2 = currentLog.length - vittorie1;

  const partita = {
    tipo,
    modalita,
    luogo,
    data,
    giocatori: giocSel,
    vittorie: [vittorie1, vittorie2],
    dettagli: currentLog
  };

  partite.push(partita);
  localStorage.setItem("partite", JSON.stringify(partite));

  currentLog = [];
  document.getElementById("partitaLog").innerHTML = "";
  aggiornaListaPartite();
}

function aggiornaListaPartite() {
  const div = document.getElementById("listaPartite");
  div.innerHTML = "";

  if (partite.length === 0) {
    div.innerHTML = "<p>Nessuna partita registrata</p>";
    return;
  }

  partite.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "partita-card";
    const gnames = p.giocatori.map(id => giocatori[id]?.nome || "???").join(" vs ");
    card.innerHTML = `
      <strong>${p.tipo} (${p.modalita})</strong><br>
      ${gnames}<br>
      Punteggio: ${p.vittorie[0]} - ${p.vittorie[1]}<br>
      Data: ${p.data || "-"} | Luogo: ${luoghi[p.luogo]?.nome || "-"}<br>
      <button onclick="eliminaPartita(${i})" class="delete">Elimina</button>
    `;
    div.appendChild(card);
  });
}

function eliminaPartita(i) {
  if (confirm("Eliminare questa partita?")) {
    partite.splice(i, 1);
    localStorage.setItem("partite", JSON.stringify(partite));
    aggiornaListaPartite();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  aggiornaTendine();
  mostraSelezioneGiocatori();
  aggiornaListaPartite();
});
