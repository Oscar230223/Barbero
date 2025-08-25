const form = document.getElementById("citaForm");
const barberoSelect = document.getElementById("barbero");
const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("hora");

// 🔧 Cambia esta URL por la de tu backend (ej: Render, Railway, etc)
const API_BASE = "http://localhost:3000/api/citas";
// cuando lo subas será algo como: 
// const API_BASE = "https://tu-backend.onrender.com/api/citas";

// Horarios personalizados por barbero
const horariosBarberos = {
  juan: { inicio: 9, fin: 15 },    // 9:00 - 15:00
  carlos: { inicio: 12, fin: 20 }, // 12:00 - 20:00
  mario: { inicio: 10, fin: 18 }   // 10:00 - 18:00
};

// Generar array de horas cada 30 minutos
function generarHoras(inicio, fin) {
  let horas = [];
  for (let h = inicio; h < fin; h++) {
    horas.push(`${h.toString().padStart(2, "0")}:00`);
    horas.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return horas;
}

// Consultar y mostrar horas disponibles
async function actualizarHorasDisponibles() {
  horaSelect.innerHTML = `<option value="">Cargando...</option>`;
  const barbero = barberoSelect.value;
  const fecha = fechaInput.value;

  if (!barbero || !fecha) {
    horaSelect.innerHTML = `<option value="">-- Selecciona un barbero y fecha --</option>`;
    return;
  }

  try {
    // Consultar citas ya agendadas
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al consultar citas");
    const citas = await res.json();

    // Filtrar ocupadas por barbero y fecha
    const ocupadas = citas
      .filter(c => c.fecha === fecha && c.barbero === barbero)
      .map(c => c.hora);

    // Horarios disponibles según el barbero
    const { inicio, fin } = horariosBarberos[barbero];
    const todasHoras = generarHoras(inicio, fin);

    horaSelect.innerHTML = "";

    todasHoras.forEach(hora => {
      if (!ocupadas.includes(hora)) {
        let option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        horaSelect.appendChild(option);
      }
    });

    if (horaSelect.innerHTML === "") {
      horaSelect.innerHTML = `<option value="">No hay horarios disponibles</option>`;
    }
  } catch (err) {
    console.error(err);
    horaSelect.innerHTML = `<option value="">Error al cargar horas</option>`;
  }
}

// Detectar cambios
barberoSelect.addEventListener("change", actualizarHorasDisponibles);
fechaInput.addEventListener("change", actualizarHorasDisponibles);

// Enviar formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre: document.getElementById("nombre").value,
    barbero: barberoSelect.value,
    fecha: fechaInput.value,
    hora: horaSelect.value,
    motivo: document.getElementById("motivo").value,
  };

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (res.ok) {
      alert("✅ Cita agendada con éxito");
      form.reset();
      horaSelect.innerHTML = `<option value="">-- Selecciona un barbero y fecha --</option>`;
    } else {
      alert("❌ Error al agendar la cita");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error de conexión con el servidor");
  }
});
