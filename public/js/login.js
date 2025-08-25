document.getElementById("btnUsuario").addEventListener("click", () => {
  window.location.href = "formulario.html";
});

document.getElementById("btnAdmin").addEventListener("click", () => {
  document.getElementById("formAdmin").style.display = "block";
});

document.getElementById("formAdmin").addEventListener("submit", (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  const adminEmail = "admin@barber.com";
  const adminPass = "1234";

  if (correo === adminEmail && password === adminPass) {
    window.location.href = "admin.html";
  } else {
    document.getElementById("errorMsg").style.display = "block";
  }
});
