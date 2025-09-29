let luoghi = JSON.parse(localStorage.getItem("luoghi") || "[]");

function aggiungiLuogo() {
  const nome = document.getElementById("nomeLuogo").value.trim();
  const indirizzo = document.getElementById("indirizzoLuogo").value.trim();
  const link = document.getElementById("linkMaps").value.trim();
  const fotoInput = document.getElementById("fotoLuogo");

  if (!nome) {
    alert("Nome luogo obbligatorio");
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    const foto = fotoInput.files[0] ? e.target.result : null;
    luoghi.push({ nome, indirizzo, link, foto });
    localStorage.setItem("luoghi", JSON.stringify(luoghi));
    aggiornaListaLuoghi();
    resetForm();
  };

  if (fotoInput.files[0]) reader.readAsDataURL(fotoInput.files[0]);
  else reader.onload();
}

function resetForm() {
  document.getElementById("nomeLuogo").value = "";
  document.getElementById("indirizzoLuogo").value = "";
  document.getElementById("linkMaps").value = "";
  document.getElementById("fotoLuogo").value = "";
}

function aggiornaListaLuoghi() {
  const div = document.getElementById("listaLuoghi");
  div.innerHTML = "";

  if (luoghi.length === 0) {
    div.innerHTML = "<p>Nessun luogo registrato</p>";
    return;
  }

  luoghi.forEach((l, i) => {
    const card = document.createElement("div");
    card.className = "luogo-card";
    card.innerHTML = `
      <strong>${l.nome}</strong><br>
      <small>${l.indirizzo || "-"}</small><br>
      ${l.link ? `<iframe src="${l.link}" width="100%" height="150" style="border:0;"></iframe>` : ""}
      <img src="${l.foto || 'https://via.placeholder.com/100'}" 
           style="width:100px;height:70px;margin-top:5px;object-fit:cover;">
      <div style="margin-top:5px;display:flex;gap:5px;">
        <button onclick="modificaLuogo(${i})">Modifica</button>
        <button onclick="eliminaLuogo(${i})" class="delete">Elimina</button>
      </div>
    `;
    div.appendChild(card);
  });
}

function modificaLuogo(i) {
  const l = luoghi[i];
  const nome = prompt("Nome:", l.nome);
  const indirizzo = prompt("Indirizzo:", l.indirizzo);
  const link = prompt("Google Maps:", l.link);

  if (!nome) return;
  luoghi[i] = { ...l, nome, indirizzo, link };
  localStorage.setItem("luoghi", JSON.stringify(luoghi));
  aggiornaListaLuoghi();
}

function eliminaLuogo(i) {
  if (confirm("Eliminare questo luogo?")) {
    luoghi.splice(i, 1);
    localStorage.setItem("luoghi", JSON.stringify(luoghi));
    aggiornaListaLuoghi();
  }
}

document.addEventListener("DOMContentLoaded", aggiornaListaLuoghi);
