function getCitas() {
  return JSON.parse(localStorage.getItem("citas")) || [];
}

function mostrarCitas() {
  let citas = getCitas();
  let container = document.getElementById("citasContainer");
  let noCitas = document.getElementById("noCitas");

  container.innerHTML = "";

  if (citas.length === 0) {
    noCitas.style.display = "block";
    return;
  }

  noCitas.style.display = "none";

  citas.forEach(c => {
    let card = document.createElement("div");
    card.className = "cita-card";
    card.innerHTML = `
      <div class="cita-header">💈 ${c.barbero.toUpperCase()}</div>
      <p class="cita-info">📅 Fecha: <b>${c.fecha}</b></p>
      <p class="cita-info">⏰ Hora: <b>${c.hora}</b></p>
    `;
    container.appendChild(card);
  });
}

function cerrarSesion() {
  window.location.href = "index.html";
}

mostrarCitas();
