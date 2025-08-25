const horarios = {
  juan: { inicio: "09:00", fin: "14:00" },
  carlos: { inicio: "12:00", fin: "18:00" },
  mario: { inicio: "10:00", fin: "16:00" }
};

function generarHoras(inicio, fin) {
  let horas = [];
  let [h, m] = inicio.split(":").map(Number);
  let [hFin, mFin] = fin.split(":").map(Number);

  while (h < hFin || (h === hFin && m < mFin)) {
    let horaStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    horas.push(horaStr);

    m += 30;
    if (m >= 60) {
      m = 0;
      h++;
    }
  }
  return horas;
}

function getCitas() {
  return JSON.parse(localStorage.getItem("citas")) || [];
}

function saveCita(cita) {
  let citas = getCitas();
  citas.push(cita);
  localStorage.setItem("citas", JSON.stringify(citas));
}

function actualizarHoras() {
  const barbero = document.getElementById("barbero").value;
  const fecha = document.getElementById("fecha").value;
  const horaSelect = document.getElementById("hora");

  horaSelect.innerHTML = "<option value=''>-- Selecciona una hora --</option>";

  if (barbero && fecha) {
    let horas = generarHoras(horarios[barbero].inicio, horarios[barbero].fin);
    let citas = getCitas();
    let horasOcupadas = citas
      .filter(c => c.barbero === barbero && c.fecha === fecha)
      .map(c => c.hora);

    let horasDisponibles = horas.filter(h => !horasOcupadas.includes(h));

    horasDisponibles.forEach(h => {
      let option = document.createElement("option");
      option.value = h;
      option.textContent = h;
      horaSelect.appendChild(option);
    });
  }
}

document.getElementById("barbero").addEventListener("change", actualizarHoras);
document.getElementById("fecha").addEventListener("change", actualizarHoras);

document.getElementById("citaForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let nombre = document.getElementById("nombre").value;
  let barbero = document.getElementById("barbero").value;
  let fecha = document.getElementById("fecha").value;
  let hora = document.getElementById("hora").value;
  let motivo = document.getElementById("motivo").value;

  let telefono = "5215555555555";

  let mensaje = `Hola, soy ${nombre}. Quiero agendar una cita con ${barbero.toUpperCase()} el ${fecha} a las ${hora}. Motivo: ${motivo}`;
  let url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  saveCita({ barbero, fecha, hora });
  window.open(url, "_blank");

  document.getElementById("citaForm").reset();
  actualizarHoras();
});
